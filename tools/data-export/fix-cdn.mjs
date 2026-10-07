// pathofexile-dat 只把 4.x 開頭的版本送 PoE2 CDN,但 PoE2 自 0.5.5.4 起改回報 0.x 版號,
// 結果被送去 PoE1 CDN 拿到 404。改成「不是 3.x(PoE1)就走 PoE2 CDN」。上游修好後可刪。
import fs from 'node:fs';

for (const f of [
  'node_modules/pathofexile-dat/dist/cli/bundle-loaders.js', // 15.1.x
  'node_modules/pathofexile-dat/dist/bundles/load-util.js',  // 15.2.x
]) {
  if (!fs.existsSync(f)) continue;
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/(\w+)\.startsWith\('\/4\.'\)/g, "!$1.startsWith('/3.')"));
}
