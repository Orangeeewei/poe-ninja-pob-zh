# 官方繁中欄位對接稽核

patch:4.5.5.1.5

由 CI 每日自動產生(`audit-coverage.mjs --out`)。「未對接」= 該欄有官方繁中但 `relevance.mjs` 尚未路由;
若某欄的內容 poe.ninja 會顯示,把它加進 `relevance.mjs` 的 ROUTED 即可,下次 build 自動納入。

```

=== 有官方繁中的 string 欄:249 個(curated 34 / 未對接 215) ===

--- 未對接、且以「句子」為主(最該納入 descriptions,exact-match 安全)---
24635 譯 | 句22003 名 989 短1643 | NPCTextAudio.Text
        e.g. It's unwise to rush into places unknown so quickly. Let me formulate a plan, then we'll ta
        e.g. With a handful of torches, a bookshelf, perhaps a nice little reading nook, this place cou
17750 譯 | 句15842 名1015 短 893 | CharacterTextAudio.Text
        e.g. I am a warrior, raised to honour my Ancestors, to die with a weapon in my hand and the Kar
        e.g. The dead should remember their place. → 亡者應牢記其所屬之地。
 9236 譯 | 句9027 名  94 短 115 | NPCTalkDialogueTextAudio.Text
        e.g. You know why I did it—to save our people. → 你知道我為什麼要這麼做──為了拯救我們的族人。
        e.g. You think I don't know that? → 你以為我不知道？
 8109 譯 | 句7503 名 515 短  91 | MtxTypes.Name
        e.g. Pet Upgrade Scroll → 寵物升級卷軸
        e.g. Pet Convert to Normal Scroll → 寵物轉化卷軸
 7888 譯 | 句7887 名   0 短   1 | MtxTypes.Description1
        e.g. Can be used with an Upgradeable Pet → 可以用於可升級的寵物
        e.g. Can be used with an Upgradeable Pet → 可以用於可升級的寵物
 5392 譯 | 句3427 名1956 短   9 | MtxTypes.Type
        e.g. Weapon Effect → 武器特效
        e.g. Weapon Modifier → 武器效果
 2762 譯 | 句1983 名 183 短 596 | MonsterVarieties.Name
        e.g. ANY MONSTER → 任意怪物
        e.g. Feral Primate → 野性靈長類
 2153 譯 | 句1342 名 273 短 538 | NPCTalk.DialogueOption
        e.g. Introduction → 介紹
        e.g. Captain Fairgraves → 費爾船長
 1457 譯 | 句1445 名  12 短   0 | QuestStates.Message
        e.g. Quest Complete → 任務完成
        e.g. Take Renly's reward → 領取倫利的獎勵
 1437 譯 | 句1436 名   1 短   0 | QuestStates.Text
        e.g. Quest Complete - You have slain the Bloated Miller and received a reward from Renly. → 任務完
        e.g. Renly has offered you a reward for slaying the Bloated Miller. Take it. → 倫利要給你擊殺浮腫米勒的獎勵，收
 1394 譯 | 句1387 名   7 短   0 | QuestStates.MapPinsText
        e.g. Take Renly's reward → 領取倫利的獎勵
        e.g. Talk to the Blacksmith → 和鐵匠交談
  964 譯 | 句 533 名  54 短 377 | NPCs.Name
        e.g. Oba → 歐霸
        e.g. Krillson, Master Fisherman → 釣魚大師克里爾森
  817 譯 | 句 676 名  65 短  76 | ClientStrings2.Text
        e.g. Monster level: <magic>{{{0}}} → 怪物等級：<magic>{{{0}}}
        e.g. Corruption → 已汙染
  704 譯 | 句 701 名   1 短   2 | BackendErrors.Text
        e.g. An account with this name already exists. → 此帳號已經存在。
        e.g. Account name must be at least 3 characters in length and is restricted to the characters a
  554 譯 | 句 386 名  89 短  79 | MapPins.Name
        e.g. Ogham county, est. 1132ic in the province of Phaaryl Survey commissioned by the office of 
        e.g. The Riverbank → 河岸
  520 譯 | 句 520 名   0 短   0 | MapPins.FlavourText
        e.g. Dregs and filth from the Manor gather in silence. → 宅第的殘渣與穢物在靜默中匯集。
        e.g. ...intermittent growls echo along the Riverbank, but there is a distant, rythmic sawing of
  423 譯 | 句 255 名  36 短 132 | Music.Name
        e.g. Default Hideout Music → 藏身處預設音樂
        e.g. Silence → 寧靜
  240 譯 | 句 195 名  45 短   0 | DelveFeatures.Name
        e.g. Mine Entrance → 礦脈入口
        e.g. Azurite Cavity → 碧藍窟窿
  239 譯 | 句 239 名   0 短   0 | DelveFeatures.Description
        e.g. Contains Azurite → 包含碧藍礦
        e.g. Contains a Breach → 包含一個裂痕
  234 譯 | 句 234 名   0 短   0 | LeagueInfo.Description
        e.g. In Path of Exile: Delve, you will delve into the Azurite Mine's infinite depths to extract
        e.g. Left untouched for over 250 years, the Azurite Mine has been consumed by a malevolent dark
  204 譯 | 句 204 名   0 短   0 | BetrayalTraitorRewards.Description
        e.g. Pilfering Torment Scarabs → 盜竊苦痛聖甲蟲
        e.g. Pilfering Torment Scarabs → 盜竊苦痛聖甲蟲
  204 譯 | 句 204 名   0 短   0 | BetrayalTraitorRewards.Description2
        e.g. Pilfering Torment Scarabs → 盜竊苦痛聖甲蟲
        e.g. Pilfering Torment Scarabs → 盜竊苦痛聖甲蟲
  196 譯 | 句 166 名   9 短  21 | ArchnemesisMods.Name
        e.g. Extra Fire Damage → 額外火焰傷害
        e.g. Extra Fire Damage → 額外火焰傷害
  185 譯 | 句 139 名  23 短  23 | MinimapIcons.Name
        e.g. Waypoint → 傳送點
        e.g. Map Device → 地圖裝置
  172 譯 | 句 172 名   0 短   0 | EndgameMaps.FlavourText
        e.g. The last light at the end of the world. → 末世之中的最後一道燈火。
        e.g. Bright colours hide the rot beneath. → 明亮的色彩掩蓋住底下的腐敗。
  166 譯 | 句 117 名  31 短  18 | AchievementItems.Name
        e.g. Moeanu, The Undying → 不死之徒．摩艾努
        e.g. Tikiheme, Lord of Minnows → 敏諾之主．堤基赫莫
  127 譯 | 句 113 名   1 短  13 | BestiaryRecipes.Description
        e.g. A Stack of 8 Chromatic Orbs → 1 個堆疊 8 個的幻色石
        e.g. A Stack of 4 Jeweller's Orbs → 1 個堆疊 4 個的工匠石
  122 譯 | 句 116 名   5 短   1 | UltimatumModifiers.Name
        e.g. Reduced Recovery → 減少回復
        e.g. Reduced Recovery II → 減少回復 II
  116 譯 | 句  81 名  25 短  10 | SanctumPersistentEffects.Name
        e.g. Honed Claws → 磨礪之爪
        e.g. Fright Mask → 恐懼面具
   98 譯 | 句  97 名   1 短   0 | UITalkText.Text
        e.g. I've found a way to blaze a trail to the legendary temple of Atzoatl. A spell cast upon th
        e.g. Good to see you survived your first Incursion. → 很高興你從第一次穿越任務活著回來。
   81 譯 | 句  69 名   2 短  10 | Incursion2RoomPerLevel.Name
        e.g. Path → 路徑
        e.g. Guardhouse → 衛兵所
   80 譯 | 句  64 名   8 短   8 | Achievements.Description
        e.g. Catch these Fish → 到陣來釣魚
        e.g. Leader → 領袖
   80 譯 | 句  80 名   0 短   0 | Achievements.Objective
        e.g. Catch each of the following Unique Fish. → 捕捉下列傳奇魚。
        e.g. Reach level 70 as a non-Hardcore character. → 在非專家模式中角色達到 70 級。
   80 譯 | 句  80 名   0 短   0 | DelveCraftingModifierDescriptions.Description
        e.g. Item is overvalued by vendors → 物品會被商人覺得超值
        e.g. Numeric modifier values are lucky High Level modifiers are more common → 數字的值非常幸運 高階詞綴更常見
   69 譯 | 句  59 名   2 短   8 | EndgameMapContent.Name
        e.g. Powerful Map Boss → 強大地圖頭目
        e.g. Breach → 裂痕
   69 譯 | 句  69 名   0 短   0 | HarvestCraftOptions.Text
        e.g. <white>{Reforge} a Rare item with random modifiers, including a <craftingfire>{Fire} modif
        e.g. <white>{Reforge} a Rare item with random modifiers, including a <craftingcold>{Cold} modif
   69 譯 | 句  69 名   0 短   0 | HarvestCraftOptions.Description
        e.g. Reforge a Rare item with random modifiers, including a Fire modifier → 重鑄 1 件有隨機詞綴的稀有物品，包含
        e.g. Reforge a Rare item with random modifiers, including a Cold modifier → 重鑄 1 件有隨機詞綴的稀有物品，包含
   68 譯 | 句  68 名   0 短   0 | EndgameMapContent.Description
        e.g. Area contains a Powerful Map Boss → 區域含有一個強大地圖頭目
        e.g. Area contains an Otherworldly Breach → 區域含有一個異界的裂痕
   67 譯 | 句  67 名   0 短   0 | SanctumPersistentEffects.CurseDesc
        e.g. Monsters deal 30% more Damage → 怪物造成 30% 更多傷害
        e.g. Traps deal Triple Damage → 陷阱造成三倍傷害
   66 譯 | 句  66 名   0 短   0 | AwardDisplay.Text
        e.g. You have unlocked an additional item slot on the Map Device → 你已解鎖地圖裝置上額外的物品欄
        e.g. Atlas Mission from Kirac Received → 收到基拉克的輿圖任務
   63 譯 | 句  63 名   0 短   0 | Tips.Text
        e.g. Remember to use flasks (<b>{1-2} on the keyboard). → 記得使用鍵盤上的 1 到 2 來喝藥水唷！
        e.g. Boss Checkpoints and Waypoints will refill your flasks as well as replenishing your life, 
   60 譯 | 句  44 名  14 短   2 | Incubators.Reward
        e.g. Essence Item → 精髓
        e.g. Currency Item → 通貨
   59 譯 | 句  34 名  18 短   7 | MicrotransactionSlot.Name
        e.g. Weapon Skin → 武器外觀
        e.g. Weapon Effect → 武器特效
   59 譯 | 句  39 名  13 短   7 | MicrotransactionSlot.SlotName
        e.g. Weapon Skin → 武器外觀
        e.g. Weapon Effect → 武器特效
   55 譯 | 句  31 名   3 短  21 | CurrencyExchangeCategories.Name
        e.g. Currency → 通貨
        e.g. Quality Currency → 品質通貨
   54 譯 | 句  54 名   0 短   0 | MtxTypes.Description2
        e.g. Combine this item with an Upgradeable Pet to use it → 使用可升級的寵物和此物品合成
        e.g. Combine this item with an Upgradeable Pet to use it → 使用可升級的寵物和此物品合成。
   53 譯 | 句  52 名   0 短   1 | SanctumPersistentEffects.BoonDesc
        e.g. Monsters deal 20% less Damage → 怪物造成 20% 更少傷害
        e.g. 40% increased Movement Speed → 增加 40% 移動速度
   51 譯 | 句  51 名   0 短   0 | PassiveSkills.FlavourText
        e.g. A throne is the most devious trap of them all → 王座，是所有陷阱之中最陰險的一個
        e.g. Great tacticians learn that consistency often trumps potential. → 穩定的發揮比潛力更加重要。
   50 譯 | 句  47 名   2 短   1 | BetrayalUpgrades.Name
        e.g. None → 無
        e.g. Korim's Journey → 庫姆的旅程
   50 譯 | 句  27 名   1 短  22 | EssenceTargetItemCategories.Text
        e.g. Equipment → 裝備
        e.g. Martial Weapon → 軍用武器
   50 譯 | 句  50 名   0 短   0 | Tips.TextXBox
        e.g. Select <b>{Rebind Menu} on the radial menu to assign skills and action to button slots. → 
        e.g. Press <<xbox_button_b>> to Dodge Roll. → 按下<<xbox_button_b>>進行閃避翻滾。
   49 譯 | 句  42 名   6 短   1 | BetrayalUpgrades.Description
        e.g. Increased Movement Speed → 增加移動速度
        e.g. Attack Speed → 攻擊速度
   46 譯 | 句  46 名   0 短   0 | Incursion2RoomPerLevel.Description
        e.g. Contains Equipment → 包含裝備
        e.g. Contains Equipment → 包含裝備
   42 譯 | 句  22 名  10 短  10 | MicrotransactionCategory.Name
        e.g. Weapon Skin → 武器外觀
        e.g. Shield Skin → 護盾外觀
   42 譯 | 句  42 名   0 短   0 | MobileTutorial.Text
        e.g. <tutorialgesture>{Get ready for battle!} Loot the Weapon Rack → <tutorialgesture>{準備迎戰！} 搜
        e.g. <tutorialgesture>{Tap} to pick up items or use the Interact button → <tutorialgesture>{輕點}
   40 譯 | 句  40 名   0 短   0 | BYOCrafting.Description
        e.g. Add a Veiled Mod to a Rare item → 新增 1 個隱匿詞綴至稀有物品上
        e.g. Add a Veiled Mod to a Rare item, with a low chance of adding a second Veiled Mod → 新增 1 個隱
   40 譯 | 句  37 名   3 短   0 | Notifications.Message
        e.g. Friend Request → 好友邀請
        e.g. Friend Now Online → 好友上線
   39 譯 | 句  39 名   0 短   0 | BuffVisuals.BuffDescription
        e.g. You are blinded by an enemy Blinding Aura → 你被敵人的致盲光環致盲
        e.g. You are significantly less accurate while standing in smoke → 在迷霧中時你大幅減少命中
   39 譯 | 句  39 名   0 短   0 | ExpeditionDeals.Description
        e.g. Reroll Prefix Modifiers. → 重骰前綴。
        e.g. Reroll Suffix Modifiers. → 重骰後綴。
   38 譯 | 句  27 名   9 短   2 | BuffVisuals.BuffName
        e.g. Corrupted Blood Rain → 腐化之血雨
        e.g. Stone Gaze → 石化凝視
   38 譯 | 句  27 名   4 短   7 | QuestRewardType.Name
        e.g. Gold → 金幣
        e.g. Gold → 金幣
   38 譯 | 句  38 名   0 短   0 | QuestRewardType.Description
        e.g. This quest will give you gold. → 此任務會給你金幣。
        e.g. This quest will give you gold. → 此任務會給你金幣。
   38 譯 | 句  32 名   2 短   4 | WorldMapLegends.Name
        e.g. Current Location → 目前位置
        e.g. Town → 城鎮
   36 譯 | 句  33 名   3 短   0 | AtlasClassPassives.Name
        e.g. Trove Seekers → 秘寶探求者
        e.g. In The Wrong Hands → 落入敵手
   36 譯 | 句  36 名   0 短   0 | AtlasClassPassives.FlavourText
        e.g. The Order hunts and secures artefacts too powerful for the world to handle. → 教團狩獵並保護著那些對於
        e.g. ...there is no telling what damage could be wrought by such relics. → ……沒人能預料這些遺物會造成多大的破壞。
   36 譯 | 句  36 名   0 短   0 | BestiaryRecipes.Notes
        e.g. Only works on armour and weapons → 只能使用於護甲和武器
        e.g. Scarab will be of the same type → 聖甲蟲將維持相同類型
   36 譯 | 句  36 名   0 短   0 | Incursion2RoomPerLevel.Description2
        e.g. May drop Quipolatl's Medallion or Uromoti's Medallion → 可能掉落 克特帕托聖徽 或 烏爾摩堤聖徽
        e.g. May drop Quipolatl's Medallion or Uromoti's Medallion → 可能掉落 克特帕托聖徽 或 烏爾摩堤聖徽
   33 譯 | 句  33 名   0 短   0 | AdvancedSkillsTutorial.Description
        e.g. A channelled, area of effect chaos spell that applies a debuff to enemies. Debuffed enemie
        e.g. A cold based projectile spell that pierces enemies, dealing cold damage with a chance to f
   33 譯 | 句  23 名   2 短   8 | Incursion2Rooms.Name
        e.g. Garrison → 衛兵
        e.g. Commander → 指揮官
   31 譯 | 句  29 名   2 短   0 | BlightTowers.Name
        e.g. Tower Foundation → 防守塔基座
        e.g. Chilling Tower Mk I → 冰緩塔 I
   31 譯 | 句  31 名   0 短   0 | BlightTowers.Description
        e.g. A powered base for one of Cassia's towers. → 卡西亞防守塔的動力基座
        e.g. Damage: Low Chills and Damages nearby enemies Ineffective against Blighted Monsters of the
   29 譯 | 句  29 名   0 短   0 | Commands.Description
        e.g. /played displays how long you have played this character for → /遊戲時間（/played）顯示總遊玩時間。
        e.g. /age displays how long ago you created this character → /創角時間（/age）顯示這個角色是在多久之前創立的。
   29 譯 | 句  25 名   4 短   0 | Expedition2Recipes.Description
        e.g. Krillson's Bay Key → 克里爾森的海灣鑰匙
        e.g. Uncut Skill Gem → 未切割的寶石
   28 譯 | 句  28 名   0 短   0 | AlternatePassiveSkills.FlavourText
        e.g. Give up your flesh unto the gods, and in vulnerability find strength. → 把你的肉體獻給眾神，並在脆弱中找到力
        e.g. Burn the spirit to vitalise the flesh. → 焚燒靈魂賦予肉體生命。
   28 譯 | 句  28 名   0 短   0 | BYOCrafting.DescriptionRuthless
        e.g. Modify a Flask's quality to 22% → 調整藥劑品質至 22%
        e.g. Modify a Flask's quality to 24% → 調整藥劑品質至 24%
   27 譯 | 句  27 名   0 短   0 | GamepadButtonBindAction.Description
        e.g. Uses Skill bound to this slot. → 使用綁定到此欄位的技能。
        e.g. Drink from your equipped life flask. → 飲用保有最多使用次數的藥劑。
   27 譯 | 句  16 名  10 短   1 | GamepadButtonBindAction.Name
        e.g. Use Skill → 使用技能
        e.g. Use Life Flask → 使用生命藥劑
   26 譯 | 句  26 名   0 短   0 | AlternateQualityTypes.Description
        e.g. Quality (Life Modifiers) → 品質（生命詞綴）
        e.g. Quality (Mana Modifiers) → 品質（魔力詞綴）
   26 譯 | 句  25 名   1 短   0 | CompletionNotifications.Title
        e.g. Map Completed → 完成的地圖
        e.g. Map Completed → 完成的地圖
   24 譯 | 句  24 名   0 短   0 | CharacterCreationIcons.Description
        e.g. Let arrows fly from afar. Kill them before they arrive. → 從遠處發射箭矢。在敵人觸及你之前就扼殺它們。
        e.g. Shoot on the move. Jump over your enemies. Leap away from danger. → 邊移動邊射擊。從敵人頭上跳過。從危險的處境中
   23 譯 | 句  23 名   0 短   0 | Incursion2Crafting.Name
        e.g. Corruption Instiller → 腐化灌注器
        e.g. Gem Corrupter → 寶石腐化器
   23 譯 | 句  23 名   0 短   0 | Incursion2Crafting.Description
        e.g. Modifies a Corrupted Equipment or Jewel item unpredictably or destroys it → 不可預測的改造一件已汙染的裝
        e.g. Modifies a Corrupted Skill Gem unpredictably or destroys it → 不可預測的改造一顆已汙染的技能寶石，或摧毀它
   21 譯 | 句  21 名   0 短   0 | UltimatumWagerTypes.DisplayText
        e.g. 20 Artificer's Orbs → 20 顆工匠石
        e.g. 10 Orbs of Alchemy → 10 顆點金石
   19 譯 | 句  19 名   0 短   0 | EndgameMapObjectives.ObjectiveText
        e.g. Defeat the Map Boss → 擊敗 地圖頭目
        e.g. Defeat the Corrupted Boss → 擊敗腐化頭目
   19 譯 | 句  19 名   0 短   0 | EndgameMapObjectives.CompletionText
        e.g. Map Boss Defeated → 已擊敗地圖頭目
        e.g. Corrupted Nexus Cleansed → 已淨化腐化聖域
   19 譯 | 句  17 名   2 短   0 | MemoryLineType.Suffix
        e.g. of Organised Chaos → 組織混沌之
        e.g. of Ransacked Relics → 洗劫遺物之
   18 譯 | 句  17 名   1 短   0 | BetrayalTargets.FullName
        e.g. Catarina, Master of Undeath → 永生大師卡塔莉娜
        e.g. Haku, Warmaster → 戰爭大師哈庫
   18 譯 | 句  11 名   7 短   0 | CostTypes.FormatText
        e.g. {0} Mana → {0} 魔力
        e.g. {0} Life → {0} 生命
   18 譯 | 句  12 名   0 短   6 | RelicInventoryLayout.Requirement
        e.g. Complete the Test of Cunning → 完成計謀的測試
        e.g. Complete the Test of Strength → 完成力量的測試
   17 譯 | 句  17 名   0 短   0 | BestiaryRecipeCategories.Text
        e.g. Create Currency Items → 製造通貨
        e.g. Create a Unique → 製造傳奇
   16 譯 | 句  15 名   1 短   0 | BrequelEncounterSkills.Description
        e.g. Bombard the Hiveborn → 轟擊巢裔
        e.g. Conjure a wall of the Dreamer's Flame → 以幻夢者之焰施放一堵牆
   16 譯 | 句  12 名   0 短   4 | Tags.UiHints
        e.g. <rgb(175,238,238)>{Synthesised} → <rgb(175,238,238)>{追憶之}
        e.g. <rgb(175,238,238)>{Synthesised} → <rgb(175,238,238)>{追憶之}
   15 譯 | 句  14 名   0 短   1 | HellscapePassives.Name
        e.g. Chaotic Adornment → 混沌裝飾
        e.g. Twisted Metal → 變形鋼鐵
   15 譯 | 句  15 名   0 短   0 | SanctumRoomTypes.Description
        e.g. Contains Merchant → 含有商人
        e.g. Awards a Shrine to restore Honour → 內含一座可恢復榮譽的聖壇
   14 譯 | 句  14 名   0 短   0 | CraftingSpreeType.Text
        e.g. <whiteitem>{Normal} Item → <whiteitem>{普通}物品
        e.g. <whiteitem>{Normal} Essence craftable Item → <whiteitem>{普通}精髓工藝物品
   14 譯 | 句   8 名   6 短   0 | ExpeditionRelics.Name
        e.g. Ezomyte Runestone → 艾茲麥符文石
        e.g. Vaal Relic → 瓦爾聖物
   14 譯 | 句  11 名   0 短   3 | FragmentStashTabSubStashGroup.Name
        e.g. Fragments → 碎片
        e.g. Tablets → 碑牌
   14 譯 | 句  11 名   0 短   3 | SoulCoreStatCategories.Display
        e.g. All Equipment → 所有裝備
        e.g. Martial Weapon → 軍用武器
   12 譯 | 句  12 名   0 短   0 | AchievementSetRewards.Message
        e.g. Congratulations! You earned the Runes of Aldur Challenger Trophy! It upgrades the more cha
        e.g. Congratulations! You earned the Ezomyte Rune Master Boots! → 恭喜！ 你獲得了艾茲麥符文大師鞋子！
   12 譯 | 句  12 名   0 短   0 | AtlasFavouredMapSlots.Unlock
        e.g. Complete a Tier 16 Map → 完成 1 張階級 16 的地圖
        e.g. Defeat an Elder Guardian → 擊敗異界尊師守護者
   12 譯 | 句  12 名   0 短   0 | BestiaryGroups.Description
        e.g. "Man-eaters. Predators. Cast aside the childish notion of embracing these beautiful beasts
        e.g. "There is an intelligence behind the eyes of these primates, a sentience that draws you in
   12 譯 | 句  12 名   0 短   0 | MapStashSpecialTypeEntries.Name
        e.g. Baran, The Crusader → 聖戰軍王．巴倫
        e.g. Veritania, The Redeemer → 救贖者．維羅提尼亞
   12 譯 | 句  12 名   0 短   0 | MicrotransactionCategory.Description
        e.g. Added Effects that apply to your weapon, such as Finishers. Finishers add effects when you
        e.g. Adds a Frame to your character portrait. This can be seen in the Social Panel, Party UI, a
   12 譯 | 句  11 名   0 短   1 | PantheonPanelLayout.GodName2
        e.g. Puruna, the Challenger → 挑戰者普魯那
        e.g. Maligaro the Mutilator → 毀壞者馬雷葛蘿
   12 譯 | 句  12 名   0 短   0 | PantheonPanelLayout.GodName1
        e.g. Soul of the Brine King → 海洋王之魂
        e.g. Soul of Arakaali → 艾爾卡莉之魂
   11 譯 | 句  11 名   0 短   0 | ArchnemesisMetaRewards.RewardText
        e.g. All Reward Types have an additional reward → 全部獎勵類型有 1 個額外獎勵
        e.g. Rewards are doubled → 獎勵 2 倍
   11 譯 | 句  11 名   0 短   0 | Characters.TraitDescription
        e.g. Trait: Natural resilience to Chaos → 特質：對混沌攻擊具備天然抗性
        e.g. Trait: Arrows fly fast and true → 特質：箭矢飛行迅速且精準
   11 譯 | 句  11 名   0 短   0 | CompletionNotifications.Description
        e.g. A nearby map has been overrun → 一張周遭的地圖已受到深淵佔據
        e.g. An adjacent map has been overrun → 一張相鄰的地圖已受到深淵佔據
   11 譯 | 句  11 名   0 短   0 | PassiveTreeDecorators.Description
        e.g. Complete the Western Enigma Chamber to unlock → 完成西側謎團密室以解鎖
        e.g. Complete the Eastern Enigma Chamber to unlock → 完成東側謎團密室以解鎖
   10 譯 | 句  10 名   0 短   0 | RitualRuneTypes.Description
        e.g. Waves of Blood pass through the Ritual Site → 淹沒祭祀地點的鮮血浪潮
        e.g. Crimson Wolves strike from the Darkness → 赤紅狼群從黑暗中發動攻擊
   10 譯 | 句  10 名   0 短   0 | StashAvailabilities.Message
        e.g. The Divination Card Stash is currently not supported in this game version. → 此遊戲版本目前不支援命運卡
        e.g. The Delve Stash is currently not supported in this game version. → 此遊戲版本目前不支援掘獄倉庫。
    9 譯 | 句   9 名   0 短   0 | BattlePassRewards.RewardDescription
        e.g. Receive a random prize with a Sin or Innocence theme! It'll appear inside your MTX stash, 
        e.g. Receive a random prize with a Polaris theme! It'll appear inside your MTX stash, waiting t
    9 譯 | 句   9 名   0 短   0 | HeistJobs.Description
        e.g. Begin Lockpicking → 開始開鎖
        e.g. Begin Brute Force → 開始蠻力
    9 譯 | 句   9 名   0 短   0 | Incursion2Medallions.Name
        e.g. Juatalotli's Medallion → 瓦爾羅特聖徽
        e.g. Hayoxi's Medallion → 荷霖蔡聖徽
    9 譯 | 句   9 名   0 短   0 | Incursion2Medallions.FlavourText
        e.g. The Architect of the Hoard gathered every piece of Vaal history he could, hoping to preser
        e.g. The Architect of Destruction ensured his own demise in an 'accidental' explosion. She orde
    9 譯 | 句   9 名   0 短   0 | Incursion2Medallions.Description
        e.g. Use to prevent the next Destabilisation of a Room → 防止下一次房間不穩定
        e.g. Use to reroll a Restricted Room in the Temple → 重骰神廟內的限制房間
    8 譯 | 句   8 名   0 短   0 | BattlePassRewards.RewardTitle
        e.g. Apocalypse Mystery Box → 天啟神秘寶箱
        e.g. Igneous Emperor Boots → 腳部外觀：火炎帝王
    8 譯 | 句   7 名   0 短   1 | ClientStrings2.XBoxText
        e.g. Press and hold <<xbox_button_x>> to link MTX items whilst chat panel is open. → 在聊天欄開啟時，按住
        e.g. Upgradeable → 可升級
    8 譯 | 句   5 名   3 短   0 | CombatUIPrompts.Description
        e.g. Out Of Mana → 魔力耗盡
        e.g. On Cooldown → 正在冷卻
    8 譯 | 句   5 名   3 短   0 | SanctumSelectionDisplayOverride.Reward
        e.g. Restore {0} Honour → 恢復 {0} 榮譽
        e.g. Urn Relic → 古甕聖物
    7 譯 | 句   7 名   0 短   0 | Acts.Description
        e.g. Something dark awaits you in the forests of Ogham... → 某種黑暗的東西在奧格姆的森林裡等著你……
        e.g. Once verdant plains now course with sands red and black. → 曾經青翠的平原，如今遍布紅黑色的沙漠。
    7 譯 | 句   5 名   0 短   2 | BreachStashTabSubStashGroup.Name
        e.g. Catalysts → 催化劑
        e.g. Wombgifts → 胎贈
    7 譯 | 句   5 名   0 短   2 | LeagueNames.Name1
        e.g. Standard → 標準
        e.g. Settlers → 拓荒者
    7 譯 | 句   5 名   0 短   2 | LeagueNames.Name2
        e.g. Standard → 標準
        e.g. Settlers → 拓荒者
    7 譯 | 句   7 名   0 短   0 | NPCMaster.AreaDescription
        e.g. UNUSED Navali → 娜瓦莉
        e.g. Area will contain powerful beasts, which Einhar will help you hunt. → 區域包含兇猛的野獸，埃哈會協助你獵捕牠。
    7 譯 | 句   7 名   0 短   0 | PassiveOverrideLimits.Description
        e.g. 1 Loyalty Tattoo → 1 個忠誠紋身
        e.g. 1 Strength Notable Tattoo → 1 個力量核心紋身
    7 譯 | 句   6 名   0 短   1 | UltimatumEncounterTypes.Name
        e.g. Slay all Monsters → 殺死所有怪物
        e.g. Survive → 倖存
    6 譯 | 句   6 名   0 短   0 | AchievementItemRewards.MessagePC
        e.g. Rewarded an Exile's Hood Microtransaction! Press K to Equip → 已獲得商城道具——頭部外觀：流亡者兜帽作為獎勵！ 按下 
        e.g. Rewarded an Exile's Staff Microtransaction! Press K to Equip → 已獲得商城道具——武器外觀：流亡者長杖作為獎勵！ 按下
    6 譯 | 句   6 名   0 短   0 | AchievementItemRewards.MessageConsole
        e.g. Rewarded an Exile's Hood Microtransaction! Open the Cosmetics Window to Equip → 已獲得商城道具——頭
        e.g. Rewarded an Exile's Staff Microtransaction! Open the Cosmetics Window to Equip → 已獲得商城道具——
    6 譯 | 句   6 名   0 短   0 | AtlasPassiveSkillSubTrees.Description
        e.g. Grants Breach Atlas passive points on completion → 完成時獲得裂痕輿圖天賦點
        e.g. Grants Expedition Atlas passive points on completion → 完成時獲得探險輿圖天賦點
    5 譯 | 句   5 名   0 短   0 | BrequelFruitRewardTypes.Description
        e.g. Can grow into a Currency item on the Genesis Tree → 可在創世之樹上成長為通貨
        e.g. Can grow into a Ring on the Genesis Tree → 可在創世之樹上成長為戒指
    5 譯 | 句   5 名   0 短   0 | BrequelFruitRewardTypes.PCPrompt
        e.g. Place this item into the currency womb on the Genesis Tree. Right click to retrieve from t
        e.g. Place this item into the ring womb on the Genesis Tree. Right click to retrieve from the G
    5 譯 | 句   5 名   0 短   0 | BrequelFruitRewardTypes.ConsolePrompt
        e.g. Place this item into the currency womb on the Genesis Tree. <<xbox_button_a>> to retrieve 
        e.g. Place this item into the ring womb on the Genesis Tree. <<xbox_button_a>> to retrieve from
    5 譯 | 句   5 名   0 短   0 | ExpeditionFactions.Name
        e.g. Druids of the Broken Circle → 破碎環之德魯伊
        e.g. Black Scythe Mercenaries → 黑鐮傭兵
    5 譯 | 句   5 名   0 短   0 | KioskModeCharacterTutorials.Description
        e.g. Use <bold>{<white>{Whirling Slash}} <<skillicon:sandstorm_swipe>> to <bold>{<white>{Blind}
        e.g. Hit enemies with <bold>{<white>{Armour Break}} <<skillicon:heavy_strike>> to remove their 

--- 未對接、以「名稱/多字片語」為主 ---
   17 譯 | 句   0 名  13 短   4 | BindableVirtualKeys.Name
        e.g. Spacebar → 空白鍵
        e.g. Numpad 0 → 數字鍵 0
   11 譯 | 句   0 名   6 短   5 | MusicCategories.Name
        e.g. Boss Fights → 頭目戰
        e.g. Encampments → 營地

--- 未對接、以「單字短 UI」為主(高風險,需謹慎)---
 1016 譯 | 句 354 名 107 短 555 | Chests.Name
  863 譯 | 句 308 名  30 短 525 | NPCs.ShortName
  175 譯 | 句   7 名  12 短 156 | PassiveSkillFilterOptions.Filters
  175 譯 | 句   7 名  12 短 156 | PassiveSkillFilterOptions.Name
  134 譯 | 句   9 名   6 短 119 | HideoutDoodadCategory.Name
   87 譯 | 句   1 名   0 短  86 | CharacterStartStates.Description
   74 譯 | 句  32 名   2 短  40 | HeistObjectives.Client
   52 譯 | 句   0 名   0 短  52 | Commands.Command
   48 譯 | 句  14 名   1 短  33 | CharacterPanelTabs.Text
   42 譯 | 句   9 名   2 短  31 | BestiaryGenus.Name
   42 譯 | 句   5 名   6 短  31 | BestiaryGenus.Name2
   38 譯 | 句   1 名   1 短  36 | HideoutDoodadTags.Name
   34 譯 | 句   4 名   0 短  30 | SkillGemSearchTerms.Name
   34 譯 | 句   3 名   1 短  30 | UniqueStashTypes.Name
   33 譯 | 句   4 名   3 短  26 | TieredMicrotransactionsVisuals.Description
   29 譯 | 句   0 名   0 短  29 | Realms.ShortName
   28 譯 | 句  11 名   1 短  16 | CraftingItemClassCategories.Text
   25 譯 | 句   0 名   0 短  25 | GenericLeagueRewardTypeVisuals.Name
   24 譯 | 句   1 名   0 短  23 | Tags.DisplayString
   20 譯 | 句   4 名   0 短  16 | MapSeries.Name
   20 譯 | 句   3 名   1 短  16 | PassiveSkillStatCategories.Name
   18 譯 | 句   1 名   0 短  17 | BetrayalTargets.ShortName
   16 譯 | 句   2 名   1 短  13 | DelveCraftingTags.ItemClass
   14 譯 | 句   0 名   0 短  14 | StashTabAffinities.Name
   14 譯 | 句   0 名   0 短  14 | UniqueMagesLegacy.DisplayText
   13 譯 | 句   0 名   0 短  13 | BlightCraftingItems.NameShort
   13 譯 | 句   3 名   1 短   9 | EndgameMapBiomes.Name
   12 譯 | 句   1 名   1 短  10 | AdvancedCraftingBenchTabFilterTypes.Name
   12 譯 | 句   0 名   0 短  12 | BestiaryGroups.Name
   12 譯 | 句   3 名   0 短   9 | PassiveSkillFilterGroups.Name
   12 譯 | 句   0 名   0 短  12 | SkillCraftingData.Name
   10 譯 | 句   1 名   0 短   9 | AdvancedCraftingBenchCustomTags.Tag
   10 譯 | 句   0 名   0 短  10 | RitualRuneTypes.Type
    9 譯 | 句   1 名   1 短   7 | HeistJobs.Name
    6 譯 | 句   0 名   0 短   6 | MonsterCategories.Name
    6 譯 | 句   0 名   0 短   6 | RelicItemEffectVariations.Description
    5 譯 | 句   0 名   0 短   5 | AchievementSetsDisplay.Title
    5 譯 | 句   0 名   0 短   5 | BetrayalChoices.Text
    5 譯 | 句   0 名   0 短   5 | BetrayalJobs.Text
    5 譯 | 句   0 名   0 短   5 | BindableVirtualKeys.Id

=== 總計未對接句子型欄位的可譯句數合計 ===
未對接欄位的「句子」可譯數合計約 84290
```
