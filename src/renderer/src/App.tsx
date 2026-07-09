import { Route, Routes, useLocation, useNavigate, useNavigationType } from "react-router-dom"
import ProfileSelectionPage from "./pages/ProfileSelectionPage"
import ProfileCreation from "./pages/ProfileCreation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { MainPage } from "./pages/MainPage"
import { ParticipantInfo, useTelemetry } from "./hooks/useTelemetry"
import { RaceStateValues, SessionStateValues } from "./utils/enums"
import { calculateRatingChange, groupAndSortByClass, loadRaceHistory, returnClassPositionByRacePosition, saveRaceHistory, saveSingleProfile, saveSingleRace, strengthToRating } from "./utils/helpers"
import { Profile, RaceData, RaceRecord } from "./utils/interfaces"

function App(): React.JSX.Element {
  const navigate = useNavigate()
  const navType = useNavigationType();
  const location = useLocation()
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [maxHistory, setMaxHistory] = useState<number>(0);

  const [currProfile, setCurrProfile] = useState<Profile>();
  const gameInfo = useTelemetry(['gameStates', 'participants', 'carState', 'wheelsAndTyres', 'vehicleInformation', 'eventInformation'], 500);
  const [currData, setCurrData] = useState<RaceData>();
  const [raceInformation, setRaceInformation] = useState<RaceRecord>();

  const [recording, setRecording] = useState<boolean>(false);
  const [currStrength, setCurrStrength] = useState<number>(100);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [playerParticipantIndex, setPlayerParticipantIndex] = useState<number>(-1);
  const [raceHistory, setRaceHistory] = useState<Record<string, RaceRecord[]> | undefined>(undefined);

  const prevIsRacing = useRef<boolean>(isRacing);

  useEffect(() => {
    if (navType === 'PUSH') {
      setHistoryIndex(prev => {
        const next = prev + 1;
        setMaxHistory(next)
        return next
      })
    }
  }, [navType])

  function navigateForward() {
    navigate(1)
    setHistoryIndex(prev => prev + 1)
  }

  function navigateBackward() {
    navigate(-1)
    setHistoryIndex(prev => prev - 1)
  }

  function setActiveProfile(profile: Profile) {
    setCurrProfile(profile)
    navigate('/main-page')
  }

  const canGoForward = historyIndex < maxHistory;
  const canGoBackward = historyIndex !== 0;

  useEffect(() => {

    if (gameInfo.data == null)
      return;

    let updatedRaceData: RaceData = {
      mGameState: gameInfo.data.gameStates.mGameState,
      mRaceState: gameInfo.data.gameStates.mRaceState,
      mSessionState: gameInfo.data.gameStates.mSessionState as SessionStateValues,
      mNumParticipants: gameInfo.data.participants.mNumParticipants,
      participants: gameInfo.data.participants.mParticipantInfo,
      mViewedParticipantIndex: gameInfo.data.participants.mViewedParticipantIndex,
      mLastOpponentCollisionIndex: gameInfo.data.carState.mLastOpponentCollisionIndex,
      mLastOpponentCollisionMagnitude: gameInfo.data.carState.mLastOpponentCollisionMagnitude,
      mTranslatedTrackLocation: gameInfo.data.eventInformation.mTranslatedTrackLocation,
      mTranslatedTrackVariation: gameInfo.data.eventInformation.mTranslatedTrackVariation
    }

    if (updatedRaceData.mViewedParticipantIndex != -1)
      setPlayerParticipantIndex(updatedRaceData.mViewedParticipantIndex)

    if (raceInformation && currData && isRacing && playerParticipantIndex != -1) {
      let currPlayer: ParticipantInfo = updatedRaceData.participants[playerParticipantIndex];
      let prevPlayer: ParticipantInfo = currData.participants[playerParticipantIndex];

      let tempRaceInformation = {...raceInformation}

      if (currPlayer.mCurrentLap != prevPlayer.mCurrentLap && currPlayer.mCurrentLap > 1) {
        if (tempRaceInformation.lapTimes)
          tempRaceInformation.lapTimes.push(currPlayer.mLastLapTimes);
        else {
          tempRaceInformation.lapTimes = [currPlayer.mLastLapTimes];
        }
      }

      setRaceInformation(tempRaceInformation)
    }

    // Current Race Data
    if (updatedRaceData.mSessionState == SessionStateValues.SESSION_RACE && updatedRaceData.mRaceState == RaceStateValues.RACESTATE_RACING)
    {
      if (!isRacing)
      {
        setPlayerParticipantIndex(updatedRaceData.mViewedParticipantIndex)
        setRaceInformation({id: crypto.randomUUID()});
        setIsRacing(true)
      }

    }
    else
    {
      setIsRacing(false);
    }
    setCurrData(updatedRaceData)
  }, [gameInfo.data])

  useEffect(() => {
    if (!currData)
      return;

    if (playerParticipantIndex != -1)
      console.log(currData.participants[playerParticipantIndex])

    if (prevIsRacing.current && !isRacing && currData.mRaceState == RaceStateValues.RACESTATE_FINISHED && recording) {
      console.log("Race finished! Final race data: ", currData);

      if (!currProfile)
        return

      let playerRating = currProfile?.driverRating;
      let classSorting = groupAndSortByClass(currData.participants);
      let numOpponents = classSorting[currData.participants[playerParticipantIndex].mCarClassNames].length;
      let position = returnClassPositionByRacePosition(currData.participants[playerParticipantIndex].mRacePosition, classSorting[currData.participants[playerParticipantIndex].mCarClassNames]);
      let calculatedRatingChange = calculateRatingChange(playerRating, currStrength, position, numOpponents);

      if (currProfile && currProfile.id && raceInformation) {
        let tempProfile = {...currProfile};
        tempProfile.driverRating += calculatedRatingChange;
        setCurrProfile(tempProfile)

        let tempRaceHistory = {...raceHistory};

        let tempRaceInformation: RaceRecord = {...raceInformation};

        // Might need to insert last lap here... not sure

        tempRaceInformation.ratingChange = calculatedRatingChange;
        tempRaceInformation.classFieldCount = numOpponents;
        tempRaceInformation.positionInClass = position;
        tempRaceInformation.positionOverall = currData.participants[playerParticipantIndex].mRacePosition;
        tempRaceInformation.track = currData.mTranslatedTrackLocation;
        tempRaceInformation.variant = currData.mTranslatedTrackVariation;
        tempRaceInformation.aiStrength = currStrength;
        tempRaceInformation.participants = currData.participants;
        tempRaceInformation.car = currData.participants[playerParticipantIndex].mCarNames;
        tempRaceInformation.carClass = currData.participants[playerParticipantIndex].mCarClassNames;
        tempRaceInformation.date = Date.now();

        if (tempRaceHistory[currProfile.id])
        {
          tempRaceHistory[currProfile.id] = [...tempRaceHistory[currProfile.id], tempRaceInformation]
        }
        else
        {
          tempRaceHistory[currProfile.id] = [tempRaceInformation]
        }
        
        saveRaceHistory(tempRaceHistory);
        
          
        setRaceHistory(tempRaceHistory);
        setRaceInformation(undefined);
        setCurrData(undefined);
      }
    }

    prevIsRacing.current = isRacing
  }, [isRacing])

  useEffect(() => {
    if (currProfile) {
        saveSingleProfile(currProfile);
    }

    if (!raceHistory) {
      loadRaceHistory().then(data => {
        if (data != null)
          setRaceHistory(data)
        else { 
          if (currProfile?.id) {
            setRaceHistory({
              [currProfile.id]: []
            })
          }

        }
      });
    }
  }, [currProfile])

  useEffect(() => {
    if (location.pathname == "/")
      setCurrProfile(undefined)
  }, [location.pathname])

  return (
    <div className="relative">
      <div className="flex absolute top-2 left-2">
        <ChevronLeft onClick={canGoBackward ? () => navigateBackward() : undefined} 
        className={`z-50 bg-surface mr-5 w-10 h-10 duration-150 rounded-sm ${
          canGoBackward ? 'hover:bg-surface-hover cursor-pointer' :
          'opacity-30 cursor-not-allowed'
        }`}/>
        <ChevronRight onClick={canGoForward ? () => navigateForward() : undefined} 
        className={`z-50 bg-surface mr-5 w-10 h-10 duration-150 rounded-sm ${
          canGoForward ? 'hover:bg-surface-hover cursor-pointer' :
          'opacity-30 cursor-not-allowed'
        }`}/>
      </div>
      <Routes>
        <Route path="/" element={<ProfileSelectionPage activeProfileFunc={setActiveProfile}/>}/>
        <Route path="/profile-creation" element={<ProfileCreation/>}/>
        <Route path="/main-page" element={<MainPage raceHistory={raceHistory ? raceHistory : {}} currStrength={currStrength} setCurrStrength={setCurrStrength} recording={recording} setRecording={setRecording} profile={currProfile}/>}/>
      </Routes>
    </div>


  )
}

export default App
