import { useState } from "react";
import Toggle from "./Toggle";
import { Bot } from "lucide-react";
import LabeledSlider from "./LabeledSlider";
import { ratingToStrength, returnRatingInformation } from "@renderer/utils/helpers";
import { Profile } from "@renderer/utils/interfaces";

interface MainPageBottomProps {
    profile: Profile
    setRecording: (value: boolean) => void;
    recording: boolean;
    setCurrStrength: (value: number) => void;
    currStrength: number;
}

export function MainPageBottom(props: MainPageBottomProps) {

    return (
        <div>
            <div className="absolute bottom-0 bg-surface w-125 h-25 gap-10 flex flex-wrap justify-center place-items-center p-5">
                <div className="flex flex-grid place-items-center">
                <div className="w-12 h-12 mr-3 rounded-full overflow-hidden">
                    <img
                    src={"https://placeholdit.com/600x400/dddddd/999999"}
                    alt={props.profile.name}
                    className="w-full h-full object-cover"
                    />
                </div>    
                <p className="font-bold">{props.profile.name}</p>
                </div>


                <div className="relative group w-25 flex items-center gap-2 bg-background p-2 rounded-md cursor-pointer">
                    <div style={{ backgroundColor: returnRatingInformation(props.profile.driverRating).ratingColor }} className={`rounded-full w-3 h-3`}></div>
                    <div><h1 className="font-semibold">{props.profile.driverRating}</h1></div>
                    <span className="duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover: visible transition-opacity delay-100 duration-200">
                        {returnRatingInformation(props.profile.driverRating).ratingName}
                    </span>
                </div>

                <div className="relative group w-25 flex items-center gap-2 bg-background p-2 rounded-md">
                    <div className="font-bold text-red-500">A</div>
                    <div><h1 className="font-semibold">{props.profile.safetyRating}</h1></div>
                </div>
            </div>
            <div className="gap-5 absolute bottom-25 right-0 bg-surface w-125 h-25 flex flex-wrap justify-center place-items-center p-5">
                <LabeledSlider 
                    min={75}
                    max={120}
                    initialValue={props.currStrength}
                    onChange={(value) => props.setCurrStrength(value)}
                />
                <div className="relative group flex items-center gap-2 p-2 rounded-md">
                    <div className="flex flex-wrap gap-3 cursor-pointer bg-accent p-2 rounded-lg">
                        <Bot/>
                        <p className="font-bold text-lg">{props.currStrength}%</p>
                    </div>
                    <span className="duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover: visible transition-opacity delay-100 duration-200">
                        Current AI Strength (in-game)
                    </span>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 bg-surface w-125 h-25 gap-25 flex flex-wrap justify-center place-items-center p-5">
                <Toggle checked={props.recording} onChange={props.setRecording} label="Record Races" />
                <div className="relative group flex items-center gap-2 p-2 rounded-md">
                    <div className="flex flex-wrap gap-3 cursor-pointer bg-accent p-2 rounded-lg">
                        <Bot/>
                        <p className="font-bold text-lg">{ratingToStrength(props.profile.driverRating)}%</p>
                    </div>
                    <span className="duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover: visible transition-opacity delay-100 duration-200">
                        Suggested AI Strength
                    </span>
                </div>
            </div>
        </div>

    )
}