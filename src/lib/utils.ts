import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getRank(totalScore: number) {
    if (totalScore >= 1000) return "ワールドクラス";
    if (totalScore >= 500) return "日本代表クラス";
    if (totalScore >= 300) return "ファンタジスタ";
    if (totalScore >= 100) return "レギュラー";
    if (totalScore >= 50) return "ユース候補生";
    return "ルーキー";
}

export function getRankColor(rank: string) {
    switch (rank) {
        case "ワールドクラス": return "text-fuchsia-500 border-fuchsia-500";
        case "日本代表クラス": return "text-rose-600 border-rose-600";
        case "ファンタジスタ": return "text-purple-600 border-purple-600";
        case "レギュラー": return "text-blue-600 border-blue-600";
        case "ユース候補生": return "text-green-600 border-green-600";
        default: return "text-slate-500 border-slate-300";
    }
}
