import React, {useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { GetGame, GetBotResponse } from '../../api/GameRoutes';
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
        <div className=' w-full min-h-screen h-auto flex justify-center'>

            {(gameData != undefined) &&
            <>
                <div className=' w-[95%] h-[90vh] md:max-h-[600px] max-w-[800px] flex flex-col gap-5 mb-20 bg-slate-700'>
                    <ChatHistory chat_messages={gameData["messages"]}/>
                    <SendMessage submitUserMessage={SendUserMessage} userMessageValue={userMessageValue} setUserMessageValue={setUserMessageValue}/>
                </div>
            </>
            }
        
        
        </div>
    )

}

export default GamePage