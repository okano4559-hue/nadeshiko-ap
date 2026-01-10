export type TrainingItem = {
    name: string;
    reps: string;
    tips?: string;
    iconName: string; // Lucide icon name
};

export type DailyMenu = {
    day: string;
    theme: string;
    description: string;
    items: TrainingItem[];
    color: string; // Tailwind class component for border/bg accent
};

export function getDailyMenu(date: Date = new Date()): DailyMenu {
    const dayIndex = date.getDay();

    const menus: Record<number, DailyMenu> = {
        1: { // Monday: Rhythm & Unilateral
            day: "月曜日",
            theme: "リズム＆片足バランス",
            description: "今日のテーマ：音楽のように動け！ 片足でもグラつくな。",
            color: "border-nadeshiko-blue",
            items: [
                {
                    name: "リズム・タッチダウン⚡️",
                    reps: "左右10回",
                    tips: "片足立ちで床をタッチ！膝をグラグラさせるな！",
                    iconName: "Zap"
                },
                {
                    name: "忍者ステップ🥷",
                    reps: "20回",
                    tips: "音を立てずに素早く足を入れ替えろ！",
                    iconName: "Footprints"
                },
                {
                    name: "片足ケンケンDASH💨",
                    reps: "10回",
                    tips: "地面を強く弾いて前進だ！",
                    iconName: "Activity"
                },
            ]
        },
        2: { // Tuesday: Balance & Plyo
            day: "火曜日",
            theme: "空中バランス＆パワー",
            description: "今日のテーマ：空中で止まれ！ 着地まで美しく。",
            color: "border-nadeshiko-red",
            items: [
                {
                    name: "飛行機バランス✈️",
                    reps: "左右10秒",
                    tips: "背中から足先まで一直線！フラフラするな！",
                    iconName: "Send" // Looks like a paper plane
                },
                {
                    name: "ロケット・ランジ🚀",
                    reps: "10回",
                    tips: "空中で足を入れ替えろ！高く飛び上がれ！",
                    iconName: "Rocket"
                },
                {
                    name: "スケータージャンプ⛸️",
                    reps: "20回",
                    tips: "横に大きくジャンプ！ピタッと止まれ！",
                    iconName: "MoveHorizontal"
                },
            ]
        },
        3: { // Wednesday: Coupling & Control (Multi-task)
            day: "水曜日",
            theme: "マルチタスク・脳トレ",
            description: "今日のテーマ：手と足で違う動き！ 脳みそフル回転だ。",
            color: "border-nadeshiko-light",
            items: [
                {
                    name: "手拍子スクワット👏",
                    reps: "15回",
                    tips: "しゃがんでパン！立ってパン！ リズムを崩すな！",
                    iconName: "Music"
                },
                {
                    name: "8の字ループ♾️",
                    reps: "10周",
                    tips: "足の間でボール（空気）を8の字に回せ！",
                    iconName: "Infinity"
                },
                {
                    name: "V字ビーム・キープ✨",
                    reps: "10秒x3",
                    tips: "お腹に力を入れてVの字を作る！プルプルしても耐えろ！",
                    iconName: "ChevronUp"
                },
            ]
        },
        4: { // Thursday: Reaction & Agility
            day: "木曜日",
            theme: "反射神経・スピード",
            description: "今日のテーマ：稲妻より速く！ 合図に反応せよ。",
            color: "border-nadeshiko-blue",
            items: [
                {
                    name: "プッシュアップ＆クラップ💥",
                    reps: "10回",
                    tips: "腕立てジャンプで手を叩け！できないなら膝つきOK！",
                    iconName: "Activity"
                },
                {
                    name: "ジグザグ・ラビット🐰",
                    reps: "20回",
                    tips: "前後左右に素早くジャンプ！地面に足をつけるな！",
                    iconName: "Rabbit"
                },
                {
                    name: "スパイダーウォーク🕷️",
                    reps: "10歩",
                    tips: "低姿勢で手足を交互に出せ！クモになりきれ！",
                    iconName: "Bug"
                },
            ]
        },
        5: { // Friday: Difficulty Control
            day: "金曜日",
            theme: "究極のボディコントロール",
            description: "今日のテーマ：石像になれ！ 1ミリも動くな。",
            color: "border-nadeshiko-red",
            items: [
                {
                    name: "石像チャレンジ🗿",
                    reps: "20秒",
                    tips: "プランクの姿勢で絶対動くな！呼吸も静かに...",
                    iconName: "Square" // Block/Statue like
                },
                {
                    name: "片足・星を描く⭐️",
                    reps: "左右5周",
                    tips: "片足立ちで、もう片方の足で空中に星を描け！",
                    iconName: "Star"
                },
                {
                    name: "タックジャンプ・キャノン💣",
                    reps: "10回",
                    tips: "空中で膝を抱え込め！着地は静かに忍者！",
                    iconName: "ArrowUpFromLine"
                },
            ]
        },
        6: { // Saturday: Weekend Power
            day: "土曜日",
            theme: "パワー＆エクスプロージョン",
            description: "今日のテーマ：爆発力！ 全身のバネを使え。",
            color: "border-nadeshiko-light",
            items: [
                {
                    name: "スーパーマン・ジャンプ🦸‍♀️",
                    reps: "10回",
                    tips: "空中で手足を伸ばして飛べ！",
                    iconName: "Send"
                },
                {
                    name: "ハイ・ニー・ダッシュ🐎",
                    reps: "30回",
                    tips: "膝をお腹まで高く上げろ！",
                    iconName: "TrendingUp"
                },
                {
                    name: "壁倒立ホールド🤸‍♀️",
                    reps: "10秒",
                    tips: "壁を使って逆立ちキープ！景色をひっくり返せ！",
                    iconName: "ChevronsUp"
                },
            ]
        },
        0: { // Sunday: Master Challenge
            day: "日曜日",
            theme: "なでしこマスター挑戦",
            description: "今日のテーマ：限界突破！ 昨日の自分を超えていけ。",
            color: "border-yellow-500", // Gold
            items: [
                {
                    name: "エンドレス・バーピー🔥",
                    reps: "限界まで",
                    tips: "倒れても立ち上がれ！",
                    iconName: "Flame"
                },
                {
                    name: "片足スクワット（ピストル）🔫",
                    reps: "できるだけ",
                    tips: "片足で座って立つ！壁を持ってもいいぞ！",
                    iconName: "Target"
                },
                {
                    name: "V字バランス・MAX👑",
                    reps: "限界秒数",
                    tips: "震えてからが勝負だ！",
                    iconName: "Crown"
                },
            ]
        },
    };

    return menus[dayIndex];
}
