import { Modal } from "@renderer/components/Modal";
import ProfileSelectionCard, { ProfileDetails } from "@renderer/components/ProfileSelectionCard";
import { loadProfile, saveProfiles, saveSingleProfile } from "@renderer/utils/helpers";
import { Profile } from "@renderer/utils/interfaces";
import { useEffect, useState } from "react";

interface ProfileSelectionPageProps {
    activeProfileFunc: (profile: Profile) => void;
}

export default function ProfileSelectionPage(props: ProfileSelectionPageProps) {

    const [profiles, setProfiles] = useState<Profile[]>([])
    const [showModal, setShowModal] = useState(false);
    const [profileCandidateId, setProfileCandidateId] = useState<string>("")

    function deleteProfileConfirmation(event: React.MouseEvent<HTMLDivElement>, profileId: string) {
        event.stopPropagation();
        setProfileCandidateId(profileId)
        setShowModal(true)
    }

    function deleteProfile() {
        let tempProfiles = [...profiles];
        tempProfiles = tempProfiles.filter(p => p.id !== profileCandidateId);
        setProfiles(tempProfiles);
        saveProfiles(tempProfiles).then(() => setShowModal(false))
    }

    useEffect(() => {
        loadProfile().then(data => setProfiles(data ?? []))
    }, [])

    useEffect(() => {
    }, [profiles])

    function generateProfileCard(index: number) {
        if (profiles.length > index) {
            return (
                <div key={profiles[index].id} onClick={() => props.activeProfileFunc(profiles[index])}>
                    <ProfileSelectionCard
                    deleteFunc={deleteProfileConfirmation}
                    key={profiles[index].id}
                    id={profiles[index].id}
                    name={profiles[index].name}
                    driverRating={profiles[index].driverRating}
                    safetyRating={profiles[index].safetyRating}
                    />
                </div>

            )
        } else {
            return <ProfileSelectionCard deleteFunc={deleteProfileConfirmation} />
        }
    }

    return (
        <>
        <div className="flex flex-wrap justify-center gap-5 gap-10 text-center place-items-center h-screen ml-5 mr-5">
            {
                Array.from({length: profiles.length}, (_, index) => (
                    generateProfileCard(index)
                ))
            }
            {profiles.length < 3 && generateProfileCard(5)}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>You will lose all progress on this profile. Continue?</p>
            <button onClick={deleteProfile}>Confirm</button>
        </Modal>
        </>

    )
}