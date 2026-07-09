import { returnRatingInformation } from "@renderer/utils/helpers";
import { Plus, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom";

export interface ProfileDetails {
    deleteFunc: (e: React.MouseEvent<HTMLDivElement>, profileId: string) => void;
    id?: string;
    name?: string;
    driverRating?: number;
    safetyRating?: number;
}

export default function ProfileSelectionCard(props: ProfileDetails) {
    const navigate = useNavigate()

    function handleNewProfile() {
        navigate('/profile-creation');
    }

    return (
        <div className="relative" onClick={props.name == undefined ? () =>  handleNewProfile() : undefined}>
            {props.name && <div onClick={(e: React.MouseEvent<HTMLDivElement>) => props.deleteFunc(e, props.id ? props.id : "")} className="bg-accent rounded-full p-3 absolute -top-3 -right-3 hover:bg-accent-hover cursor-pointer duration-150"><Trash2/></div>}
            <div className="cursor-pointer bg-surface hover:bg-surface-hover duration-300 h-92 w-75 place-items-center text-center p-10 rounded-xl flex flex-col items-center">
                {props.name == undefined ? EmptyProfile() : ExistingProfile(props)}
            </div>
        </div>
    )
}

function EmptyProfile() {
    return (
        <div>
            <div className="bg-background p-10 rounded-full">
                <Plus className="w-15 h-15"/>
            </div>
            <div className="mt-8">
                <h2 className="font-bold">New Profile</h2>
            </div>
        </div>

    )
}

function ExistingProfile(props: ProfileDetails) {

    if (!props.driverRating)
        return;
    return (
        <div className="flex flex-col items-center">
            <div className="w-30 h-30 rounded-full overflow-hidden">
                <img
                src={"https://placeholdit.com/600x400/dddddd/999999"}
                alt={props.name}
                className="w-full h-full object-cover"
                />
            </div>

            <div className="mt-10">
                <h1 className="font-bold text-xl">{props.name}</h1>
            </div>

            <div className="align-center">
            <div className="relative group w-25 mt-5 flex items-center gap-2 bg-background p-2 rounded-md cursor-pointer">
                <div style={{ backgroundColor: returnRatingInformation(props.driverRating).ratingColor }} className={`rounded-full w-3 h-3 `}></div>
                <div><h1 className="font-semibold">{props.driverRating}</h1></div>
                <span className="duration-300 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover: visible transition-opacity delay-100 duration-200">
                    {returnRatingInformation(props.driverRating).ratingName}
                </span>
            </div>

            <div className="relative group w-25 mt-2 flex items-center gap-2 bg-background p-2 rounded-md">
                <div className="font-bold text-red-500">A</div>
                <div><h1 className="font-semibold">{props.safetyRating}</h1></div>
            </div>
            </div>
        </div>
    )
}