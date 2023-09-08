import React, {useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { GetUserEntry } from '../../api/FormRoutes'
import { FormatPromptForScenario } from './promptFormats/Scenario'
import { GetGenerateCharacterResponse } from '../../api/TextGeneration'
import { CreateEntry } from '../../api/FormRoutes'


const CharacterFormAI = () => {
    const [usernameValue, setUsername] = useState()
    const navigate = useNavigate()
    const [characterPrompt, setCharacterPrompt] = useState("")
    const [isLoading, setIsloading] = useState(false)
    const characterAges = ["young adult", "middle age", "old"]
    const characterGenders = ["male", "female"]
    const textGenerationOptions = ["true", "false"]
    const [isTextGenerationLocal, setIsTextGenerationLocal] = useState()


    // character vars
    const [characterNameValue, setCharacterNameValue] = useState("")
    const [characterPersonalityValue, setPersonalityValue] = useState("")
    const [appearanceValue, setAppearanceValue] = useState("")
    const [wearingValue, setWearingValue] = useState("")
    const [ageValue, setAgeNameValue] = useState("")
    const [genderValue, setGenderValue] = useState("")


    const generateScenario = async () => {
        setIsloading(true)
        try {
            const response = await GetGenerateCharacterResponse(isTextGenerationLocal, characterPrompt);
            setCharacterNameValue(response["name"])
            setAppearanceValue(response["appearance"])
            setPersonalityValue(response["personality"])
            setWearingValue(response["wearing"])
        } catch (error) {
          console.error(error);
        } finally {
            setIsloading(false);
          }
      };


    const SaveScenario = async () => {
        setIsloading(true)
        try {
            var data = {
                "field_name": "NpcCharacters",
                "username": usernameValue,
                "name": characterNameValue,
                "personality": characterPersonalityValue,
                "appearance": characterPersonalityValue,
                "wearing": wearingValue,
                "age": ageValue,
                "gender": genderValue
            }
            const response = await CreateEntry(data);
            setIsloading(false)
            navigate("/")
        } catch (error) {
          console.error(error);
        }
    };
    

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
                <div className='flex pb-10 font-Comfortaa flex-col p-5 items-center w-full max-w-[600px] gap-5 bg-website-primary h-auto min-h-[300px] mt-20 rounded-md mb-20'>
                    
                    {isLoading && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60'>
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    )}

                    <h1 className=' font-Comfortaa text-2xl'> Generate Character </h1>

                    {/* scenario prompt field. */}
                    <div className=' md:w-[95%] w-full flex gap-2 items-start flex-col'>
                        <h1>character prompt</h1>
                        <input value={characterPrompt} onChange={(e) => setCharacterPrompt(e.target.value)} type='text' placeholder='enter scenario prompt.' className=' input w-full'/>
                    </div>

                    {/* character age field. */}
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

                    

                    {(characterPrompt !== "" && isTextGenerationLocal !== "") &&
                        <button onClick={generateScenario} className=' btn bg-website-accent text-white'>Generate Character</button>
                    }


                    {/* character name field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Name</h1>
                        <input value={characterNameValue} onChange={(e) => setCharacterNameValue(e.target.value)} type='text' placeholder='character name.' className=' input w-full'/>
                    </div>

                    {/* character personality field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Personality</h1>
                        <textarea value={characterPersonalityValue} onChange={(e) => setPersonalityValue(e.target.value)} type='text' placeholder='character personality.' className=' input w-full p-3 h-fit'/>
                    </div>

                    {/* character appearance field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Appearance</h1>
                        <textarea value={appearanceValue} onChange={(e) => setAppearanceValue(e.target.value)} type='text' placeholder='character appearance.' className=' input w-full p-3 h-fit'/>
                    </div>

                    {/* character clothing field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Wearing</h1>
                        <textarea value={wearingValue} onChange={(e) => setWearingValue(e.target.value)} type='text' placeholder='character is wearing.' className=' input w-full p-3 h-fit'/>
                    </div>

                    
                    {/* character age field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Age</h1>
                        <select value={ageValue} className='input w-full' onChange={(e) => setAgeNameValue(e.target.value)}>
                            <option value="">Select an option</option>
                            {characterAges.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* character gender field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Gender</h1>
                        <select value={genderValue} className='input w-full' onChange={(e) => setGenderValue(e.target.value)}>
                            <option value="">Select an option</option>
                            {characterGenders.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(characterNameValue !== "" && ageValue !== "" &&  genderValue !== "" &&  wearingValue !== "" &&  characterPersonalityValue !== "" &&  appearanceValue !== "" ) && 
                        <button onClick={SaveScenario} className=' btn bg-website-accent text-white'>Save Character</button>
                    }
                    
                </div>
            }

        </div>
    )
}


export default CharacterFormAI
