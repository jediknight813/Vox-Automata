import React, {useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { GetGenerateCharacterResponse } from '../../api/TextGeneration'
import { CreateEntry } from '../../api/FormRoutes'
import { useDebounce } from '../utils'


const CharacterFormAI = () => {
    const [usernameValue, setUsername] = useState()
    const navigate = useNavigate()
    const [characterPrompt, setCharacterPrompt] = useState("")
    const [isLoading, setIsloading] = useState(false)
    const characterAges = ["young adult", "middle age", "old"]
    const characterGenders = ["male", "female"]
    const textGenerationOptions = ["true", "false"]
    const [isTextGenerationLocal, setIsTextGenerationLocal] = useState()
    const [isPublic, setIsPublic] = useState("false")

    // character vars
    const [characterNameValue, setCharacterNameValue] = useState("")
    const [characterPersonalityValue, setPersonalityValue] = useState("")
    const [appearanceValue, setAppearanceValue] = useState("")
    const [wearingValue, setWearingValue] = useState("")
    const [ageValue, setAgeNameValue] = useState("")
    const [genderValue, setGenderValue] = useState("")


    const generateCharacter = async () => {
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


    const SaveCharacter = async () => {
        setIsloading(true)
        try {
            var data = {
                "field_name": "NpcCharacters",
                "username": usernameValue,
                "name": characterNameValue,
                "personality": characterPersonalityValue,
                "appearance": appearanceValue,
                "wearing": wearingValue,
                "age": ageValue,
                "gender": genderValue,
                "public": isPublic
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


    const InputField = ( {name, fieldValue, setFieldValue, placeholder} ) => {
        const textareaRef = useRef(null);
        const [value, setValue] = useState(fieldValue)


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
          }, [fieldValue]);
        

        return (
            <div className='flex flex-col w-[95%] items-start gap-4'>
                <h1 className=' capitalize'>{name}</h1>
                <textarea
                    ref={textareaRef}
                    value={value}
                    placeholder={placeholder}
                    className="resize-none p-4 input w-full scrollbar-none"
                    onChange={(e) => onChange(e)}
                />
            </div>
        )
    }


    return (
        <div className=' w-full min-h-screen h-auto flex flex-col items-center'>
                
            {(usernameValue !== undefined) &&
                // form parent 
                <div className='flex pb-10 font-Comfortaa flex-col p-5 items-center w-full max-w-[800px] gap-5 bg-website-primary h-auto min-h-[300px] mt-20 rounded-md mb-20'>
                    
                    {isLoading && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60'>
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    )}

                    <h1 className=' font-Comfortaa text-2xl'> Generate Character </h1>

                    {/* character prompt field. */}
                    <div className=' md:w-[95%] w-full flex gap-2 items-start flex-col'>
                        <h1 className=' capitalize'>character prompt</h1>
                        <input value={characterPrompt} onChange={(e) => setCharacterPrompt(e.target.value)} type='text' placeholder='enter character prompt.' className=' input w-full'/>
                    </div>

                    {/* use local text generation field. */}
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
                        <button onClick={generateCharacter} className=' btn bg-website-accent text-white'>Generate Character</button>
                    }


                    {/* character name field. */}
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Name</h1>
                        <input value={characterNameValue} onChange={(e) => setCharacterNameValue(e.target.value)} type='text' placeholder='character name.' className=' input w-full'/>
                    </div>

                    {/* character personality field. */}
                    <InputField name={"Personality"} fieldValue={characterPersonalityValue} setFieldValue={setPersonalityValue} placeholder='character personality.' />

                    {/* character appearance field. */}
                    <InputField name={"Appearance"} fieldValue={appearanceValue} setFieldValue={setAppearanceValue} placeholder='character appearance.' />

                    {/* character clothing field. */}
                    <InputField name={"Wearing"} fieldValue={wearingValue} setFieldValue={setWearingValue} placeholder='character is wearing.' />
                    
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
                    
                    <div className=' md:w-[95%] w-full flex gap-2  items-start flex-col'>
                        <h1>Public Scenario</h1>
                        <select value={isPublic} className='input w-full' onChange={(e) => setIsPublic(e.target.value)}>
                            <option value="">Select an option</option>
                            {textGenerationOptions.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(characterNameValue !== "" && ageValue !== "" &&  genderValue !== "" &&  wearingValue !== "" &&  characterPersonalityValue !== "" &&  appearanceValue !== "" ) && 
                        <button onClick={SaveCharacter} className=' btn bg-website-accent text-white'>Save Character</button>
                    }
                    
                </div>
            }

        </div>
    )
}


export default CharacterFormAI
