/**
 * build-descriptions.mjs — 建立「整句精確比對」描述字典,寫進 ../../data/dict.json 的 descriptions。
 *
 * 來源表:relevance.mjs 標 route:'desc' 的表(單一事實來源)。每張表「動態掃描所有
 * string 欄」(非寫死欄名)→ 未來該表新增中文欄位(如當年的 ShortDescription)自動納入。
 * 內部欄位(Id/Icon_DDSFile…)EN==TW 會被 add() 過濾,無害。
 *
 * 安全性:descriptions 走「整個文字節點 === 英文」精確比對(translator.js translateLine),
 *   零誤判風險 → 可大方全收;未命中的 key 只是字典裡的死資料,不影響畫面。
 *
 * 描述欄位常是多行(\n);逐行拆開配對,並額外存「整段(換行→空白)」版本,
 * 以同時涵蓋「每句一個節點」與「整段一個節點」兩種 DOM 結構。
 *
 * ⚠️ EN/TW 配對:見 pairRows。曾發生 GGG 送來「列數/順序不同步」的 TW 譯檔,舊版用
 *   Math.min 逐列 join 會在交界點之後整段靜默錯位(實例:4.5.4.1 把「DNT-UNUSED Fill
 *   Me In」佔位列配到武器風味文字「傾注於至鋒之刃的驕傲與喜悅」)。現在:有可用 Id 就
 *   Id join(對插入/刪除/重排免疫);Id 不可用且列數不符 → 整表跳過並告警,絕不硬 join。
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { entriesFor } from './relevance.mjs';

const here = process.cwd();
const dictPath = path.join(here, '..', '..', 'data', 'dict.json');

// [Ref|顯示] -> 顯示;[Ref] -> Ref(與 build-stats.mjs 同規則;poe.ninja 顯示的是 strip 後文字)
const stripRefs = (s) =>
  String(s || '').replace(/\[([^\]]+)\]/g, (_, inner) => {
    const pipe = inner.indexOf('|');
    return pipe === -1 ? inner : inner.slice(pipe + 1);
  });

const norm = (s) => stripRefs(s).replace(/\s+/g, ' ').trim();
const isCJK = (s) => /[㐀-鿿豈-﫿]/.test(s);
const hasLetter = (s) => /[A-Za-z]/.test(s);

// '*' 動態掃欄時要跳過的「名稱類欄位」。名稱(技能名/物品名…)屬於 names 路由,由 build-names
// 處理;若混進 descriptions,statLinePass 會在「技能名那一行」整列 textContent= 替換,連帶
// 把該行的技能 icon(<img>)清掉(實測:Spark/Firestorm DPS 列 icon 消失)。故 desc 不收名稱欄。
const NAME_LIKE_COL = (col) => /name$/i.test(col) || /^id$/i.test(col);

function add(map, en, zh) {
  const e = norm(en);
  const z = norm(zh);
  if (!e || !z || e === z) return false;
  if (!hasLetter(e) || !isCJK(z)) return false;
  if (e.length < 3) return false;
  if (!(e in map)) { map[e] = z; return true; }
  return false;
}

function loadTable(table) {
  try {
    const en = JSON.parse(readFileSync(path.join(here, 'tables', 'English', table + '.json'), 'utf8'));
    const tw = JSON.parse(readFileSync(path.join(here, 'tables', 'Traditional Chinese', table + '.json'), 'utf8'));
    return { en, tw };
  } catch (e) {
    console.warn('skip', table, e.message);
    return null;
  }
}

// 「每列的 Id 都是非空字串且彼此唯一」才算可用 —— schema 有 Id 欄不代表資料有值
// (例:ActiveSkills 的 Id 欄實際全空,build-names 早已踩過「全對到 undefined」)。
function idUsable(rows) {
  if (!rows.length) return false;
  const seen = new Set();
  for (const r of rows) {
    const id = r.Id;
    if (typeof id !== 'string' || !id) return false; // 有一列缺 Id → 整表不可用
    if (seen.has(id)) return false;                  // Id 不唯一 → 不可用
    seen.add(id);
  }
  return true;
}

/**
 * 決定 EN/TW 兩表怎麼配對,回傳 { pairs, mode }。
 *   - 兩邊 Id 都可用 → 以 Id join(對插入/刪除/重排免疫;EN 有而 TW 無 = 新內容未翻,略過)。
 *   - 否則只有「列數相同」才能安全逐列對齊;列數不符 → pairs=null(呼叫端整表跳過並告警),
 *     絕不用 Math.min 硬 join,以免 GGG 送來不同步譯檔時靜默錯位。
 */
export function pairRows(en, tw) {
  if (idUsable(en) && idUsable(tw)) {
    const twById = new Map(tw.map((r) => [r.Id, r]));
    const pairs = [];
    for (const er of en) {
      const zr = twById.get(er.Id);
      if (zr) pairs.push([er, zr]);
    }
    return { pairs, mode: `Id join ${pairs.length}/${en.length}` };
  }
  if (en.length !== tw.length) {
    return { pairs: null, mode: `⚠️ 列數不符 EN=${en.length} TW=${tw.length} → 跳過(逐列 join 不安全)` };
  }
  return { pairs: en.map((er, i) => [er, tw[i]]), mode: `列序對齊 ${en.length}` };
}

function build() {
  const descriptions = {};

  // 依 relevance 的 desc 條目掃描。columns:'*' = 動態掃所有 string 欄(純描述表);
  // columns:[...] = 只掃指定欄(混合表的句子欄)。
  for (const { table, columns } of entriesFor('desc')) {
    const t = loadTable(table);
    if (!t) continue;
    const cols = columns === '*'
      ? Object.keys(t.en[0] || {}).filter((c) => c !== '_index' && !NAME_LIKE_COL(c))
      : columns;
    const { pairs, mode } = pairRows(t.en, t.tw);
    if (!pairs) { console.warn(`${table}: ${mode}`); continue; }
    let n = 0;
    for (const [er, zr] of pairs) {
      for (const f of cols) {
        const ev = er[f];
        const zv = zr[f];
        if (typeof ev !== 'string' || typeof zv !== 'string' || !ev || !zv) continue;
        const eLines = ev.split(/\r?\n/);
        const zLines = zv.split(/\r?\n/);
        for (let k = 0; k < eLines.length && k < zLines.length; k++) {
          if (add(descriptions, eLines[k], zLines[k])) n++;
        }
        if (eLines.length > 1) add(descriptions, eLines.join(' '), zLines.join(' '));
      }
    }
    console.log(`${table}(掃 ${cols.length} 欄, ${mode}): 新增約 ${n} 句`);
  }

  // ClientStrings → descriptions:整句精確比對(特例,非逐欄;見 relevance.mjs SPECIAL)。
  // 自動規則:無佔位符 + 多字 + 夠長(≥12字)就全收 → 未來新增 UI 句子自動納入,不寫死清單。
  // 含佔位符 {N} 的(藥劑回復/消耗等)交給 build-stats 當模板,不進這裡。
  // 同樣走 pairRows(ClientStrings 有 Id)→ 避免與 desc 表相同的逐列錯位風險。
  try {
    const en = JSON.parse(readFileSync(path.join(here, 'tables', 'English', 'ClientStrings.json'), 'utf8'));
    const tw = JSON.parse(readFileSync(path.join(here, 'tables', 'Traditional Chinese', 'ClientStrings.json'), 'utf8'));
    const { pairs, mode } = pairRows(en, tw);
    if (!pairs) {
      console.warn(`ClientStrings: ${mode}`);
    } else {
      let n = 0;
      for (const [er, zr] of pairs) {
        const ev = String(er.Text || '');
        const zv = String(zr.Text || '');
        if (!ev || !zv) continue;
        if (/[{}<>]/.test(ev)) continue;            // 佔位符/標記 → 跳過(佔位符走模板)
        if (norm(ev).length < 12 || !norm(ev).includes(' ')) continue; // 夠長且多字
        const before = Object.keys(descriptions).length;
        const eLines = ev.split(/\r?\n/);
        const zLines = zv.split(/\r?\n/);
        for (let k = 0; k < eLines.length && k < zLines.length; k++) add(descriptions, eLines[k], zLines[k]);
        if (eLines.length > 1) add(descriptions, eLines.join(' '), zLines.join(' '));
        if (Object.keys(descriptions).length > before) n++;
      }
      console.log(`ClientStrings(自動:無佔位符長句, ${mode}): 新增 ${n} 句`);
    }
  } catch (e) {
    console.warn('skip ClientStrings', e.message);
  }

  const dict = JSON.parse(readFileSync(dictPath, 'utf8'));
  const sorted = {};
  for (const k of Object.keys(descriptions).sort()) sorted[k] = descriptions[k];
  dict.descriptions = sorted;
  writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`\n描述字典:${Object.keys(sorted).length} 句 -> dict.json (descriptions)`);
}

// 只有「直接執行」才建構字典;被 import(測試)時只取用 pairRows,無副作用。
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) build();
