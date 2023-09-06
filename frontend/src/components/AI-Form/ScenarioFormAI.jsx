import React, {useState, useEffect, useMemo} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import NpcCharacterCard from '../HubCards/NpcCharacterCard'
import PlayerCharacterCard from '../HubCards/PlayerCharacterCard'
import { GetUserEntry } from '../../api/FormRoutes'
import { FormatPromptForScenario } from './promptFormats/Scenario'
import { GetChatGptResponse } from '../../api/ChatGpt'
import { CreateEntry } from '../../api/FormRoutes'


const ScenarioFormAI = () => {
    const [usernameValue, setUsername] = useState()
    const [scenarioNameValue, setScenarioNameValue] = useState("")
    const [playerId, setPlayerId] = useState()
    const [npcId, setNpcId] = useState()
    const navigate = useNavigate()
    const [playerData, setPlayerData] = useState()
    const [npcData, setNpcData] = useState()
    const [scenarioPrompt, setSenarioPrompt] = useState("")
    const [scenario, setScenario] = useState("")
    

    const GetId = (keyName) => {
        if (keyName == "player"){
            return playerId
        }
        if (keyName == "npc") {
            return npcId
        }
        
    }

    const UpdateSelected = (fieldName, value) => {
        if (fieldName == "player"){
            setPlayerId(value)
        }
        if (fieldName == "npc") {
            setNpcId(value)
        }
    }


    const generateScenario = async () => {
        try {
          const PromptList = FormatPromptForScenario(playerData, npcData, scenarioPrompt);
          const response = await GetChatGptResponse(PromptList);
          setScenario(response)
        } catch (error) {
          console.error(error);
        }
      };


    const SaveScenario = async () => {
        if (scenarioNameValue == "" || npcId == undefined || playerId == undefined){
            return
        }

        try {
            var data = {
                "field_name": "Scenarios",
                "name": scenarioNameValue,
                "npc": npcId,
                "player": playerId,
                "scenario": scenario,
                "username": usernameValue
            }
            const response = await CreateEntry(data);
            console.log(response)
            navigate("/")
        } catch (error) {
          console.error(error);
        }
    };
    

    useEffect(() => {

        const getPlayerData = async () => {
            if (playerId != undefined && playerId != "") {
                const playerData = await GetUserEntry("PlayerCharacters", playerId, usernameValue);
                console.log(playerData)
                setPlayerData(playerData[0])
            }
        }

        getPlayerData()

        const getNpcData = async () => {
            if (npcId != undefined && npcId != "") {
                const npcData = await GetUserEntry("NpcCharacters", npcId, usernameValue);
                console.log(npcData)
                setNpcData(npcData[0])
            }
        }

        getNpcData()

    }, [playerId, npcId])


    // check if user is signed in.
    useEffect(() => {
        var username = Cookies.get('username')
        if (username == undefined) {
            navigate("/")
        }
        setUsername(username)
    })


    return (
        <div className=' w-full min-h-screen h-auto flex flex-col items-center'>
                
            {(usernameValue !== undefined) &&
                // form parent 
                <div className='flex font-Comfortaa flex-col p-5 items-center w-full max-w-[600px] gap-5 bg-website-primary h-auto min-h-[300px] mt-20 rounded-md mb-20'>
                
                    <h1 className=' font-Comfortaa text-2xl'> Generate Scenario</h1>

                    {/* scenario name field. */}
                    <div className=' md:w-[95%] w-full flex gap-2 items-center'>
                        <h1>Name</h1>
                        <input onBlur={(e) => setScenarioNameValue(e.target.value)} type='text' placeholder='enter scenario name.' className=' input w-[70%]'/>
                    </div>


                    <PlayerCharacterCard type="select" username={usernameValue} setSelected={UpdateSelected} selectedId={GetId} fieldName={"player"} />
                    <NpcCharacterCard type="select" username={usernameValue} setSelected={UpdateSelected} selectedId={GetId} fieldName={"npc"} />
                    
                    {/* scenario prompt field. */}
                    <div className=' md:w-[95%] w-full flex gap-2 items-center'>
                        <h1>senario prompt</h1>
                        <input onBlur={(e) => setSenarioPrompt(e.target.value)} type='text' placeholder='enter scenario prompt.' className=' input w-[70%]'/>
                    </div>

                    {(scenario !== "") &&
                        <div className=' w-full min-h-[300px] h-auto flex items-center gap-2 flex-col'>
                            <h1>Generated Scenario</h1>
                            <textarea value={scenario} onBlur={(e)=> setScenario(e.target.value)} className=' input w-full min-h-[300px] p-5 text-white font-Comfortaa h-auto flex-none' />
                        </div>
                    }

                    {(playerData !== undefined && npcData !== undefined && scenarioPrompt !== "") &&
                        <button onClick={generateScenario} className=' btn bg-website-accent text-white'>Generate Scenario</button>
                    }
                    
                    {(scenarioNameValue !== "" && scenario !== "") &&
                        <button onClick={SaveScenario} className=' btn bg-website-accent text-white'>Save Scenario</button>
                    }
                    

                </div>
            }

        </div>
    )
}


export default ScenarioFormAI
