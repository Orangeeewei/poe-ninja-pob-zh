/**
 * translator.js — 在 poe.ninja 把英文遊戲術語/名稱/詞綴即時換成繁中
 *
 * 字典來源:
 *   data/dict.json           名稱(POEDB + 遊戲資料匯出:技能/職業/傳奇/通貨/底材/天賦…)
 *   data/ui-labels.json      poe.ninja 介面固定標籤
 *   data/stat-templates.json 詞綴模板(來自遊戲 stat_descriptions，含 {N} 佔位符)
 *
 * 原理:只替換畫面上的文字節點，不動底層資料、input、連結 → 所有功能照常運作。
 */

(() => {
  'use strict';

  // 不進入翻譯的標籤(避免動到輸入框、程式碼、PoB 代碼等)
  const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'CODE', 'PRE', 'SELECT', 'OPTION']);
  // 不進入翻譯的 class(本擴充自己注入的元素;翻譯-only 版目前不注入任何 UI,留空以備擴充)
  const SKIP_CLASS = [];

  let uiMap = null;          // 小寫標籤 -> 中文
  let nameMap = null;        // 精確英文名 -> 中文
  let multiWordRegex = null; // 多字名稱的子字串比對
  let multiWordLookup = null;// 小寫多字名 -> 中文
  let statTemplates = null;  // 詞綴模板:bucketKey -> [{en, zh}]
  let textStats = null;      // 含文字佔位符(技能名等)的模板:已預編 {re, order, zh}
  let descMap = null;        // 整句描述:正規化英文 -> 中文
  const statRegexCache = new Map();

  // 屬性縮寫(poe.ninja 物品需求:"121 Int" / "+5 Str")→ 官方全名
  const ATTR_ABBR = { str: '力量', dex: '敏捷', int: '智慧' };
  function translateAttrAbbr(s) {
    // 「標籤:值」的值部分:屬性縮寫 + 「Level N / Level (N-N)」(賦予技能/需求等)→ 等級 …
    // Level 後面接數字或括號範圍才換(用 lookahead 不吃掉值);避免動到「Level of all」。
    return s
      .replace(/\bLevel\s+(?=[\d(])/g, '等級 ')
      .replace(/([+-]?\d+)\s+(Str|Dex|Int)\b/gi, (m, num, a) => num + ' ' + ATTR_ABBR[a.toLowerCase()]);
  }

  // 符文等「物品類型限制: 詞綴」前綴的中文(找不到就維持英文,詞綴照樣翻)
  const RUNE_PREFIX = {
    'martial weapon': '近戰武器', 'wand or staff': '法杖或長杖', 'caster weapon': '施法武器',
    'armour': '護甲', 'martial weapon or focus': '近戰武器或法器', 'focus': '法器',
    'bow': '弓', 'crossbow': '弩', 'quiver': '箭袋', 'shield': '盾',
  };

  // 詞綴數值樣式:傳奇物品在 poe.ninja 以「數值範圍」顯示詞綴(min-max 卷軸範圍),
  // 如「(252-340)% increased Physical Damage」「+(3-4) to Level of all …」。
  // 故數值樣式要同時認:① 括號範圍 (N-N) / +(N-N) ② 一般單一數字。
  // 範圍分支放前面(較長優先),整個 (N-N) 視為單一佔位符值,才能對上模板 {0}。
  const NUM_PLAIN = '[+-]?\\d+(?:[.,]\\d+)*';
  const STAT_NUM = '[+-]?\\((?:\\d+(?:[.,]\\d+)*)-(?:\\d+(?:[.,]\\d+)*)\\)|' + NUM_PLAIN;
  const statNumRe = new RegExp(STAT_NUM, 'g');
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const processed = new WeakSet();

  function buildIndexes(dict, ui, stats) {
    statTemplates = (stats && stats.templates) || null;
    // 含文字佔位符的模板(如「+{0} to Level of all {1} Skills」,{1}=技能名)→ 預編 regex。
    textStats = compileTextStats((stats && stats.textTemplates) || []);
    descMap = new Map();
    for (const [en, zh] of Object.entries((dict && dict.descriptions) || {})) {
      descMap.set(en.replace(/\s+/g, ' ').trim(), zh);
    }
    uiMap = new Map();
    // 先放自動產生的 UI 字典(物品類別/職業名等,來自官方表),
    // 再放手工 ui-labels.json — 手工的優先權較高,會覆蓋自動的。
    for (const [en, zh] of Object.entries((dict && dict.uiAuto) || {})) {
      uiMap.set(en.toLowerCase(), zh);
    }
    for (const [en, zh] of Object.entries(ui.labels || {})) {
      if (en.startsWith('_')) continue;
      uiMap.set(en.toLowerCase(), zh);
    }

    nameMap = new Map();
    const multiWord = [];
    for (const [en, zh] of Object.entries(dict.names || {})) {
      nameMap.set(en, zh);
      if (en.includes(' ') && en.length >= 5) multiWord.push(en);
    }

    // 多字名稱：長的優先，避免短名先吃掉長名的一部分
    multiWord.sort((a, b) => b.length - a.length);
    multiWordLookup = new Map(multiWord.map((en) => [en.toLowerCase(), nameMap.get(en)]));
    if (multiWord.length) {
      const escaped = multiWord.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // 前後不可緊鄰英數，避免切到別的單字中間
      multiWordRegex = new RegExp('(?<![A-Za-z0-9])(' + escaped.join('|') + ')(?![A-Za-z0-9])', 'gi');
    }
  }

  // 把英文模板(含 {N})編成 { re, order }:逐段 escape 字面、{N} 換成數字捕獲。
  // 逐段處理可保留模板中的「字面數字」(例如 "for 6 seconds") 不被當成佔位符。
  function compileStat(en) {
    let cached = statRegexCache.get(en);
    if (cached !== undefined) return cached;
    let pattern = '';
    let last = 0;
    const order = [];
    const phRe = /\{(\d+)\}/g;
    let pm;
    while ((pm = phRe.exec(en))) {
      pattern += escapeRe(en.slice(last, pm.index)) + '(' + STAT_NUM + ')';
      order.push(Number(pm[1]));
      last = pm.index + pm[0].length;
    }
    pattern += escapeRe(en.slice(last));
    let re = null;
    try { re = new RegExp('^' + pattern + '$'); } catch (e) { re = null; }
    cached = re ? { re, order } : null;
    statRegexCache.set(en, cached);
    return cached;
  }

  // 把含文字佔位符的模板預編:文字 {N} → 捕文字(技能名)、數字 {N} → 捕數字。
  // text 陣列標記哪些 {N} 是文字佔位符(由 build-stats 從 specific_skill handler 推得)。
  function compileTextStats(list) {
    const out = [];
    for (const tpl of list) {
      const textIdx = new Set(tpl.text || []);
      let pattern = '';
      let last = 0;
      const order = [];
      const phRe = /\{(\d+)\}/g;
      let pm;
      while ((pm = phRe.exec(tpl.en))) {
        pattern += escapeRe(tpl.en.slice(last, pm.index));
        const idx = Number(pm[1]);
        const isText = textIdx.has(idx);
        pattern += isText ? '(.+?)' : '(' + STAT_NUM + ')';
        order.push({ idx, isText });
        last = pm.index + pm[0].length;
      }
      pattern += escapeRe(tpl.en.slice(last));
      try { out.push({ re: new RegExp('^' + pattern + '$'), order, zh: tpl.zh }); } catch (e) { /* skip */ }
    }
    return out;
  }

  // 文字佔位符模板比對:命中後,文字佔位符捕到的英文(技能名)再用 nameMap 翻成中文。
  function translateTextStat(line) {
    if (!textStats) return null;
    for (const ts of textStats) {
      const mt = line.match(ts.re);
      if (!mt) continue;
      const values = {};
      ts.order.forEach((o, k) => {
        let v = mt[k + 1];
        if (o.isText) v = (nameMap && nameMap.get(v)) || v; // 技能名英→中(找不到保留英文)
        values[o.idx] = v;
      });
      const zh = ts.zh.replace(/\{(\d+)\}/g, (_, idx) => (idx in values ? values[idx] : '{' + idx + '}'));
      return panguSpace(zh);
    }
    return null;
  }

  // 詞綴:把整行英文敘述比對 stat 模板 → 套用中文模板
  // 例:"8% increased Skill Effect Duration" -> "增加8%技能效果持續時間"
  // 在中文與數字/英數之間補空白(poedb 風格):增加 37% 最大生命
  function panguSpace(s) {
    return s
      .replace(/([一-鿿])([A-Za-z0-9+\-(])/g, '$1 $2')
      .replace(/([A-Za-z0-9%％)\]])([一-鿿])/g, '$1 $2');
  }

  function translateStat(line) {
    if (!statTemplates) return null;
    statNumRe.lastIndex = 0;
    const key = line.replace(statNumRe, '{}');
    const cands = statTemplates[key];
    if (cands) {
      for (const cand of cands) {
        const c = compileStat(cand.en);
        if (!c) continue;
        const mt = line.match(c.re);
        if (!mt) continue;
        const values = {};
        c.order.forEach((idx, k) => { values[idx] = mt[k + 1]; });
        const zh = cand.zh.replace(/\{(\d+)\}/g, (_, idx) => (idx in values ? values[idx] : '{' + idx + '}'));
        return panguSpace(zh);
      }
    }
    // 數字桶沒命中 → 試含文字佔位符的模板(技能等級詞綴等)
    return translateTextStat(line);
  }

  // 整行翻譯:① 整句描述精確比對 ② 詞綴模板 ③「前綴: 詞綴」(符文)
  function translateLine(norm) {
    if (descMap) {
      const d = descMap.get(norm);
      if (d) return d;
    }
    const s = translateStat(norm);
    if (s) return s;
    const m = norm.match(/^(.{1,30}?):\s+(.+)$/);
    if (m) {
      const stat = translateStat(m[2]);
      if (stat) {
        const prefix = RUNE_PREFIX[m[1].toLowerCase()] || (uiMap && uiMap.get(m[1].toLowerCase())) || m[1];
        return prefix + '：' + stat;
      }
    }
    // 符文/附魔詞綴在 poe.ninja 以「[[ … ]]」包住(或單層 [ … ])→ 剝括號翻內層再包回
    const br = norm.match(/^(\[+)\s*(.+?)\s*(\]+)$/);
    if (br) {
      const inner = translateLine(br[2]);
      if (inner) return br[1] + ' ' + inner + ' ' + br[3];
    }
    return null;
  }

  // 是否該跳過這個文字節點
  function shouldSkip(node) {
    let el = node.parentElement;
    while (el) {
      if (SKIP_TAGS.has(el.tagName)) return true;
      if (el.isContentEditable) return true;
      for (const c of SKIP_CLASS) if (el.classList && el.classList.contains(c)) return true;
      el = el.parentElement;
    }
    return false;
  }

  // 翻譯單一文字節點，回傳是否有改動
  function translateTextNode(node) {
    const raw = node.nodeValue;
    if (!raw) return false;
    const trimmed = raw.trim();
    if (!trimmed) return false;
    // 已是中文(沒有英文字母)就不用處理
    if (!/[A-Za-z]/.test(trimmed)) return false;

    // 1) UI 標籤:整個節點精確比對(大小寫無關)
    const ui = uiMap.get(trimmed.toLowerCase());
    if (ui) {
      node.nodeValue = raw.replace(trimmed, ui);
      return true;
    }

    // 2) 名稱:整個節點精確比對
    const exact = nameMap.get(trimmed);
    if (exact) {
      node.nodeValue = raw.replace(trimmed, exact);
      return true;
    }

    // 3) 詞綴/數據敘述/整句描述:整行比對
    const line = translateLine(trimmed.replace(/\s+/g, ' '));
    if (line) {
      node.nodeValue = raw.replace(trimmed, line);
      return true;
    }

    // 3b) UI「標籤:值」或純標籤+冒號(poe.ninja 常見:Requires: / Stack Size: /
    //     Support Gem Requirements: +5 Str)。標籤必須在 UI 字典才翻,值保留並翻屬性縮寫。
    const cm = trimmed.match(/^([A-Za-z][A-Za-z .'/()-]{0,32}?)\s*([:：])\s*(.*)$/);
    if (cm) {
      let labelZh = uiMap.get(cm[1].toLowerCase());
      // 標籤帶「(狀態)」尾綴(魔像詞綴:Body Armour (Bonded) / Sceptre (Bonded))→
      // 翻基礎類別 + 括號內狀態(Bonded→命定),如「胸甲(命定)」。
      if (!labelZh) {
        const pm = cm[1].match(/^(.*?)\s*\(([^)]+)\)\s*$/);
        if (pm) {
          const bk = pm[1].trim().toLowerCase();
          const base = uiMap.get(bk) || RUNE_PREFIX[bk]; // 武器類別(近戰武器/法杖…)重用符文前綴表
          if (base) labelZh = base + '（' + (uiMap.get(pm[2].trim().toLowerCase()) || pm[2].trim()) + '）';
        }
      }
      if (labelZh) {
        const restRaw = cm[3];
        let rest = '';
        if (restRaw) {
          rest = translateAttrAbbr(restRaw);
          // rest 內可能含名稱(如「賦予技能: 等級 18 Herald of Ash」的技能名)→ 一併翻譯
          if (multiWordRegex) {
            multiWordRegex.lastIndex = 0;
            rest = rest.replace(multiWordRegex, (m) => multiWordLookup.get(m.toLowerCase()) || m);
          }
        }
        const out = restRaw ? labelZh + '：' + rest : labelZh + cm[2];
        node.nodeValue = raw.replace(trimmed, out);
        return true;
      }
    }

    // 3c) 屬性需求縮寫:任意節點中「數字 + Str/Dex/Int」(限數字相鄰,安全)
    if (/\d\s+(?:Str|Dex|Int)\b/i.test(trimmed)) {
      const out = translateAttrAbbr(trimmed);
      if (out !== trimmed) {
        node.nodeValue = raw.replace(trimmed, out);
        return true;
      }
    }

    // 4) 多字名稱:子字串替換(例如 "Level 93 Spirit Walker")
    if (multiWordRegex) {
      multiWordRegex.lastIndex = 0;
      if (multiWordRegex.test(trimmed)) {
        multiWordRegex.lastIndex = 0;
        node.nodeValue = raw.replace(multiWordRegex, (m) => multiWordLookup.get(m.toLowerCase()) || m);
        return true;
      }
    }

    return false;
  }

  // 區塊級標籤:用來判斷「這個元素是不是單獨一行詞綴」(行容器內只會有 inline 子元素)
  const BLOCK_SEL = 'div,p,ul,ol,li,table,thead,tbody,tr,td,th,section,article,header,footer,nav,h1,h2,h3,h4,h5,h6,hr,form,button';

  function depth(el) {
    let d = 0;
    for (let p = el.parentElement; p; p = p.parentElement) d++;
    return d;
  }

  // 詞綴整行:poe.ninja 會把一行詞綴拆成多個節點(關鍵字是獨立 span)。
  // 這裡在「整行容器元素」層級取英文全文比對模板，命中就把整行換成完整中文。
  function statLinePass(root) {
    if (!statTemplates) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode(el) {
        if (el.__pobTx) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS.has(el.tagName)) return NodeFilter.FILTER_REJECT;
        if (el.classList) for (const c of SKIP_CLASS) if (el.classList.contains(c)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const els = [];
    let e;
    while ((e = walker.nextNode())) els.push(e);
    els.sort((a, b) => depth(b) - depth(a)); // 最深(最內層的行)優先
    for (const el of els) {
      if (el.__pobTx || !el.isConnected) continue;    // 已處理 / 已被上層替換而脫離
      if (el.childElementCount === 0) continue;       // 單一文字節點的行 → 交給 translateTextNode
      if (el.querySelector(BLOCK_SEL)) continue;       // 含區塊子元素 → 不是單行
      // 含圖示/媒體(技能 icon 等)→ 不整列 textContent= 替換(會把 <img> 清掉);
      // 交給文字節點層翻譯(只動文字、保留 icon)。詞綴行不含圖,故不影響詞綴整行合併。
      if (el.querySelector('img,svg,canvas,picture,video,image')) continue;
      const norm = el.textContent.replace(/\s+/g, ' ').trim();
      if (!norm || !/[A-Za-z]/.test(norm)) continue;
      const zh = translateLine(norm);
      if (zh) {
        el.textContent = zh;     // 整行換成中文(關鍵字 span 一併清掉，不再中英混雜)
        el.__pobTx = true;
      }
    }
  }

  function walk(root) {
    if (!uiMap) return;
    statLinePass(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (processed.has(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (shouldSkip(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      translateTextNode(node);
      processed.add(node);
    }
  }

  // poe.ninja 是 SPA，內容會動態載入 → 用 MutationObserver + debounce 重掃
  let scheduled = false;
  function schedule(target) {
    if (scheduled) return;
    scheduled = true;
    const run = () => {
      scheduled = false;
      walk(target || document.body);
    };
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 500 });
    else setTimeout(run, 100);
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      // 有新增節點或文字變動就重掃(節點已處理過的會被 WeakSet 擋掉)
      for (const m of mutations) {
        if (m.addedNodes.length || m.type === 'characterData') {
          // 文字變動的節點要重新評估
          if (m.type === 'characterData') processed.delete(m.target);
          schedule(document.body);
          break;
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function loadJson(file) {
    return fetch(chrome.runtime.getURL(file)).then((r) => r.json()).catch(() => null);
  }

  // 名稱字典與詞綴模板:若 background 下載的快取 build 比內建新，才採用快取，避免倒退。
  async function loadData() {
    const bundledVer = await loadJson('data/version.json');
    const bundledBuild = (bundledVer && bundledVer.build) || 0;
    try {
      const cache = await chrome.storage.local.get(['dictData', 'statData', 'dataBuild']);
      if (cache && cache.dataBuild > bundledBuild && cache.dictData && cache.dictData.names) {
        return { dict: cache.dictData, stats: cache.statData || (await loadJson('data/stat-templates.json')) };
      }
    } catch (_) {
      /* storage 不可用就用內建 */
    }
    const [dict, stats] = await Promise.all([
      loadJson('data/dict.json'),
      loadJson('data/stat-templates.json'),
    ]);
    return { dict, stats };
  }

  async function loadDicts() {
    const [{ dict, stats }, ui] = await Promise.all([loadData(), loadJson('data/ui-labels.json')]);
    return { dict, ui, stats };
  }

  async function init() {
    try {
      const { dict, ui, stats } = await loadDicts();
      buildIndexes(dict, ui, stats);
      walk(document.body);
      startObserver();
      console.log(
        '[PoB Translator] 已載入:名稱 ' + Object.keys(dict.names || {}).length +
        ' 筆、UI ' + Object.keys((ui && ui.labels) || {}).length +
        ' 筆、詞綴模板 ' + ((stats && stats.count) || 0) + ' 筆'
      );
    } catch (e) {
      console.error('[PoB Translator] 初始化失敗:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
