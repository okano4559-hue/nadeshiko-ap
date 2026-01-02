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
            theme: "あじりてぃ・すぴーど",
            description: "今日のテーマ：しゅんぱつりょく！ すばやくうごこう。",
            color: "border-nadeshiko-blue",
            items: [
                { name: "そのばダッシュ", reps: "20回", tips: "うでをしっかりふって！", iconName: "Zap" },
                { name: "はんぷくよことび", reps: "10回", tips: "サイドにジャンプ！", iconName: "ArrowLeftRight" },
                { name: "タックジャンプ", reps: "5回", tips: "ひざをむねにひきつける！", iconName: "ArrowUpFromLine" },
            ]
        },
        2: { // Tuesday
            day: "火曜日",
            theme: "たいかん・バランス",
            description: "今日のテーマ：ぐらぐらしない！ まっすぐなからだ。",
            color: "border-nadeshiko-red",
            items: [
                { name: "くまさんあるき", reps: "10ぽ", tips: "おしりをたかくあげてあるこう", iconName: "Footprints" },
                { name: "フラミンゴのポーズ", reps: "10秒キープ", tips: "かたあしでバランス！", iconName: "Activity" },
                { name: "プランク", reps: "10秒", tips: "せなかをまっすぐに", iconName: "Minus" },
            ]
        },
        3: { // Wednesday
            day: "水曜日",
            theme: "パワー・足のちから",
            description: "今日のテーマ：じぇっときかく！ じめんをけろう。",
            color: "border-nadeshiko-light",
            items: [
                { name: "カエルとび", reps: "10回", tips: "てをゆかについてからジャンプ", iconName: "Rabbit" },
                { name: "スクワット", reps: "10回", tips: "いすにすわるように", iconName: "ArrowDown" },
                { name: "ランジ", reps: "10回", tips: "おおきくいっぽまえへ", iconName: "MoveHorizontal" },
            ]
        },
        4: { // Thursday
            day: "木曜日",
            theme: "ゆうさんそ・スタミナ",
            description: "今日のテーマ：つかれないからだ！ さいごまでげんきに。",
            color: "border-nadeshiko-blue",
            items: [
                { name: "ジャンピングジャック", reps: "15回", tips: "てとあしをパカっとひらく", iconName: "Combine" },
                { name: "マウンテンクライマー", reps: "20回", tips: "やべをのぼるようにあしをうごかす", iconName: "TrendingUp" },
                { name: "バーピー（ジャンプなし）", reps: "5回", tips: "たって、ねて、たつ！", iconName: "Repeat" },
            ]
        },
        5: { // Friday
            day: "金曜日",
            theme: "コーディネーション",
            description: "今日のテーマ：あたまをつかう！ おもいどおりに動くかな？",
            color: "border-nadeshiko-red",
            items: [
                { name: "クロスタッチ", reps: "10回", tips: "みぎてでひだりのあしをさわる", iconName: "Combine" },
                { name: "バック走", reps: "10ぽ", tips: "うしろむきにはしってみよう", iconName: "Repeat" },
                { name: "ケンケンパ", reps: "10回", tips: "リズムよく！", iconName: "Footprints" },
            ]
        },
        6: { // Saturday
            day: "土曜日",
            theme: "ウィークエンド・チャレンジ",
            description: "今日のテーマ：１しゅうかんのまとめ！ ぜんぶできるかな？",
            color: "border-nadeshiko-light",
            items: [
                { name: "カエルとび", reps: "10回", tips: "たかくジャンプ！", iconName: "Rabbit" },
                { name: "くまさんあるき", reps: "10ぽ", tips: "のしのしあるこう", iconName: "Footprints" },
                { name: "そのばダッシュ", reps: "20回", tips: "さいごまで全力！", iconName: "Zap" },
            ]
        },
        0: { // Sunday
            day: "日曜日",
            theme: "スーパーチャレンジ",
            description: "今日のテーマ：じぶんへのちょうせん！ なんかいできる？",
            color: "border-yellow-500", // Gold for Sunday
            items: [
                { name: "バーピー", reps: "できるだけ", tips: "1分間でなんかいできる？", iconName: "Rocket" },
                { name: "スクワット", reps: "できるだけ", tips: "つかれてもやめない！", iconName: "ArrowDown" },
                { name: "プランク", reps: "できるだけ", tips: "ながくがんばろう", iconName: "Activity" },
            ]
        },
    };

    return menus[dayIndex];
}
