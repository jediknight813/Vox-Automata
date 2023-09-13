import React, {useState, useEffect, useRef, useMemo } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import NpcCharacterCard from '../HubCards/NpcCharacterCard'
import PlayerCharacterCard from '../HubCards/PlayerCharacterCard'
import { GetUserEntry } from '../../api/FormRoutes'
import { FormatPromptForScenario } from './promptFormats/Scenario'
import { GetGenerateScenarioResponse } from '../../api/TextGeneration'
import { CreateEntry } from '../../api/FormRoutes'
import { useDebounce } from '../utils'


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
    const [isLoading, setIsloading] = useState(false)


    const textGenerationOptions = ["true", "false"]
    const [isTextGenerationLocal, setIsTextGenerationLocal] = useState()


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
        setIsloading(true)
        try {
          const CharacterDetails = FormatPromptForScenario(playerData, npcData);
          const response = await GetGenerateScenarioResponse(isTextGenerationLocal, playerData["name"], npcData["name"], CharacterDetails["character_one_details"], CharacterDetails["character_two_details"], scenarioPrompt);
          setScenario(response)
        } catch (error) {
          console.error(error);
        } finally {
            setIsloading(false);
          }
      };


    const SaveScenario = async () => {
        if (scenarioNameValue == "" || npcId == undefined || playerId == undefined){
            return
        }
        setIsloading(true)
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
            setIsloading(false)
            navigate("/")
        } catch (error) {
          console.error(error);
        }
    };


    const InputField = ( {name, fieldValue, setFieldValue, placeholder} ) => {
        const [value, setValue] = useState(fieldValue)
        const textareaRef = useRef(null);

        const debouncedRequest = useDebounce(() => {
            setFieldValue(value)
        });


        const onChange = (e) => {
            setValue(e.target.value);
            debouncedRequest();
        };


        useEffect(() => {
            if (textareaRef.current) {
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }, [value]);
        

        return (
            <div className='flex flex-col w-[95%] items-start gap-4'>
                <h1 className=' capitalize'>{name}</h1>
                <textarea
                    placeholder={placeholder}
                    ref={textareaRef}
                    value={value}
                    className="resize-none p-4 input w-full scrollbar-none"
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={(e) => onChange(e)}
                />
            </div>
        )
    }
    

    useEffect(() => {

        const getPlayerData = async () => {
            if (playerId != undefined && playerId != "") {
                const playerData = await GetUserEntry("PlayerCharacters", playerId, usernameValue);
                setPlayerData(playerData[0])
            }
        }

        getPlayerData()

        const getNpcData = async () => {
            if (npcId != undefined && npcId != "") {
                const npcData = await GetUserEntry("NpcCharacters", npcId, usernameValue);
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
                <div className='flex font-Comfortaa flex-col p-5 items-center w-full max-w-[800px] gap-5 bg-website-primary h-auto min-h-[300px] mt-20 rounded-md mb-20'>
                    
                    {isLoading && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60'>
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    )}

                    <h1 className=' font-Comfortaa text-2xl'> Generate Scenario</h1>

                    {/* scenario name field. */}
                    <div className=' md:w-[95%] w-full flex flex-col gap-2 items-start'>
                        <h1>Name</h1>
                        <input onBlur={(e) => setScenarioNameValue(e.target.value)} type='text' placeholder='enter scenario name.' className=' input w-full'/>
                    </div>

                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Local Text Generation</h1>
                        <select value={isTextGenerationLocal} className='input w-full' onChange={(e) => setIsTextGenerationLocal(e.target.value)}>
                            <option value="">Select an option</option>
                            {textGenerationOptions.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>


                    <PlayerCharacterCard type="select" username={usernameValue} setSelected={UpdateSelected} selectedId={GetId} fieldName={"player"} />
                    <NpcCharacterCard type="select" username={usernameValue} setSelected={UpdateSelected} selectedId={GetId} fieldName={"npc"} />
                    
                    {/* scenario prompt field. */}
                    <InputField placeholder={""} fieldValue={scenarioPrompt} setFieldValue={setSenarioPrompt} name={"senario prompt"} />

                    {(scenario !== "") &&
                        <InputField placeholder={""} fieldValue={scenario} setFieldValue={setScenario} name={"Generated Scenario"} />
                    }

                    {(playerData !== undefined && npcData !== undefined && scenarioPrompt !== "" && isTextGenerationLocal !== "") &&
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
