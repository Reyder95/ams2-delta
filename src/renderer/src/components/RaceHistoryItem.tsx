import { RaceRecord } from "@renderer/utils/interfaces";
import { Trophy } from "lucide-react";

interface RaceHistoryItemProps {
    raceRecord: RaceRecord
}

export default function RaceHistoryItem(props: RaceHistoryItemProps) {

    function formatRelativeTime(timestamp: number): string {
        const now = Date.now()
        const diffMs = now - timestamp;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffDays < 1) {
            if (diffHours < 1) {
                return diffMinutes <= 0 ? 'Now' : `${diffMinutes}min`
            }
            return `${diffHours}h`
        }

        if (diffDays < 30) {
            return `${diffDays}d`
        }

        if (diffDays < 365) {
            return `${diffMonths}mo`
        }

        return `${diffYears}y`
    }

    function displayTrophy(position: number) {
        let className = ``;

        if (position <= 3) {
            if (position == 1)
                className = "text-yellow-400";
            else if (position == 2)
                className = "text-gray-400"
            else if (position == 3)
                className = "text-orange-400"

            return (
                <Trophy className={className}/>
            )
        }

        return (
            <div></div>
        )
    }

    return (
        <div className=" relative mb-3 cursor-pointer">
            <div className="bg-surface hover:bg-surface-hover duration-150 grid grid-cols-[40px_1fr_100px_70px_90px] gap-3 items-center p-3">

                {props.raceRecord.positionInClass ? displayTrophy(props.raceRecord.positionInClass) : undefined}                

                <div>
                    <p className="font-semibold"><span className="text-t-special">{props.raceRecord.track}</span> <span className="text-t-secondary font-extrabold">&middot;</span> <span className="text-t-secondary">{props.raceRecord.variant}</span></p>
                    <p className="text-sm text-t-secondary">{props.raceRecord.carClass} <span className="font-extrabold">&middot;</span> {props.raceRecord.car}</p>
                </div>

                <div>
                    <p><span className="font-bold text-t-special">P{props.raceRecord.positionInClass}</span> <span className="text-muted text-sm">/ {props.raceRecord.classFieldCount}</span></p>
                    <p className="text-muted text-sm">class field</p>
                </div>

                <div>
                    <p>{props.raceRecord.aiStrength}<span className="text-muted text-sm"> %</span></p>
                    <p className="text-muted text-sm">AI</p>
                </div>
                
                <div>
                    <p className={props.raceRecord.ratingChange && props.raceRecord.ratingChange >= 0 ? `text-green-500` : `text-red-500`}>{props.raceRecord.ratingChange && props.raceRecord.ratingChange >= 0 ? "+" + props.raceRecord.ratingChange : props.raceRecord.ratingChange}</p>
                    <p className="text-muted text-sm">rating</p>
                </div>
            </div>

            <div className="absolute top-2 right-2 text-muted font-bold">{props.raceRecord.date ? formatRelativeTime(props.raceRecord.date) : <p></p>}</div>
        </div>
    )
}