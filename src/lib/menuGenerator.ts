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
    // Ensure we are working with Japan time if determining "Today"
    // For simplicity broadly, we just take the day index.
    const dayIndex = date.getDay();

    const menus: Record<number, DailyMenu> = {
        1: { // Monday
            day: "月曜日",
            theme: "アジリティ・スピード強化",
            description: "今日のテーマ：瞬発力！一瞬のスピードを磨け。",
            color: "border-nadeshiko-blue",
            items: [
                { name: "その場ダッシュ", reps: "20回", tips: "腕をしっかり振れ！", iconName: "Zap" },
                { name: "反復横跳び", reps: "10回", tips: "素早くサイドへステップ！", iconName: "ArrowLeftRight" },
                { name: "タックジャンプ", reps: "5回", tips: "膝を胸に引きつける！", iconName: "ArrowUpFromLine" },
            ]
        },
        2: { // Tuesday
            day: "火曜日",
            theme: "体幹・バランス強化",
            description: "今日のテーマ：ブレない軸！ フィジカルの基礎を作れ。",
            color: "border-nadeshiko-red",
            items: [
                { name: "ベアウォーク", reps: "10歩", tips: "殿部を高く保て", iconName: "Footprints" },
                { name: "フラミンゴポーズ", reps: "10秒キープ", tips: "片足でバランスを崩すな！", iconName: "Activity" },
                { name: "プランク", reps: "10秒", tips: "背筋を一直線に保て", iconName: "Minus" },
            ]
        },
        3: { // Wednesday
            day: "水曜日",
            theme: "パワー・脚力強化",
            description: "今日のテーマ：ジェット企画！ 地面を強く蹴り出せ。",
            color: "border-nadeshiko-light",
            items: [
                { name: "フロッグジャンプ", reps: "10回", tips: "手をついてから爆発的にジャンプ！", iconName: "Rabbit" },
                { name: "スクワット", reps: "10回", tips: "椅子に座るイメージで腰を落とせ", iconName: "ArrowDown" },
                { name: "ランジ", reps: "10回", tips: "大きく一歩前へ踏み込め", iconName: "MoveHorizontal" },
            ]
        },
        4: { // Thursday
            day: "木曜日",
            theme: "有酸素・スタミナ強化",
            description: "今日のテーマ：尽きない体力！ 試合終了まで走り抜けろ。",
            color: "border-nadeshiko-blue",
            items: [
                { name: "ジャンピングジャック", reps: "15回", tips: "手足を大きく広げろ", iconName: "Combine" },
                { name: "マウンテンクライマー", reps: "20回", tips: "壁を登るように脚を動かせ", iconName: "TrendingUp" },
                { name: "バーピー（ジャンプなし）", reps: "5回", tips: "立つ・寝る・立つ！ リズムよく", iconName: "Repeat" },
            ]
        },
        5: { // Friday
            day: "金曜日",
            theme: "コーディネーション",
            description: "今日のテーマ：脳を活性化！ 身体を思い通りに操れ。",
            color: "border-nadeshiko-red",
            items: [
                { name: "クロスタッチ", reps: "10回", tips: "右手で左足をタッチせよ", iconName: "Combine" },
                { name: "バック走", reps: "10歩", tips: "後方感覚を研ぎ澄ませ", iconName: "Repeat" },
                { name: "ケンケンパ", reps: "10回", tips: "リズムとバランスを意識しろ！", iconName: "Footprints" },
            ]
        },
        6: { // Saturday
            day: "土曜日",
            theme: "ウィークエンド・チャレンジ",
            description: "今日のテーマ：週間総仕上げ！ 全てを出し尽くせ。",
            color: "border-nadeshiko-light",
            items: [
                { name: "フロッグジャンプ", reps: "10回", tips: "より高く、より遠くへ！", iconName: "Rabbit" },
                { name: "ベアウォーク", reps: "10歩", tips: "力強く進め", iconName: "Footprints" },
                { name: "その場ダッシュ", reps: "20回", tips: "最後まで全力で駆け抜けろ！", iconName: "Zap" },
            ]
        },
        0: { // Sunday
            day: "日曜日",
            theme: "スーパーチャレンジ",
            description: "今日のテーマ：己への挑戦！ 限界を超えていけ。",
            color: "border-yellow-500", // Gold for Sunday
            items: [
                { name: "バーピー", reps: "限界まで", tips: "1分間で何回できるか挑戦だ", iconName: "Rocket" },
                { name: "スクワット", reps: "限界まで", tips: "脚が重くなっても止まるな！", iconName: "ArrowDown" },
                { name: "プランク", reps: "限界まで", tips: "自分との戦いに勝て", iconName: "Activity" },
            ]
        },
    };

    return menus[dayIndex];
}
