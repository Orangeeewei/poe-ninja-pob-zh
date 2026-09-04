/**
 * release-notes.mjs — 從 README「更新紀錄」抽出指定版本的段落,印到 stdout(給 GitHub Release 當說明)。
 *
 * 用法:node tools/release-notes.mjs 2.4.0
 * 找不到該版段落時印出通用說明(不讓發版流程失敗)。
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const version = process.argv[2] || JSON.parse(readFileSync(path.join(root, 'manifest.json'), 'utf8')).version;
const readme = readFileSync(path.join(root, 'README.md'), 'utf8');

const esc = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 段落:「### <版本>(…)」起,到下一個「### 」或「## 」為止
const re = new RegExp('^### ' + esc + '[^\\n]*\\n([\\s\\S]*?)(?=^### |^## |(?![\\s\\S]))', 'm');
const m = readme.match(re);

const install = [
  '',
  '## 安裝',
  '',
  '1. 下載下方的 `poe-ninja-pob-zh-' + version + '.zip` 並解壓縮。',
  '2. `chrome://extensions` → 開啟「開發人員模式」→「載入未封裝項目」→ 選擇解壓縮後的資料夾。',
  '3. 已從 Chrome 線上應用程式商店安裝的使用者會自動更新,不必手動下載。',
  '',
].join('\n');

if (m) {
  process.stdout.write(m[1].trim() + '\n' + install);
} else {
  process.stdout.write('v' + version + ' 例行更新(翻譯資料與引擎修正)。詳見 README 更新紀錄。\n' + install);
}
