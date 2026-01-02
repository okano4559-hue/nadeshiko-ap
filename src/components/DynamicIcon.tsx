import { ArrowUpFromLine, ArrowLeftRight, Rabbit, ArrowDown, Activity, Rocket, Combine, CircleDot, Waves, Footprints, Repeat, ChevronsUp, TrendingUp, Zap, Dribbble, MoveHorizontal, CheckCircle, LucideProps } from "lucide-react";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Map string names to Lucide components
// We need to explicitly map them or use a dynamic import approach carefully.
// For this scale, a manual map is safer and keeps bundle size clear.

const IconMap: { [key: string]: React.FC<LucideProps> } = {
    ArrowUpFromLine,
    ArrowLeftRight,
    Rabbit,
    ArrowDown,
    Activity,
    Rocket,
    Combine,
    CircleDot,
    Waves,
    Footprints,
    Repeat,
    ChevronsUp,
    TrendingUp,
    Zap,
    Dribbble,
    MoveHorizontal,
    CheckCircle,
};

interface DynamicIconProps extends LucideProps {
    name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
    const IconComponent = IconMap[name];

    if (!IconComponent) {
        return null;
    }

    return <IconComponent {...props} />;
}
