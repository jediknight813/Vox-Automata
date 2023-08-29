import React, {useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { GetGame, GetBotResponse, UndoLastMessage, ResetStory } from '../../api/GameRoutes';
import Cookies from 'js-cookie';
import ChatHistory from './ChatHistory';
import SendMessage from './SendMessage';


const GamePage = () => {
    const { GameId } = useParams();
    const [gameData, setGameData] = useState()
    const [usernameValue, setUsername] = useState(undefined)
    const navigate = useNavigate()
    const [ userMessageValue, setUserMessageValue ] = useState("")


    const SendUserMessage = () => {
        if (userMessageValue == "") {
            return
        }
        setGameData(gameData => ({
            ...gameData,
            messages: [...gameData.messages, {"name": gameData["player"]["name"], "type": "user", "message": userMessageValue}]
        }));
        getBotResponseToPlayer()
        setUserMessageValue("")
    }


    const getBotResponseToPlayer = async () => {
        const response = await GetBotResponse(GameId, usernameValue, userMessageValue)
        setGameData(gameData => ({
            ...gameData,
            messages: [...gameData.messages, {"name": gameData["npc"]["name"], "type": "bot", "message": response}]
        }));
    }


    const undoLastMessage = async () => {
        const response = await UndoLastMessage(GameId, usernameValue)
        console.log(response)
        setGameData(gameData => ({
            ...gameData,
            messages: gameData.messages.slice(0, -1)
        }));
    }

    const CallResetStory = async () => {
        const response = await ResetStory(GameId, usernameValue)
        console.log(response)
        setGameData(gameData => ({
            ...gameData,
            messages: []
        }));
    }


    useEffect(() => {
        var username = Cookies.get('username')
        setUsername(username)

        if (usernameValue != undefined) {
            const getGameData = async () => {
                const response = await GetGame(GameId, username)
                if (response["message"]["username"] !== usernameValue) {
                    navigate("/Hub")
                }
                setGameData(response["message"])
            }
            getGameData()
        }

    }, [usernameValue])


    return (
        <>
        
            
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">This will reset the story.</h3>
                    <p className="py-4">Are you sure you want to continue?</p>
                    <div className="modal-action">
                    <button onClick={() => CallResetStory()} className="btn">Confirm</button>
                    <button className="btn">Close</button>
                    </div>
                </form>
            </dialog>
                
        
            <div className=' w-full min-h-screen h-auto flex flex-col items-center'>

                {(gameData != undefined) &&
                    <>
                        <div className=' w-[95%] h-[80vh] md:max-h-[600px] max-w-[800px] flex flex-col gap-5 mb-5 bg-slate-700'>
                            <ChatHistory chat_messages={gameData["messages"]} player_data={gameData["player"]} npc_data={gameData["npc"]}/>
                            <SendMessage submitUserMessage={SendUserMessage} userMessageValue={userMessageValue} setUserMessageValue={setUserMessageValue}/>
                        </div>
                        
                        {/* chat options */}
                        <div className=' flex flex-wrap w-full justify-center gap-5 mb-20'>
                            {(gameData["messages"].length >= 1) &&
                                <>
                                    <button onClick={() => undoLastMessage()} className=' btn'>Undo Last Message</button>
                                    <button className="btn" onClick={ ()=> { window.my_modal_5.showModal()}}>Restart Story</button>
                                </>
                            }
                        </div>
                    </>
                }
        
            </div>
          
        </>
    )

}

export default GamePage