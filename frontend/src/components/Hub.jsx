import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import PlayerCharacterCard from './HubCards/PlayerCharacterCard'
import NpcCharacterCard from './HubCards/NpcCharacterCard'
import SenarioCard from './HubCards/ScenarioCard'
import GameCard from './ContinueGames'


const Hub = () => {
    const [usernameValue, setUsername] = useState()
    const navigate = useNavigate()



    useEffect(() => {
        var username = Cookies.get('username')
        console.log(username)
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