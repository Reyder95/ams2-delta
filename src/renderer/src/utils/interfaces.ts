import { RaceStateValues, SessionStateValues } from "./enums";

export interface ParticipantData {
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

export interface RaceData {
  mGameState: number;   // Determines whether we're in menu or in-game
  mRaceState: RaceStateValues;
  mSessionState: SessionStateValues;  // Determines whether we're in quali, race, formation lap, or practice
  mNumParticipants: number;
  participants: ParticipantData[];
  mViewedParticipantIndex: number;
  mLastOpponentCollisionIndex: number;
  mLastOpponentCollisionMagnitude: number;
  mTranslatedTrackLocation: string;
  mTranslatedTrackVariation: string;
}

export interface IncidentInformation {
  numOfftrack: number;
  numBigCollision: number;
  numSmallCollision: number;
  numSpins: number;
}

// Information regarding this particular race that we're calculating or storing.
export interface RaceRecord {
  id: string;
  incidentInformation?: IncidentInformation,
  ratingChange?: number;
  classFieldCount?: number;
  positionInClass?: number;
  positionOverall?: number;
  track?: string;
  variant?: string;
  aiStrength?: number;
  participants?: ParticipantData[];
  lapTimes?: number[];
  car?: string;
  carClass?: string;
  date?: number;
}

export interface RatingInformation {
    ratingName: string;
    ratingColor: string;
}

export interface Profile {
    id?: string;
    name: string;
    driverRating: number;
    safetyRating: number;
}