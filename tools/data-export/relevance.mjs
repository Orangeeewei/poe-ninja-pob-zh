/**
 * relevance.mjs — 翻譯管線的「單一事實來源」(single source of truth)。
 *
 * 問題背景:原本要匯出哪些表寫死在「本機 config.json + CI workflow heredoc」兩處,
 * 已漂移不一致(本機 18 表、CI 16 表),且未來遊戲新增欄位不會自動納入。
 * 改成:此檔列出「與 poe2db 同源、poe.ninja 真會顯示」的表 → gen-config 與所有 build
 * 腳本都從這裡讀。新增一個模塊 = 只改這一個檔。
 *
 * 為什麼是「allow-list 的表」而非「全遊戲表」:
 *   全遊戲有 248 個欄位有官方繁中,但其中約 9 萬句是 NPC 對話 / 微交易 / 任務劇情 /
 *   怪物名 / 登入錯誤 —— poe2db 沒有、poe.ninja 也不顯示。盲收會把 dict.json 從 3MB
 *   撐到十幾 MB(違反「不崩潰/效能」)。故鎖定 poe2db 範圍(物品/技能/寶石/天賦/
 *   通貨/傳奇/異常狀態/關鍵字/角色面板/昇華)。
 *   ➜ 每次遊戲改版可跑 `node gen-config.mjs --all && <匯出> && node audit-coverage.mjs`
 *     稽核「新出現、疑似相關」的欄位,人工判斷後加進下面清單(見 audit-coverage.mjs)。
 *
 * 路由(route)與安全性(對照 translator.js 的比對策略):
 *   'desc' → dict.descriptions:整句「整節點精確比對」。零誤判風險 → 可大方全收。
 *   'ui'   → dict.uiAuto:短標籤「整節點精確比對」。零誤判風險,但 maxLen 限制 +
 *            泛用英文字 denylist(避免 Test/Recently 這種在別處也可能出現的字)。
 *   'name' → dict.names:專有名詞。**多字名走子字串比對**(有誤判風險)→ 只放
 *            確定是專有名詞的表,不可大方擴張。
 *
 * columns:'*' = 動態掃描該表所有 string 欄(非寫死欄名)→ 未來新增欄位自動納入;
 *   給「純描述表 / 純標籤表」用(整表同一性質)。
 * columns:[...] = 指定欄(給「混合表」用:同一表同時有標籤欄與句子欄,需分流到不同 route)。
 * Words / UniqueStashLayout / ActiveSkills.DisplayedName 有特殊 join/列序邏輯,
 * 仍由 build-names.mjs 特例處理(但其來源表一樣列在 SPECIAL_TABLES 供匯出)。
 */

// route 表:build 腳本依 route + columns 掃描。
export const ROUTED = [
  // ---- descriptions(整句精確,exact-node,case-sensitive,會逐行拆;大方全收)----
  { table: 'CurrencyItems', route: 'desc', columns: '*' },     // 通貨說明
  { table: 'ActiveSkills', route: 'desc', columns: '*' },      // 技能說明(Description + ShortDescription 動態掃到)
  { table: 'GemEffects', route: 'desc', columns: '*' },        // 支援寶石功能描述 SupportText
  { table: 'FlavourText', route: 'desc', columns: '*' },       // 傳奇/寶石風味文字
  { table: 'SkillGemInfo', route: 'desc', columns: '*' },      // 寶石資訊說明
  { table: 'BuffDefinitions', route: 'desc', columns: ['Description'] }, // 增/減益效果「描述」句
  { table: 'KeywordPopups', route: 'desc', columns: ['Definition'] },    // 關鍵字「定義」句
  { table: 'Characters', route: 'desc', columns: ['Description'] },      // 職業背景說明句
  { table: 'Ascendancy', route: 'desc', columns: ['FlavourText'] },      // 昇華風味文字

  // ---- uiAuto(短標籤整節點精確,exact-node,case-insensitive)----
  { table: 'ItemClasses', route: 'ui', columns: '*' },         // 物品類別
  { table: 'ItemClassCategories', route: 'ui', columns: '*' }, // 物品類別標籤
  { table: 'Characters', route: 'ui', columns: ['Name'] },     // 職業名
  { table: 'SupportGemFamily', route: 'ui', columns: '*' },    // 輔助寶石類別
  { table: 'BuffDefinitions', route: 'ui', columns: ['Name'] },// 異常狀態/增益名(Ignited→點燃)
  { table: 'KeywordPopups', route: 'ui', columns: ['Term'] },  // 關鍵字名詞(Physical Damage→物理傷害)
  { table: 'Ascendancy', route: 'ui', columns: ['Name'] },     // 昇華職業名(Deadeye→銳眼)
  { table: 'CharacterPanelStats', route: 'ui', columns: '*' }, // 角色面板標籤(Life→生命)

  // ---- names(專有名詞,保守,因多字名走子字串比對有誤判風險)----
  { table: 'BaseItemTypes', route: 'name', columns: ['Name'] },        // 底材名
  { table: 'PassiveSkills', route: 'name', columns: ['Name'] },        // 天賦名
  { table: 'GemTags', route: 'name', columns: ['Name'] },              // 寶石標籤
  { table: 'Quest', route: 'name', columns: ['Name'] },                // 任務名
  { table: 'WorldAreas', route: 'name', columns: ['Name'] },           // 地區名
  { table: 'AlternatePassiveSkills', route: 'name', columns: ['Name'] },// 昇華/替代天賦名
];

// 特殊 join/列序邏輯的表(build-names.mjs 內特例處理),但匯出仍需要它們。
// 值為「強制納入的欄位」;gen-config 另會自動補上該表所有 string 欄。
export const SPECIAL_TABLES = {
  Words: ['Text', 'Text2'],            // 傳奇名(多字 Text2)
  UniqueStashLayout: ['WordsKey'],     // 傳奇分頁 → Words 列索引(join 鍵,非 string)
  ClientStrings: ['Text'],             // 自動長句規則(desc)+ 藥劑/護符模板(stats)
};

// uiAuto 整節點精確比對的長度上限(超過視為句子,改走 desc;避免 lore 句進 ui)。
export const UI_MAXLEN = 40;

// uiAuto denylist:在 poe.ninja 別處也可能單獨出現、不該被當遊戲術語替換的泛用英文字
// (含 BuffDefinitions/KeywordPopups 裡的內部/測試字)。比對時一律小寫。
export const UI_GENERIC_DENY = new Set([
  'test', 'recently', 'balance', 'cheat', 'treasure!', 'treasure', 'new', 'and', 'or',
  'for', 'may', 'art', 'default', 'none', 'other', 'options', 'option', 'character',
  'level', 'help', 'back', 'next', 'done', 'cancel', 'ok', 'yes', 'no', 'on', 'off',
  'reflection', 'punishment', 'discipline', 'immunity', 'converted', 'spectral',
  // poe.ninja 站方 UI 自身會出現的字(Meta 流行度、Gain 漲幅欄)→ 遊戲詞義會亂翻
  'meta', 'gain', 'gains',
]);

// 從 ROUTED 取某 route 的 [{table, columns}](columns 為 '*' 或欄名陣列)。
export const entriesFor = (route) =>
  ROUTED.filter((r) => r.route === route).map((r) => ({ table: r.table, columns: r.columns }));

// gen-config 需要匯出的所有表名(ROUTED ∪ SPECIAL)。
export const allTableNames = () =>
  [...new Set([...ROUTED.map((r) => r.table), ...Object.keys(SPECIAL_TABLES)])];
