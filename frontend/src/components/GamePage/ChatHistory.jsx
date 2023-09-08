import React, { useEffect } from 'react'


const ChatHistory = ( { chat_messages, player_data, npc_data, player_image, npc_image, scrollRef, isMessageStreaming, streamingMessage } ) => {

    const numFrames = 60;
    useEffect(() => {
        if (scrollRef.current) {
          const element = scrollRef.current;
          const distanceToScroll = element.scrollHeight - element.scrollTop;
          const scrollInterval = distanceToScroll / numFrames;
          let frame = 0;
          const scrollSmoothly = () => {
            if (frame < numFrames) {
              element.scrollTop += scrollInterval;
              frame++;
              requestAnimationFrame(scrollSmoothly);
            }
          };
    
          // Start the smooth scrolling animation
          scrollSmoothly();
        }
      }, [scrollRef, chat_messages]);
      

    function formatTimestamp(timestampStr) {
        const currentTimestamp = parseFloat(timestampStr);
        if (isNaN(currentTimestamp)) {
          return '';
        }
        const currentDate = new Date(currentTimestamp);
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
        return formattedTime;
    }


    const PlayerMessage = ({ player_name, message, timestamp }) => {
        return (
            <div className="chat chat-start">

                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img srcSet={`data:image/jpeg;base64,${player_image}`} loading="lazy "/>
                    </div>
                </div>

                <div className="flex gap-2 chat-header font-Comfortaa">
                    <h1>{formatTimestamp(timestamp)}</h1>
                    <h1>{player_name}</h1>
                </div>

                <div className="chat-bubble bg-website-secondary text-white font-Comfortaa">{message}</div>

            </div>
        )
    }

    const BotMessage = ({ player_name, message, timestamp }) => {
        return (
            <div className="chat chat-end"> 

                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img srcSet={`data:image/jpeg;base64,${npc_image}`} loading="lazy" />
                    </div>
                </div>

                <div className="flex gap-2 chat-header font-Comfortaa">
                    <h1>{formatTimestamp(timestamp)}</h1>
                    <h1>{player_name}</h1>
                </div>

                <div className="chat-bubble bg-website-secondary text-white font-Comfortaa">{message}</div>
            </div>
        )
    }


    return (
        <> 
            <div ref={scrollRef} className=' w-full flex flex-col max-h-[90%] rounded-md max-w-[98%] md:max-h-[600px] overflow-y-scroll scrollbar-thin scrollbar-track-website-primary scrollbar-thumb-purple-800 p-2 gap-2'>
                {chat_messages.map((value, index) => (
                    <React.Fragment key={index}>
                        {value.type === "user" && (
                            <PlayerMessage player_name={value.name} message={value.message} timestamp={value?.timestamp} image_base64={value.image_base64} />
                        )}
                        {value.type === "bot" && (
                            <BotMessage player_name={value.name} message={value.message} timestamp={value?.timestamp} image_base64={value.image_base64} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </>
    )
}

export default ChatHistory