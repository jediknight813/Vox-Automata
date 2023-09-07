import React, {useState, useEffect} from 'react'
import { GetEntries, RemoveEntry } from '../api/FormRoutes'
import { useNavigate } from 'react-router-dom'
import { GetUserEntry } from '../api/FormRoutes'
import { GetImage } from '../api/UserRoutes'


const GameCard = ( { type, username, setSelected=undefined, selectedId="", fieldName="" } ) => {
    const [Game, setGame] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const GameCharacterEntrys = async () => {
            var response = await GetEntries("Games", username)
            response = response.sort((a, b) => b.last_modified - a.last_modified);
            setGame(response)
        }
        GameCharacterEntrys()

    }, [username])

    const DeleteEntry = async (collectionName, entryId) => {
        if (username != undefined) {
            setGame(await RemoveEntry(collectionName, entryId, username))
            const updatedGame = Game.filter(Game => Game["_id"] !== entryId);
            setGame(updatedGame)
        }

    }


    const Card = ( { element, key } ) => {
        const [base64Image, setBase64Image] = useState()
        const [gameData, setGameData] = useState(undefined)

        useEffect(() => {   

            const getScenarioImage = async () => {
                if (gameData != undefined) {
                    var scenarioImg = await GetImage(gameData["image_base64_id"])
                    setBase64Image(scenarioImg)
                }
            }

            getScenarioImage()


            const getScenario = async () => {
                if (gameData == undefined) {
                    const response = await GetUserEntry("Scenarios", element["scenario"], username)
                    setGameData(response[0])
                }
            }
            getScenario()

        }, [gameData])


        if (base64Image == undefined) {
            return (
                <>
                </>
            )
        }  

        return (
            <div key={key} className="w-[350px] pt-5 text-white cursor-pointer rounded-xl flex-none relative mb-10">
                <figure>
                    <img
                    src={`data:image/jpeg;base64,${base64Image}`}
                    loading="lazy"
                    className="w-96 rounded-xl rounded-bl-xl rounded-br-xl"
                    alt="Image"
                    />
                </figure>

                <div className="absolute bottom-0 w-[350px] h-[130px] bg-opacity-90 z-10 bg-blur backdrop-filter backdrop-blur-3xl text-lg flex flex-col items-center rounded-bl-xl rounded-br-xl">
                    
                    <div className="flex flex-col w-[95%] mt-1 gap-2">

                        <div className="flex gap-2 items-center">
                            <h1 className="-mb-2 font-Comfortaa truncate">{element["name"]}</h1>
                        </div>

                        <div className=' flex gap-4'>
                            <>
                                {element?.["messages"] !== undefined && (
                                    <>
                                        <div className="text-sm self-center bg-blue-500 mt-2 pr-2 pl-2 rounded-md">
                                            {element["messages"].reduce((acc, obj) => acc + obj.message.split(' ').filter(Boolean).length, 0)} words
                                        </div>
                                        <div className="text-sm self-center bg-purple-700 mt-2 pr-2 pl-2 rounded-md">
                                            {element["messages"].length} messages
                                        </div>
                                    </>
                                )}
                            </>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => navigate("/CurrentGame/:"+element["_id"])} className=' btn outline-none border-none  text-white bg-purple-700 hover:bg-purple-700 btn-sm'>Continue</button>
                            <button onClick={() => DeleteEntry("Games", element["_id"])} className=' btn outline-none border-none  text-white bg-red-800 hover:bg-red-800 btn-sm'>Delete</button>               
                        </div>

                    </div>
                </div>

            </div>
        )
    }


  return (
    <div className='flex flex-col w-[95%] max-w-[1200px] rounded-lg min-h-[250px] mb-20'>

        <div className=' flex flex-col md:flex-row gap-4 items-center'>
            <h1 className=' font-Comfortaa text-3xl font-bold'>Games</h1>
            {(Game.length >= 1 && type != "edit") &&
                <button onClick={() => navigate("/CreateGame")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Game</button>
            }
            </div>

        {/* overflow container */}
        <div className={`  w-full h-auto flex overflow-x-scroll min-h-[200px] gap-5 scrollbar-thin  ${(type  == "display") ? ' scrollbar-track-website-background scrollbar-thumb-purple-900 ' : ' scrollbar-website-primary scrollbar-thumb-purple-900 '}`}>
            {Game.length == 0 ?
                <>
                    <div className=' flex flex-col items-center justify-center w-full gap-4'>
                        <h1 className='font-Comfortaa self-center text-center'>No Games Found.</h1>
                        <button onClick={() => navigate("/CreateGame")} className={`cursor-pointer font-Comfortaa pr-2 pl-2 rounded-md font-bold flex-none h-[50px] bg-website-accent`}>Create Game</button>
                    </div>
                </>
            :
            <>
                {Game.map((element, index) => (
                    <Card element={element} key={index} />
                ))}
            </>
            }
        </div>

    </div>
  )
}


export default GameCard
