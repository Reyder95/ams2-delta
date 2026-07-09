import { RaceRecord } from "@renderer/utils/interfaces";
import RaceHistoryItem from "./RaceHistoryItem";
import { useEffect, useMemo } from "react";

interface RaceHistoryListProps {
    raceArray: RaceRecord[]
}

export default function RaceHistoryList(props: RaceHistoryListProps) {

    const sortedRaces = useMemo(() => {
        return [...props.raceArray].sort((a, b) => {
            if (a.date === undefined && b.date === undefined) return 0;
            if (a.date === undefined) return 1;
            if (b.date === undefined)return -1;

            return b.date - a.date;
        })
    }, [props.raceArray])

    return (
        <div className="ml-60 mr-60">
            {
                sortedRaces.map((raceRecord, index) => (
                    <RaceHistoryItem 
                    key={index}
                    raceRecord={raceRecord}
                    />
                ))
            }

        </div>
    )
}