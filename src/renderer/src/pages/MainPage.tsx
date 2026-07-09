import { MainPageBottom } from "@renderer/components/MainPageBottom"
import RaceHistoryList from "@renderer/components/RaceHistoryList"
import { Profile, RaceRecord } from "@renderer/utils/interfaces";

interface MainPageProps {
    profile?: Profile;
    raceHistory: Record<string, RaceRecord[]>
    setRecording: (value: boolean) => void
    recording: boolean;
    setCurrStrength: (value: number) => void;
    currStrength: number;
}

export function MainPage(props: MainPageProps) {
    return (
        <div className="relative h-screen">
            {props.profile && props.profile.id && (
                <div className="overflow-hidden">
                    <MainPageBottom currStrength={props.currStrength} setCurrStrength={props.setCurrStrength} recording={props.recording} setRecording={props.setRecording} profile={props.profile}/>
                    <div className="mt-15">
                        <RaceHistoryList raceArray={props.raceHistory[props.profile.id] ? props.raceHistory[props.profile.id] : []} />
                    </div>

                </div>

            )}
        </div>
    )
}