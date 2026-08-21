/**
 * ⚠️ 示範資料集（DEMO DATA）—— 僅涵蓋「繁星推薦」與「個人申請」
 * 這份資料是手工編寫的「示意範例」，內容雖參考真實校系命名與一般常見的
 * 採計慣例，但數字、倍率、門檻一律未經校系分則正式核對，不可作為升學申請依據。
 *
 * 「考試分發」管道已改用官方真實資料，見 real_data.js（來源：大學考試入學
 * 分發委員會 115學年度校系分則查詢系統，https://uac2.ncku.edu.tw/cross_search/）。
 * 「繁星推薦」「個人申請」（大學甄選入學委員會 cac.edu.tw）因該站
 * robots.txt 明確 Disallow 全站爬取，暫無法取得官方完整資料，此處仍為示範資料。
 *
 * 正式查詢請至：
 * 「大學甄選入學委員會」https://www.cac.edu.tw/
 * 「大學考試入學分發委員會」https://www.uac.edu.tw/
 * 教育部數學考科參採查詢系統 https://srecruit.moe.edu.tw/mathsys/
 *
 * 資料結構說明：
 * - channel:    招生管道（繁星推薦 / 個人申請 / 考試分發）
 * - group:      學群，採用教育部「大學繁星推薦、申請入學、分發入學參採數學考科
 *               查詢系統」的 19 學群分類，與 real_data.js 一致，方便合併篩選。
 * - mathScreen: 學測數學「檢定」門檻（達標即可，不影響總分），
 *               { subject: '數學A'|'數學B', min: '頂標'|'前標'|'均標'|'後標'|'底標' } 或 null（不檢定數學）
 * - mathCount:  數學「採計」進總分，
 *               { subject: '數學A'|'數學B'|'數學甲'|'數學乙', weight: 倍率數字 } 或 null（不採計數學）
 *               weight = 1 代表原始占比，> 1 代表加權
 * - source:     'demo'（示範資料，非官方）
 *
 * 如何擴充成全國完整資料：
 * 1. 保持每筆物件的欄位格式不變，逐系新增即可（可用 Excel/CSV 轉 JSON 後貼入）。
 * 2. 若該管道完全不參採數學，mathScreen 與 mathCount 都填 null，App 會自動歸類到「不參採數學」。
 */

const MATH_QUERY_DATA = [
  { id: 1, school: '國立臺灣大學', dept: '數學系', type: '國立', region: '北部', group: '數理化學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '頂標' }, mathCount: { subject: '數學A', weight: 2.0 } },
  { id: 3, school: '國立臺灣大學', dept: '電機工程學系', type: '國立', region: '北部', group: '工程學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '頂標' }, mathCount: { subject: '數學A', weight: 1.5 } },
  { id: 5, school: '國立臺灣大學', dept: '財務金融學系', type: '國立', region: '北部', group: '財經學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '前標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 6, school: '國立臺灣大學', dept: '中國文學系', type: '國立', region: '北部', group: '文史哲學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 7, school: '國立政治大學', dept: '法律學系', type: '國立', region: '北部', group: '法政學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 8, school: '國立政治大學', dept: '資訊管理學系', type: '國立', region: '北部', group: '管理學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '均標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 9, school: '國立政治大學', dept: '心理學系', type: '國立', region: '北部', group: '社會心理學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 10, school: '國立臺灣師範大學', dept: '數學系', type: '國立', region: '北部', group: '教育學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '前標' }, mathCount: { subject: '數學A', weight: 1.5 } },
  { id: 11, school: '國立臺灣師範大學', dept: '教育學系', type: '國立', region: '北部', group: '教育學群', channel: '繁星推薦', source: 'demo',
    mathScreen: { subject: '數學B', min: '均標' }, mathCount: null },
  { id: 12, school: '國立陽明交通大學', dept: '資訊工程學系', type: '國立', region: '北部', group: '資訊學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '頂標' }, mathCount: { subject: '數學A', weight: 2.0 } },
  { id: 14, school: '國立陽明交通大學', dept: '醫學系', type: '國立', region: '北部', group: '醫藥衛生學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '頂標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 15, school: '國立清華大學', dept: '物理學系', type: '國立', region: '北部', group: '數理化學群', channel: '繁星推薦', source: 'demo',
    mathScreen: { subject: '數學A', min: '前標' }, mathCount: null },
  { id: 16, school: '國立清華大學', dept: '經濟學系', type: '國立', region: '北部', group: '財經學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '均標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 18, school: '國立成功大學', dept: '會計學系', type: '國立', region: '南部', group: '財經學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '均標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 19, school: '國立成功大學', dept: '中國文學系', type: '國立', region: '南部', group: '文史哲學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 20, school: '國立中山大學', dept: '企業管理學系', type: '國立', region: '南部', group: '管理學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學B', min: '均標' }, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 22, school: '國立臺灣大學', dept: '園藝暨景觀學系', type: '國立', region: '北部', group: '生物資源學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 23, school: '國立中正大學', dept: '傳播學系', type: '國立', region: '南部', group: '大眾傳播學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 24, school: '國立臺北大學', dept: '統計學系', type: '國立', region: '北部', group: '數理化學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '均標' }, mathCount: { subject: '數學A', weight: 1.5 } },
  { id: 25, school: '國立臺北大學', dept: '社會工作學系', type: '國立', region: '北部', group: '社會心理學群', channel: '繁星推薦', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 26, school: '淡江大學', dept: '資訊工程學系', type: '私立', region: '北部', group: '資訊學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 27, school: '輔仁大學', dept: '心理學系', type: '私立', region: '北部', group: '社會心理學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 28, school: '東吳大學', dept: '法律學系', type: '私立', region: '北部', group: '法政學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 29, school: '逢甲大學', dept: '財務金融學系', type: '私立', region: '中部', group: '財經學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 30, school: '長庚大學', dept: '醫學系', type: '私立', region: '北部', group: '醫藥衛生學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '頂標' }, mathCount: { subject: '數學A', weight: 1.0 } },
  { id: 31, school: '國立東華大學', dept: '資訊工程學系', type: '國立', region: '東部', group: '資訊學群', channel: '繁星推薦', source: 'demo',
    mathScreen: { subject: '數學A', min: '均標' }, mathCount: null },
  { id: 33, school: '國立高雄大學', dept: '應用數學系', type: '國立', region: '南部', group: '數理化學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '前標' }, mathCount: { subject: '數學A', weight: 2.0 } },
  { id: 34, school: '國立暨南國際大學', dept: '外國語文學系', type: '國立', region: '中部', group: '外語學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 35, school: '國立臺南藝術大學', dept: '音樂學系', type: '國立', region: '南部', group: '藝術學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: null },
  { id: 37, school: '國立政治大學', dept: '外交學系', type: '國立', region: '北部', group: '外語學群', channel: '個人申請', source: 'demo',
    mathScreen: null, mathCount: { subject: '數學B', weight: 1.0 } },
  { id: 38, school: '國立中央大學', dept: '大氣科學系', type: '國立', region: '北部', group: '地球環境學群', channel: '個人申請', source: 'demo',
    mathScreen: { subject: '數學A', min: '前標' }, mathCount: { subject: '數學A', weight: 1.5 } },
];
