// pathofexile-dat 用「版本號 4. 開頭」判斷是不是 PoE2(選 CDN、選 Data/Balance 路徑),
// 但 PoE2 自 0.5.5.4 起改回報 0.x 版號,整條匯出都被當成 PoE1。
// 改成「開頭是數字且不是 3.(PoE1)就算 PoE2」。上游修好後可刪。
import fs from 'node:fs';

const dist = 'node_modules/pathofexile-dat/dist';
let hits = 0;
for (const f of fs.readdirSync(dist, { recursive: true })) {
  if (!f.endsWith('.js')) continue;
  const p = `${dist}/${f}`;
  const src = fs.readFileSync(p, 'utf8');
  const out = src.replace(/([\w.]+)\??\.startsWith\('\/?4\.'\)/g, (_, x) => { hits++; return `/^\\/?(?!3\\.)\\d/.test(${x})`; });
  if (out !== src) fs.writeFileSync(p, out);
}
console.log(`fix-cdn: 改了 ${hits} 處 PoE2 版號判斷`);
