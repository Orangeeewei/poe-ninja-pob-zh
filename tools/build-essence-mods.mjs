/**
 * build-essence-mods.mjs — 從 poe2db.tw 抓「精髓詞綴」英文↔繁中對照,寫進 data/dict.json 的 essenceMods。
 *
 * 為什麼需要:腐化精髓(裂痕/譫妄/驚懼/浮誇/瘋狂/深淵)的詞綴是 GGG 直接寫死的整句
 * (「Jewellery: +20% to Maximum Quality」「Body Armour: Allocates a random Notable Passive Skill」),
 * 不走 stat_descriptions,所以 .csd 模板永遠對不上;但 poe2db 的 /us/ 與 /tw/ 精髓頁都有官方文字。
 * 一般精髓(數值範圍)本來就由 .csd 模板翻,這裡的資料只作為「模板落空時的後備」(引擎 extraMap)。
 *
 * 原理:同 build-dict —— 同一 slug 的 /us/Essence 與 /tw/Essence 卡片,逐行(explicitMod)依序配對。
 *   每個精髓取「行數最多」的那張卡片;EN/TW 行數不同就整個精髓略過(不冒錯位風險)。
 *   除整行外,也把「前綴: 詞綴」拆出的詞綴部分單獨配對(引擎的前綴會自己翻:飾品/胸甲…)。
 *
 * 用法:node tools/build-essence-mods.mjs   (只合併 essenceMods,其他區塊原封不動)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'data', 'dict.json');
const UA = { 'User-Agent': 'Mozilla/5.0 (poe-ninja-translator dict builder)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(lang, attempt = 1) {
  const url = `https://poe2db.tw/${lang}/Essence`;
  let res;
  try { res = await fetch(url, { headers: UA }); } catch (e) {
    if (attempt <= 3) { await sleep(1500 * attempt); return fetchHtml(lang, attempt + 1); }
    throw e;
  }
  if ((res.status === 503 || res.status === 429) && attempt <= 3) { await sleep(2000 * attempt); return fetchHtml(lang, attempt + 1); }
  if (!res.ok) throw new Error(`${url} HTTP ${res.status}`);
  return res.text();
}

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ');
// 去標籤、poe2db 的數值範圍破折號(—)→ 連字號(poe.ninja 顯示 (15-20))、空白正規化
const clean = (s) => decode(s.replace(/<[^>]+>/g, '')).replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim();
const hasCJK = (s) => /[㐀-鿿豈-﫿]/.test(s);

// 解析:每個精髓卡片以 href="…Essence_xxx" 的連結開頭;卡片內容到下一張卡片(下一個 item_currency 連結)為止。
// 同一 slug 頁面上會出現多次(列表/分類),取行數最多者。
function parse(html) {
  const out = {};
  const anchors = [...html.matchAll(/<a class="item_currency[^"]*"[^>]*href="((?:[A-Za-z]+_)*Essence_[A-Za-z_]+)"/g)];
  for (let i = 0; i < anchors.length; i++) {
    const slug = anchors[i][1];
    const start = anchors[i].index;
    let end = html.length;
    for (let j = i + 1; j < anchors.length; j++) if (anchors[j][1] !== slug) { end = anchors[j].index; break; }
    const seg = html.slice(start, Math.min(end, start + 20000));
    const lines = [...seg.matchAll(/<div class="explicitMod">([\s\S]*?)<\/div>/g)].map((m) => clean(m[1])).filter(Boolean);
    if (!lines.length) continue;
    if (!out[slug] || out[slug].length < lines.length) out[slug] = lines;
  }
  return out;
}

async function main() {
  const [enHtml, twHtml] = await Promise.all([fetchHtml('us'), fetchHtml('tw')]);
  const en = parse(enHtml);
  const tw = parse(twHtml);
  const mods = {};
  let skipped = 0;
  const add = (e, z) => {
    if (!e || !z || e === z || hasCJK(e) || !hasCJK(z)) return;
    if (!(e in mods)) mods[e] = z;
  };
  for (const slug of Object.keys(en)) {
    const a = en[slug];
    const b = tw[slug];
    if (!b || a.length !== b.length) { skipped++; continue; }
    for (let k = 0; k < a.length; k++) {
      add(a[k], b[k]);
      // 「前綴: 詞綴」→ 詞綴部分單獨配對(繁中冒號可能是「: 」或「：」)
      const me = a[k].match(/^(.{1,48}?):\s+(.+)$/);
      const mz = b[k].match(/^(.{1,48}?)[:：]\s*(.+)$/);
      if (me && mz) add(me[2].trim(), mz[2].trim());
    }
  }
  const existing = JSON.parse(await readFile(OUT, 'utf8'));
  const sorted = {};
  for (const k of Object.keys(mods).sort()) sorted[k] = mods[k];
  existing.essenceMods = sorted;
  await writeFile(OUT, JSON.stringify(existing, null, 2), 'utf8');
  console.log(`精髓詞綴(poe2db):${Object.keys(en).length} 個精髓,配對 ${Object.keys(sorted).length} 句(略過行數不符 ${skipped})-> dict.json (essenceMods)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
