import React, {useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { GetGame, GetBotResponse, UndoLastMessage, ResetStory } from '../../api/GameRoutes'
import { GetImage } from '../../api/UserRoutes';
import Cookies from 'js-cookie';
import ChatHistory from './ChatHistory';
import SendMessage from './SendMessage';
import { affineDecrypt, affineEncrypt } from '../utils';
const VITE_MESSAGE_ENCRYPTION_KEY_MULTIPLICATIVE_KEY = import.meta.env.VITE_MESSAGE_ENCRYPTION_KEY_MULTIPLICATIVE_KEY ;
const VITE_MESSAGE_ENCRYPTION_KEY_ADDITIVE_KEY = import.meta.env.VITE_MESSAGE_ENCRYPTION_KEY_ADDITIVE_KEY;


const ChatPage = () => {
    const { GameId } = useParams();
    const [gameData, setGameData] = useState()
    const [usernameValue, setUsername] = useState(undefined)
    const navigate = useNavigate()
    const [playerBase64ImageValue, setPlayerBase64ImageValue] = useState()
    const [npcBase64ImageValue, setNpcBase64ImageValue] = useState()
    const scrollRef = useRef(null);
    // live text streaming hooks.
    const [isMessageStreaming, setIsMessageStreaming] = useState(false)
    const [streamingMessage, setStreamingMessage] = useState(false)
    const [isAiResponding, setIsAiResponding] = useState(false)
    // context hooks
    const [contextMode, setContextMode] = useState("None")


    const handleDecryption = (message) => {
        return affineDecrypt(message, (Number(VITE_MESSAGE_ENCRYPTION_KEY_ADDITIVE_KEY)), (Number(VITE_MESSAGE_ENCRYPTION_KEY_MULTIPLICATIVE_KEY)))
    } 
    
    const handleEncryption =  (message) => {
        return affineEncrypt(message, (Number(VITE_MESSAGE_ENCRYPTION_KEY_ADDITIVE_KEY)), (Number(VITE_MESSAGE_ENCRYPTION_KEY_MULTIPLICATIVE_KEY)))
    }  

    const SendUserMessage = (userMessageValue) => {
        if (userMessageValue == "") {
            return
        }

        setIsAiResponding(true)
        const currentTimestamp = new Date().getTime();
        const timestampStr = currentTimestamp.toString();
        setGameData(gameData => ({
            ...gameData,
            messages: [...gameData.messages, {"name": gameData["player"]["name"], "type": "user", "message": userMessageValue, "timestamp": timestampStr}]
        }));
        getBotResponseToPlayer(userMessageValue, timestampStr)
    }


    const getBotResponseToPlayer = async (userMessageValue, timestampStr) => {
        const response = await GetBotResponse(GameId, usernameValue, handleEncryption(userMessageValue), timestampStr, Cookies.get('PromptFormat'))
        setGameData(gameData => ({
            ...gameData,
            messages: [...gameData.messages, {"name": gameData["npc"]["name"], "type": "bot", "message": handleDecryption(response["response"]), timestamp: response["timestamp"]}]
        }));
        setIsAiResponding(false)
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
                response["message"]["messages"].forEach(element => {
                    element["message"] = handleDecryption(element["message"])
                });
                setGameData(response["message"])
            }
            getGameData()
        }

    }, [usernameValue])


    useEffect(() => {
        var username = Cookies.get('username')
        setUsername(username)
        setContextMode()
        
        if (gameData !== undefined ) {
            const getPlayerImage = async () => {
                var playerImg = await GetImage(gameData["player"]["image_base64_id"])
                setPlayerBase64ImageValue(playerImg)
            }
            getPlayerImage()

            const getNpcImage = async () => {
                var npcImg = await GetImage(gameData["npc"]["image_base64_id"])
                setNpcBase64ImageValue(npcImg)
            }
            getNpcImage()
        }

    }, [gameData])


    return (
        <>
        
            {/* confirm restart story */}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">This will reset the story.</h3>
                    <p className="py-4">Are you sure you want to continue?</p>
                    <div className="modal-action">
                    <button onClick={() => CallResetStory()} className="btn outline-none border-none bg-website-accent text-white">Confirm</button>
                    <button className="btn outline-none border-none btn-error">Close</button>
                    </div>
                </form>
            </dialog>


            {/* Context settings. */}
            <dialog id="my_modal_6" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">Context Settings</h3>
                    <p className="py-4">Press ESC key or click outside to close</p>
                    <button>close</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        
            <div className=' w-full min-h-screen h-auto flex flex-col items-center'>

                {(gameData != undefined && playerBase64ImageValue != undefined && npcBase64ImageValue !== undefined) &&
                    <>
                        <div className=' flex flex-col w-[95%] max-w-[800px] min-h-[300px] h-auto mb-4 bg-website-primary p-4'>
                            <div className='flex mb-4 md:max-h-[600px] h-[70vh] max-w-[800px] flex-col gap-5 bg-website-primary'>
                                <ChatHistory chat_messages={gameData["messages"]} player_data={gameData["player"]} npc_data={gameData["npc"]} player_image={playerBase64ImageValue} npc_image={npcBase64ImageValue} scrollRef={scrollRef} isAiResponding={isAiResponding}/>
                            </div>

                            <SendMessage submitUserMessage={SendUserMessage} />
                        </div>

                        {/* chat options */}
                        <div className=' flex flex-wrap w-full justify-center gap-5 mb-20'>
                            {(gameData["messages"].length >= 1) &&
                                <>
                                    <button onClick={() => undoLastMessage()} className=' btn outline-none border-none  bg-website-primary text-white'>Undo Last Message</button>
                                    <button className="btn outline-none border-none  bg-website-primary text-white" onClick={ ()=> { window.my_modal_5.showModal()}}>Restart Story</button>
                                </>
                            }
                             <button className="btn outline-none border-none  bg-website-primary text-white" onClick={ ()=> { window.my_modal_6.showModal()}}>Context Settings</button>
                        </div>
                    </>
                }
        
            </div>
          
        </>
    )

}

export default ChatPage