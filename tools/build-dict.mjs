/**
 * build-dict.mjs — 從 poe2db.tw 建立英文→繁中名稱字典
 *
 * 原理：poe2db 同一個 slug 有 /us/(英文)與 /tw/(繁中)兩種版本。
 *   <a href="/us/Herald_of_Ash">Herald of Ash</a>  (英文頁)
 *   <a href="/tw/Herald_of_Ash">灰燼之捷</a>        (中文頁)
 * 以 slug 當鍵 join，得到精確的「英文 → 中文」對照。
 *
 * 用法：node tools/build-dict.mjs
 * 產出：data/dict.json
 *
 * 改版後要更新字典，重跑這支即可。
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'data', 'dict.json');

// 要抓的分類頁(只填 slug，會自動組 /us/ 與 /tw/)。
// 之後想擴充翻譯範圍，往這裡加 slug 即可。
const CATEGORIES = [
  // 技能 / 寶石
  'Skill_Gems',
  'Support_Gems',
  'Spirit_Gems',
  // 職業 / 昇華
  'Ascendancy_class',
  // 傳奇物品
  'Unique_item',
  // 底材(武器)
  'Spears', 'Quarterstaves', 'Crossbows', 'Bows', 'Wands', 'Staves',
  'Sceptres', 'Maces', 'Flails', 'Daggers', 'Claws', 'Swords', 'Axes', 'Foci',
  // 底材(防具 / 配件)
  'Helmets', 'Body_Armours', 'Gloves', 'Boots', 'Shields', 'Quivers',
  'Bucklers', 'Rings', 'Amulets', 'Belts', 'Charms', 'Life_Flasks', 'Mana_Flasks',
  // 其他常見
  'Waystones', 'Runes',
];

const UA = { 'User-Agent': 'Mozilla/5.0 (poe-ninja-translator dict builder)' };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 抓某分類頁某語言，回傳 { slug: 顯示文字 }；503/網路錯誤時退避重試。
async function fetchPairs(slug, lang, attempt = 1) {
  const url = `https://poe2db.tw/${lang}/${slug}`;
  let res;
  try {
    res = await fetch(url, { headers: UA });
  } catch (e) {
    if (attempt <= 3) { await sleep(1500 * attempt); return fetchPairs(slug, lang, attempt + 1); }
    console.warn(`  ! ${lang}/${slug} -> ${e.message}`);
    return {};
  }
  if (res.status === 503 || res.status === 429) {
    if (attempt <= 3) { await sleep(2000 * attempt); return fetchPairs(slug, lang, attempt + 1); }
  }
  if (!res.ok) {
    console.warn(`  ! ${lang}/${slug} -> HTTP ${res.status}`);
    return {};
  }
  const html = await res.text();
  const map = {};
  // 抓所有指向實體頁的連結:<a ... href="/us|tw/Slug" ...>顯示文字</a>
  const re = /<a[^>]+href="\/(?:us|tw)\/([A-Za-z0-9_'%().-]+)"[^>]*>([^<]{1,60})<\/a>/g;
  let m;
  while ((m = re.exec(html))) {
    const itemSlug = decodeURIComponent(m[1]);
    const text = m[2].trim();
    if (!text) continue;
    if (!(itemSlug in map)) map[itemSlug] = text; // 取第一次出現
  }
  return map;
}

const hasCJK = (s) => /[㐀-鿿豈-﫿]/.test(s);

async function main() {
  const names = {}; // 英文 -> 中文
  let totalSlugs = 0;

  for (const cat of CATEGORIES) {
    process.stdout.write(`抓取 ${cat} ... `);
    let en, zh;
    try {
      [en, zh] = await Promise.all([
        fetchPairs(cat, 'us'),
        fetchPairs(cat, 'tw'),
      ]);
    } catch (e) {
      console.warn(`失敗:${e.message}`);
      continue;
    }

    let added = 0;
    for (const slug of Object.keys(zh)) {
      const enText = en[slug];
      const zhText = zh[slug];
      if (!enText || !zhText) continue;        // 兩邊都要有
      if (hasCJK(enText)) continue;            // 英文頁文字不該含中文(濾掉語言切換器等)
      if (!hasCJK(zhText)) continue;           // 中文頁文字必須含中文
      if (enText === zhText) continue;         // 沒翻譯到的略過
      if (enText.length < 2) continue;
      if (!(enText in names)) {
        names[enText] = zhText;
        added++;
      }
    }
    totalSlugs += added;
    console.log(`${added} 筆`);
    await sleep(600); // 禮貌延遲，避免被擋 503
  }

  // ⚠️ 合併安全:本支只負責「POEDB 名稱」這一塊,絕不可整個覆寫 dict.json,
  //   否則會抹掉其他管線寫入的 descriptions / uiAuto 與遊戲匯出 names
  //   (曾因整個覆寫導致排程 routine 單獨跑本支時清空字典)。
  //   故:讀回既有 dict.json,只「合併」names(POEDB 刷新優先、保留遊戲匯出名),
  //   原封不動保留 descriptions / uiAuto。version.json 一律交給 build-version.mjs,本支不碰。
  let existing = {};
  try { existing = JSON.parse(await readFile(OUT, 'utf8')); } catch { /* 首次建檔 */ }

  const mergedNames = { ...(existing.names || {}), ...names }; // POEDB(names)刷新優先,既有遊戲匯出名保留
  const sorted = {};
  for (const k of Object.keys(mergedNames).sort()) sorted[k] = mergedNames[k];

  const out = {
    _source: existing._source || 'poe2db.tw + PoE2 data export (pathofexile-dat)',
    _generated: 'run tools/build-dict.mjs (names 合併;descriptions/uiAuto 保留)',
    names: sorted,
  };
  if (existing.descriptions) out.descriptions = existing.descriptions; // 保留(build-descriptions 產)
  if (existing.uiAuto) out.uiAuto = existing.uiAuto;                   // 保留(build-ui 產)

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2), 'utf8');

  console.log(`\n完成:POEDB 本次 ${totalSlugs} 筆;合併後 names 共 ${Object.keys(sorted).length} 筆 -> ${OUT}`);
  console.log(`(descriptions ${Object.keys(out.descriptions || {}).length} / uiAuto ${Object.keys(out.uiAuto || {}).length} 已保留;version.json 交給 build-version.mjs)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
