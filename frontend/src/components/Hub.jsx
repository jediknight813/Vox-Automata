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
    const [currentTab, setCurrentTab] = useState("Player Characters")


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

                <h1 className=' font-Comfortaa text-2xl md:text-3xl text-center'>{usernameValue}</h1>
                {(profileDetails != undefined) &&
                    <>
                        <div className=' flex gap-4 font-Comfortaa w-full items-center justify-center max-w-[400px]'>
                            <h1 className=' p-3 bg-website-accent rounded-lg text-center w-[48%]'>Words Generated <div>{profileDetails["generated_words"]}</div></h1>
                            <h1 className=' p-3 bg-website-accent rounded-lg text-center w-[48%]'>Words Typed <div>{profileDetails["typed_words"]}</div></h1>
                        </div>

                        <div className=' w-full flex gap-4 flex-wrap font-Comfortaa justify-center'>
                            <button onClick={() => setCurrentTab("Chats")} className=' rounded-lg btn-sm bg-purple-800 '>Chats</button>
                            <button onClick={() => setCurrentTab("Scenarios")} className=' rounded-lg btn-sm bg-purple-800'>Senarios</button>
                            <button onClick={() => setCurrentTab("Player Characters")} className=' rounded-lg btn-sm bg-purple-800 '>Player Characters</button>
                            <button onClick={() => setCurrentTab("Npc Characters")} className=' rounded-lg btn-sm bg-purple-800 '>Npc Characters</button>
                        </div>
                    </>
                }

                {(currentTab == "Npc Characters") &&
                    <NpcCharacterCard type="display" username={usernameValue}/>
                }

                {(currentTab == "Player Characters") &&
                    <PlayerCharacterCard type="display" username={usernameValue}/>
                }


                {(currentTab == "Chats") &&
                    <GameCard type="display" username={usernameValue}/>
                }


                {(currentTab == "Scenarios") &&
                    <SenarioCard type="display" username={usernameValue}/>
                }

            </>
        }



    </div>
  )
}

export default Hub