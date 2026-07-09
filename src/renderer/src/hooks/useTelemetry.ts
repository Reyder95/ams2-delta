import { RaceStateValues, SessionStateValues } from '@renderer/utils/enums';
import { useState, useEffect, useRef } from 'react';

interface GameStates {
    mGameState: number;
    mRaceState: RaceStateValues;
    mSessionState: SessionStateValues;
}

interface EventInformation {
    mLapsInEvent: number;
    mSessionDuration: number;
    mTranslatedTrackLocation: string;
    mTranslatedTrackVariation: string;
}

export interface ParticipantInfo {
    mName: string;
    mRacePosition: number;
    mClassPosition?: number;
    mRaceStates: number;
    mCarNames: string;
    mCarClassNames: string;
    mCurrentLap: number;
    mLapsCompleted: number;
    mFastestLapTimes: number;
    mLastLapTimes: number;
}

interface Participants {
    mViewedParticipantIndex: number;
    mNumParticipants: number;
    mParticipantInfo: ParticipantInfo[]
}

interface CarState {
    mLastOpponentCollisionIndex: number;
    mLastOpponentCollisionMagnitude: number
}

interface TelemetryData {
    gameStates: GameStates;
    participants: Participants;
    carState: CarState;
    eventInformation: EventInformation;
}

export function useTelemetry(sections: string[], intervalMs: number = 1000) {
    const [data, setData] = useState<TelemetryData| null>(null);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

    useEffect(() => {
        //console.log(data)
    }, [data])

    useEffect(() => {
        const query = sections.map(s => `${s}=true`).join('&');
        const url = `http://localhost:8180/crest2/v1/api?${query}`;

        const poll = async () => {
            try {
                const res = await fetch(url)
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json()
                setData(json)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown Error')
            }
        }

        poll()
        intervalRef.current = setInterval(poll, intervalMs)

        return () => clearInterval(intervalRef.current)
    }, [sections.join(','), intervalMs])

    return { data, error }
}