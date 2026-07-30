import { Profile } from "@renderer/utils/interfaces";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileCreation() {
    const [profileName, setProfileName] = useState<string>("")
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [userId, setUserId] = useState<string>("")
    const navigate = useNavigate();


    useEffect(() => {
        setUserId(crypto.randomUUID())
        loadProfiles().then(data => setProfiles(data ?? []))
    }, [])


    async function loadProfiles() {
        const profileData = await window.api.file.read("profiles")
        return profileData;
    }

    async function saveProfile() {
        if (profileName.length > 0 && profileName.trim() != "") {
            let newProfile: Profile = {
                id: userId,
                name: profileName,
                driverRating: 1350,
                safetyRating: 1.50
            }
            const updatedProfiles = [...profiles, newProfile]
            setProfiles(updatedProfiles)
            await window.api.file.write("profiles", updatedProfiles)
        }
    }

    function onSubmitProfile() {
        saveProfile().then(() => navigate('/'))
    }

    return (
        <div className="flex flex-wrap justify-center place-items-center h-screen">
            <form>
                <div className="flex justify-center">
                <div className="mb-10 bg-surface h-30 w-30 grid rounded-full place-items-center">
                    <Plus className="w-15 h-15"/>
                </div>
                </div>

                <label className="block font-bold text-xl w-100 mb-5">Profile Name</label>
                <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-surface w-100 h-10 rounded-md outline-none p-4 opacity-50 hover:opacity-100 focus:opacity-100 duration-150 font-bold text-gray-300 block" type="text"/>
                <button type="button" onClick={() => onSubmitProfile()} className="mt-10 float-right bg-accent p-3 rounded-md hover:bg-accent-hover cursor-pointer duration-150">Create Profile</button>
            </form>
        </div>
    )
}