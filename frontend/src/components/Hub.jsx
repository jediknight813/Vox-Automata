import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import PlayerCharacterCard from './HubCards/PlayerCharacterCard'
import NpcCharacterCard from './HubCards/NpcCharacterCard'
import SenarioCard from './HubCards/ScenarioCard'
import GameCard from './ContinueGames'
import { GetUserProfileDetails } from '../api/UserRoutes'


const Hub = () => {
    const [usernameValue, setUsername] = useState()
    const navigate = useNavigate()
    const [profileDetails, setProfileDetails] = useState()


    useEffect(() => {

        const getScenarioImage = async () => {
            var profileDetails = await GetUserProfileDetails(usernameValue)
            setProfileDetails(profileDetails)
        }
        if (usernameValue != undefined) {
            getScenarioImage()
        }

        var username = Cookies.get('username')
        if (username == undefined) {
            navigate("/")
        }
        setUsername(username)
    }, [usernameValue])


  return (
    <div className=' min-h-screen h-auto w-full items-center flex flex-col gap-16'>

        {/* player character section */}
        
        {(usernameValue != undefined) &&
            <>
                {/* this div is for spacing */}
                <div></div>

                <h1 className=' font-Comfortaa text-3xl'>{usernameValue}</h1>
                {(profileDetails != undefined) &&
                    <div className=' flex gap-4 font-Comfortaa w-full items-center justify-center'>
                        <h1 className=' p-4 bg-website-accent rounded-lg'>Generated Words {profileDetails["generated_words"]}</h1>
                        <h1 className=' p-4 bg-website-accent rounded-lg'>Words Typed {profileDetails["typed_words"]}</h1>
                    </div>
                }

                <PlayerCharacterCard type="display" username={usernameValue}/>
                <NpcCharacterCard type="display" username={usernameValue}/>
                <SenarioCard type="display" username={usernameValue}/>
                <GameCard type="display" username={usernameValue}/>
            </>
        }



    </div>
  )
}

export default Hub