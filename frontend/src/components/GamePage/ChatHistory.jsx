import React from 'react'
import DefaultProfileImage from "./images/DefaultProfileImage.png"


const ChatHistory = ( { chat_messages, player_data, npc_data, player_image, npc_image } ) => {


    const PlayerMessage = ({ player_name, message }) => {
        return (
            <div className="chat chat-start">

                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img src={`data:image/jpeg;base64,${player_image}`} />
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

                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img src={`data:image/jpeg;base64,${npc_image}`} />
                    </div>
                </div>

                <div className="chat-header font-Comfortaa flex">
                    <h1>{player_name}</h1>
                </div>

                <div className="chat-bubble bg-slate-900 text-white font-Comfortaa">{message}</div>
        </div>
        )
    }


    return (
        <> 
            <div className=' w-full flex flex-col max-h-[90%] rounded-md max-w-[98%] md:max-h-[600px] overflow-y-scroll scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-purple-800 p-2 gap-2'>
                {chat_messages.map((value, index) => (
                    <React.Fragment key={index}>
                        {value.type === "user" && (
                            <PlayerMessage player_name={value.name} message={value.message} image_base64={value.image_base64} />
                        )}
                        {value.type === "bot" && (
                            <BotMessage player_name={value.name} message={value.message} image_base64={value.image_base64} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default ChatHistory