import { ParticipantData, Profile, RatingInformation, SafetyInformation } from "./interfaces";

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function strengthToRating(percent: number): number {
    return 100 + (percent - 75) * (5900 / 45);
}

export function ratingToStrength(rating: number): number {
    return clamp(parseInt((75 + (rating - 100) * (45 / 5900)).toFixed(0)), 75, 120);
}

function opponentsBeaten(numOpponents: number, position: number) {
    return numOpponents - position;
}

export function calculateRatingChange(
    playerRating: number,
    aliStrengthPercent: number,
    finishPosition: number,
    totalInClass: number,
    K: number = 50,
    spread: number = 400
): number {
    const opponentRating = strengthToRating(aliStrengthPercent);
    const E = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / spread));
    const totalDelta = K * (opponentsBeaten(totalInClass, finishPosition) - (totalInClass - 1) * E);

    return parseInt((totalDelta / (totalInClass - 1)).toFixed(0));
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function loadProfile() {
    const profile = await window.api.file.read("profiles")
    return profile;
}

export async function loadRaceHistory() {
    const raceHistory = await window.api.file.read("history");
    return raceHistory;
}

export async function saveProfiles(updatedProfiles: Profile[]) {
    await window.api.file.write("profiles", updatedProfiles)
}

export async function saveRaceHistory(updatedRaceHistory: any) {
    await window.api.file.write("history", updatedRaceHistory);
}

export async function saveSingleProfile(profile: Profile) {
    const profiles = (await loadProfile()) ?? [];
    for (let i = 0; i < profiles.length; i++) {
        if (profiles[i].id == profile.id) {
            profiles[i] = {...profile}
            break;
        }
    }

    await saveProfiles(profiles);
}

export async function saveSingleRace(raceRecord: any, profileId: string) {
    const raceHistory = (await loadRaceHistory()) ?? {};
    let raceArray = raceHistory[profileId];

    if (raceArray == undefined)
    {
        raceHistory[profileId] = [];
        raceArray = raceHistory[profileId]
    }

    raceArray.push(raceRecord);

    await saveRaceHistory(raceHistory);
}

export function groupAndSortByClass(participants: ParticipantData[]): Record<string, ParticipantData[]> {
    const grouped: Record<string, ParticipantData[]> = {};

    if (!isIterable(participants))
        return grouped;

    for (const participant of participants) {
        const className = participant.mCarClassNames;

        if (!grouped[className]) {
            grouped[className] = [];
        }

        grouped[className].push(participant);
    }

    for (const className in grouped) {
        grouped[className].sort((a, b) => a.mRacePosition - b.mRacePosition)
    }

    return grouped;
}

export function returnClassPositionByRacePosition(racePosition: number, classParticipants: ParticipantData[]) {
    for (let i = 0; i < classParticipants.length; i++) {
        if (classParticipants[i].mRacePosition == racePosition)
            return i + 1;
    }
    return -1;
}

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

export function returnRatingInformation(rating: number): RatingInformation {
    switch (true) {
        case rating < 800:
            return { ratingName: "Bronze", ratingColor: "#CD7F32" }
        case rating < 1600:
            return { ratingName: "Silver", ratingColor: "#C0C0C0" }
        case rating < 2400:
            return { ratingName: "Gold", ratingColor: "#FFD700" }
        case rating < 3200:
            return { ratingName: "Platinum", ratingColor: "#5FC9C9" }
        case rating < 4200:
            return { ratingName: "Diamond", ratingColor: "#4FA8F5" }
        default:
            return { ratingName: "Master", ratingColor: "#E63950" }
    }
}

export function calculateSafetyDelta(
    weightedIncidents: number,
    laps: number,
    currentSR: number,
    targetRate: number = 0.10,
    k: number = 0.4
): number {
    const actualRate = weightedIncidents / laps;
    const diff = targetRate - actualRate;

    if (diff >= 0) {
        return k * diff;
    }

    const severityMultiplier = 1 * currentSR / 6;
    
    return k * diff * severityMultiplier;
}

export function returnSafetyRatingInformation(rating: number): SafetyInformation {
    switch (true) {
        case rating < 2.0:
            return { ratingLetter: "R", ratingColor: '#8983A3' };
        case rating < 3.0:
            return { ratingLetter: "D", ratingColor: "#E8763C" };
        case rating < 4.0:
            return { ratingLetter: "C", ratingColor: "#E8B23C" };
        case rating < 5.0:
            return { ratingLetter: "B", ratingColor: "#D4D43C" };
        case rating < 6.0:
            return { ratingLetter: "A", ratingColor: "#5FD467" };
        default:
            return { ratingLetter: "S", ratingColor: "#4FE0D4" };
    }
}