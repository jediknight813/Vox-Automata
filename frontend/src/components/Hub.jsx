import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { GetEntries, RemoveEntry } from '../api/FormRoutes'


const Hub = () => {
    const [usernameValue, setUsername] = useState()
    const [playerCharacters, setPlayerCharacters] = useState([])
    const navigate = useNavigate()


    const DeleteEntry = async (collectionName, entryId) => {
        if (usernameValue != undefined) {
            setPlayerCharacters(await RemoveEntry(collectionName, entryId, usernameValue))
            const updatedPlayerCharacters = playerCharacters.filter(character => character["_id"] !== entryId);
            setPlayerCharacters(updatedPlayerCharacters)
        }

    }


    useEffect(() => {
        var username = Cookies.get('username')
        if (username == undefined) {
            navigate("/")
        }
        setUsername(username)
        const playerCharacterEntrys = async () => {
            if (usernameValue != undefined) {
                setPlayerCharacters(await GetEntries("PlayerCharacters", username))
            }
        }
        playerCharacterEntrys()

    }, [usernameValue])


  return (
    <div className=' min-h-screen h-auto w-full items-center flex flex-col'>

        {/* player character section */}
        <div className='flex flex-col w-[95%] max-w-[1200px] rounded-lg min-h-[250px] mt-12'>

            <div className=' flex flex-col md:flex-row gap-4 items-center'>
                <h1 className=' font-Comfortaa text-3xl font-bold'>Player Characters</h1>
                <button onClick={() => navigate("/CreatePlayerCharacter")} className=' cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold bg-slate-900 flex-none h-[50px]'>Create Player Character</button>
            </div>

            {/* overflow container */}
            <div className=' w-full h-auto flex overflow-x-scroll min-h-[200px] gap-5 scrollbar scrollbar-track-slate-800 scrollbar-thumb-purple-900'>
                {playerCharacters.length == 0 ?
                    <h1 className='font-Comfortaa self-center w-full text-center'>No player characters found.</h1>
                :
                <>
                    {playerCharacters.map((element, index) => (
                        <div className=' bg-slate-900 min-h-[200px] min-w-[200px] rounded-md flex flex-col items-center mt-5 mb-2' key={index}>
                            <h1 className=' self-center font-Comfortaa mt-10'>{element["name"]}</h1>
                            <div className=' flex gap-2 mt-auto mb-4'>
                                <button onClick={() => navigate("/EditPlayerCharacter/:"+element["_id"])} className=' btn text-white bg-purple-700 hover:bg-purple-700'>Edit</button>
                                <button onClick={() => DeleteEntry("PlayerCharacters", element["_id"])} className=' btn text-white bg-red-800 hover:bg-red-800'>Delete</button>
                            </div>
                        </div>
                    ))}
                </>
                 }
            </div>

        </div>



    </div>
  )
}

export default Hub