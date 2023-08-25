import React, {useState, useEffect} from 'react'
import { GetEntries, RemoveEntry } from '../../api/FormRoutes'
import { useNavigate } from 'react-router-dom'


const PlayerCharacterCard = ( { type, username, setSelected=undefined, selectedId="", fieldName="" } ) => {
    const [playerCharacters, setPlayerCharacters] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const playerCharacterEntrys = async () => {
            setPlayerCharacters(await GetEntries("PlayerCharacters", username))
        }
        playerCharacterEntrys()

    }, [username])

    const DeleteEntry = async (collectionName, entryId) => {
        if (username != undefined) {
            setPlayerCharacters(await RemoveEntry(collectionName, entryId, username))
            const updatedPlayerCharacters = playerCharacters.filter(character => character["_id"] !== entryId);
            setPlayerCharacters(updatedPlayerCharacters)
        }

    }


  return (
    <div className='flex flex-col w-[95%] max-w-[1200px] rounded-lg min-h-[250px]'>

        <div className=' flex flex-col md:flex-row gap-4 items-center'>
            <h1 className=' font-Comfortaa text-3xl font-bold'>Player Characters</h1>
            {(playerCharacters.length >= 1 && type != "edit") &&
                <button onClick={() => navigate("/CreatePlayerCharacter")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] ${(type  == "display") ? ' bg-slate-900 ' : ' bg-slate-800 '}`}>Create Player</button>
            }
            </div>

        {/* overflow container */}
        <div className={`  w-full h-auto flex overflow-x-scroll min-h-[200px] gap-5 scrollbar-thin  ${(type  == "display") ? ' scrollbar-track-slate-800 scrollbar-thumb-purple-900 ' : ' scrollbar-track-slate-900 scrollbar-thumb-purple-900 '}`}>
            {playerCharacters.length == 0 ?
                <>
                    <div className=' flex flex-col items-center justify-center w-full gap-4'>
                        <h1 className='font-Comfortaa self-center text-center'>No player characters found.</h1>
                        <button onClick={() => navigate("/CreatePlayerCharacter")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] ${(type  == "display") ? ' bg-slate-900 ' : ' bg-slate-800 '}`}>Create Player</button>
                    </div>
                </>
            :
            <>
                {playerCharacters.map((element, index) => (
                    <div className={` min-h-[200px] min-w-[200px] rounded-md flex flex-col items-center mt-5 mb-2 ${(type  == "display") ? ' bg-slate-900 ' : ' bg-slate-800 '}`} key={index}>
                        <h1 className=' self-center font-Comfortaa mt-10'>{element["name"]}</h1>
                        <div className=' flex gap-2 mt-auto mb-4'>

                            {(type == "display") &&
                                <>
                                    <button onClick={() => navigate("/EditPlayerCharacter/:"+element["_id"])} className=' btn text-white bg-purple-700 hover:bg-purple-700'>Edit</button>
                                    <button onClick={() => DeleteEntry("PlayerCharacters", element["_id"])} className=' btn text-white bg-red-800 hover:bg-red-800'>Delete</button>
                                </>
                            }

                            {(type == "select") &&
                                <>
                                    { (element["_id"] == selectedId(fieldName) ) ?
                                        <button className=' btn text-white bg-red-800 hover:bg-red-800'  onClick={() => setSelected(fieldName, "")}>unselect</button>
                                    :
                                        <button className=' btn text-white bg-purple-700 hover:bg-purple-700'  onClick={() => setSelected(fieldName, element["_id"])}>select</button>
                                    }
                                </>
                            }
                        
                        </div>
                    </div>
                ))}
            </>
            }
        </div>

    </div>
  )
}

export default PlayerCharacterCard