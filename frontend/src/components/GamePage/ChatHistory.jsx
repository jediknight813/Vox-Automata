import React from 'react'
import DefaultProfileImage from "./images/DefaultProfileImage.png"


const ChatHistory = ( { chat_messages } ) => {

    const PlayerMessage = ({ player_name, message }) => {
        return (
            <div className="chat chat-start">

                <div className="chat-image avatar  hidden md:inline">
                    <div className="w-10 rounded-full">
                        <img src={DefaultProfileImage} />
                    </div>
                </div>

                <div className="chat-header font-Comfortaa">
                    {player_name}
                </div>

                <div className="chat-bubble bg-slate-900 text-white font-Comfortaa">{message}</div>

            </div>
        )
    }

    const BotMessage = ({ player_name, message }) => {
        return (
            <div className="chat chat-end"> 

                <div className="chat-image avatar hidden md:inline">
                    <div className="w-10 rounded-full">
                        <img src={DefaultProfileImage} />
                    </div>
                </div>

                <div className="chat-header font-Comfortaa">
                    {player_name}
                </div>

                <div className="chat-bubble bg-slate-900 text-white font-Comfortaa">{message}</div>
        </div>
        )
    }


    return (
        <> 
            <div className=' w-full flex flex-col max-h-[80%] rounded-md max-w-[98%] md:max-h-[600px] overflow-y-scroll scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-purple-800 p-5 gap-2'>
                {chat_messages.map((value, index) => (
                    <React.Fragment key={index}>
                        {value.type === "user" && (
                            <PlayerMessage player_name={value.name} message={value.message} />
                        )}
                        {value.type === "bot" && (
                            <BotMessage player_name={value.name} message={value.message} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default ChatHistory