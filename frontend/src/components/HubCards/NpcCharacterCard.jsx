import React, {useState, useEffect} from 'react'
import { GetEntries, RemoveEntry } from '../../api/FormRoutes'
import { useNavigate } from 'react-router-dom'
import { GetImage } from '../../api/UserRoutes'


const NpcCharacterCard = ( { type, username, setSelected=undefined, selectedId="", fieldName="" } ) => {
    const [NpcCharacters, setNpcCharacters] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const NpcCharacterEntrys = async () => {
            var response = await GetEntries("NpcCharacters", username)
            response = response.sort((a, b) => parseInt(b.last_modified) - parseInt(a.last_modified));
            setNpcCharacters(response)
        }
        NpcCharacterEntrys()

    }, [username])

    const DeleteEntry = async (collectionName, entryId) => {
        if (username != undefined) {
            setNpcCharacters(await RemoveEntry(collectionName, entryId, username))
            const updatedPlayerCharacters = NpcCharacters.filter(character => character["_id"] !== entryId);
            setNpcCharacters(updatedPlayerCharacters)
        }

    }

    const Card = ( { element, key } ) => {
        const [base64Image, setBase64Image] = useState()

        useEffect(() => {   
            const getNpcImage = async () => {
                var npcImg = await GetImage(element["image_base64_id"])
                setBase64Image(npcImg)
            }
            getNpcImage()
        })

        if (base64Image == undefined) {
            return (
                <>
                </>
            )
        }

        return (
            <div className="w-[350px] pt-5 text-white cursor-pointer rounded-xl flex-none relative mb-10 animate-fadeIn">
                <figure>
                    <img
                    src={`data:image/jpeg;base64,${base64Image}`}
                    loading="lazy"
                    className="w-96 h-[400px] rounded-xl rounded-bl-xl rounded-br-xl"
                    alt="Image"
                    />
                </figure>

                <div className="absolute bottom-0 w-[350px] h-[100px] bg-opacity-90 z-10 bg-blur backdrop-filter backdrop-blur-3xl text-lg flex flex-col items-center rounded-bl-xl rounded-br-xl">
                    
                    <div className="flex flex-col w-[95%] mt-1 gap-2">

                        <div className="flex gap-2 items-center">
                            <h1 className="-mb-2 font-Comfortaa">{element["name"]}</h1>
                            <div className="text-sm self-center bg-blue-500 bg mt-2 pr-2 pl-2 rounded-md">
                            {(element["wearing"] + element["name"] + element["gender"] + element["age"] + element["appearance"] + element["personality"]).length} Tokens
                            </div>
                        </div>

                        <div className="flex gap-4 mt-2">
                            {(type == "display") &&
                                <>
                                    <button onClick={() => navigate("/EditNpcCharacter/:"+element["_id"])} className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700 btn-sm'>Edit</button>
                                    <button onClick={() => DeleteEntry("NpcCharacters", element["_id"])} className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800 btn-sm'>Delete</button>
                                </>
                            }

                            {(type == "select") &&
                                <>
                                    { (element["_id"] == selectedId(fieldName) ) ?
                                        <button className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800 btn-sm'  onClick={() => setSelected(fieldName, "")}>unselect</button>
                                    :
                                        <button className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700 btn-sm'  onClick={() => setSelected(fieldName, element["_id"])}>select</button>
                                    }
                                </>
                            }
                        </div>

                    </div>
                </div>
            </div>
        )
    }


  return (
    <div className='flex flex-col w-[95%] max-w-[1200px] rounded-lg min-h-[250px]'>

        <div className=' flex flex-col md:flex-row gap-4 items-center'>
            <h1 className=' font-Comfortaa text-3xl font-bold'>Npc Characters</h1>
              {(NpcCharacters.length >= 1 && type != "edit") &&
                <button onClick={() => navigate("/CreateNpcCharacter")} className={`cursor-pointer mb-4 font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Npc</button>
              }
            </div>

        {/* overflow container */}
        <div className={`  w-full h-auto flex overflow-x-scroll min-h-[200px] gap-5 scrollbar-thin  ${(type  == "display") ? ' scrollbar-track-website-background scrollbar-thumb-purple-900 ' : ' scrollbar-website-primary scrollbar-thumb-purple-900 '}`}>
            {NpcCharacters.length == 0 ?
                <>
                  <div className=' flex flex-col items-center justify-center w-full gap-4'>
                      <h1 className='font-Comfortaa self-center text-center'>No npc characters found.</h1>
                      <button onClick={() => navigate("/CreateNpcCharacter")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Npc</button>
                  </div>
              </>
            :
            <>
                {NpcCharacters.map((element, index) => (
                    <Card element={element} key={index} />
                ))}
            </>
            }
        </div>

    </div>
  )
}

export default NpcCharacterCard