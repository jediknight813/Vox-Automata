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
            response = response.sort((a, b) => b.last_modified - a.last_modified);
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
            <div key={key} className="card card-compact w-[250px] flex-none bg-website-secondary shadow-xl">
            <figure><img src={`data:image/jpeg;base64,${base64Image}`} /></figure>
            <div className="card-body">
                <h2 className="card-title font-Comfortaa">{element["name"]}</h2>
                <div className="card-actions justify-end">
                {(type == "display") &&
                    <>
                        <button onClick={() => navigate("/EditNpcCharacter/:"+element["_id"])} className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700'>Edit</button>
                        <button onClick={() => DeleteEntry("NpcCharacters", element["_id"])} className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800'>Delete</button>
                    </>
                }

                {(type == "select") &&
                    <>
                        { (element["_id"] == selectedId(fieldName) ) ?
                            <button className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800'  onClick={() => setSelected(fieldName, "")}>unselect</button>
                        :
                            <button className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700'  onClick={() => setSelected(fieldName, element["_id"])}>select</button>
                        }
                    </>
                }
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