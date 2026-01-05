import { Zap, BarChart2, Trophy } from "lucide-react";

type Tab = "training" | "record" | "ranking";

interface BottomNavigationProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg pb-safe z-50">
            <div className="flex justify-around items-center p-2">
                <button
                    onClick={() => onTabChange("training")}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === "training" ? "text-nadeshiko-blue" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <Zap size={24} className={activeTab === "training" ? "fill-current" : ""} />
                    <span className="text-[10px] font-bold mt-1">トレーニング</span>
                </button>

                <button
                    onClick={() => onTabChange("record")}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === "record" ? "text-nadeshiko-blue" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <BarChart2 size={24} className={activeTab === "record" ? "fill-current" : ""} />
                    <span className="text-[10px] font-bold mt-1">記録・分析</span>
                </button>

                <button
                    onClick={() => onTabChange("ranking")}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === "ranking" ? "text-nadeshiko-blue" : "text-gray-400 hover:text-gray-600"
                        }`}
                >
                    <Trophy size={24} className={activeTab === "ranking" ? "fill-current" : ""} />
                    <span className="text-[10px] font-bold mt-1">ランキング</span>
                </button>
            </div>
        </div>
    );
}
