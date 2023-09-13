import React, { useEffect } from 'react'


const ChatHistory = ( { chat_messages, player_data, npc_data, player_image, npc_image, scrollRef, isAiResponding } ) => {

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
            // <div className="chat chat-start">

            //     <div className="chat-image avatar">
            //         <div className="w-10 rounded-full">
            //             <img srcSet={`data:image/jpeg;base64,${player_image}`} loading="lazy "/>
            //         </div>
            //     </div>

            //     <div className="flex gap-2 chat-header font-Comfortaa">
            //         <h1>{formatTimestamp(timestamp)}</h1>
            //         <h1>{player_name}</h1>
            //     </div>

            //     <div className="chat-bubble bg-website-secondary text-white font-Comfortaa">{message}</div>

            // </div>

            <div className="flex items-end justify-end text-white font-Comfortaa">

                <div>

                    <div className="chat-header gap-2 flex items-center ml-auto">
                        <h1 className=' ml-auto'>{player_name}</h1>
                        <time className="text-xs opacity-50 mr-2">{formatTimestamp(timestamp)}</time>
                    </div>

                    <div className="p-3 pl-4 rounded-2xl bg-website-secondary text-white font-Comfortaa ml-auto mr-2">{message}</div>
                </div>

                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img srcSet={`data:image/jpeg;base64,${player_image}`} loading="lazy "/>
                    </div>
                </div>

            </div>
        )
    }

    const BotMessage = ({ player_name, message, timestamp }) => {
        return (
            // <div className="chat chat-end"> 

            //     <div className="chat-image avatar">
            //         <div className="w-10 rounded-full">
            //             <img srcSet={`data:image/jpeg;base64,${npc_image}`} loading="lazy" />
            //         </div>
            //     </div>

            //     <div className="flex gap-2 chat-header font-Comfortaa">
            //         <h1>{formatTimestamp(timestamp)}</h1>
            //         <h1>{player_name}</h1>
            //     </div>

            //     <div className="chat-bubble bg-website-secondary text-white font-Comfortaa">{message}</div>
            // </div>

            <div className="flex items-start justify-start text-white font-Comfortaa">
                
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img srcSet={`data:image/jpeg;base64,${npc_image}`} loading="lazy "/>
                    </div>
                </div>


                <div>
                <div className="chat-header gap-2 flex items-center ml-auto">
                        <h1 className='ml-2'>{player_name}</h1>
                        <time className="text-xs opacity-50 mr-auto">{formatTimestamp(timestamp)}</time>
                    </div>
                    <div className="chat-bubble bg-website-secondary text-white font-Comfortaa mr-auto ml-2">{message}</div>
                </div>

            </div>
        )
    }


    return (
        <> 
            <div ref={scrollRef} className=' w-full flex flex-col max-h-[90%] rounded-md max-w-[98%] md:max-h-[600px] overflow-y-scroll scrollbar-thin scrollbar-track-website-primary scrollbar-thumb-purple-800 gap-2'>
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

                {isAiResponding &&
                // <div className="chat chat-end"> 

                //         <div className="chat-image avatar">
                //             <div className="w-10 rounded-full">
                //                 <img srcSet={`data:image/jpeg;base64,${npc_image}`} loading="lazy" />
                //             </div>
                //         </div>
        
                //         <div className="flex gap-2 chat-header font-Comfortaa">
                //             <h1>{npc_data["name"]}</h1>
                //         </div>
    
                //     <div className="chat-bubble bg-website-secondary text-white font-Comfortaa"><span className="loading loading-dots loading-md"></span></div>
                // </div>
                <div className="flex items-start justify-start text-white font-Comfortaa">
                
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img srcSet={`data:image/jpeg;base64,${npc_image}`} loading="lazy "/>
                    </div>
                </div>


                <div>
                <div className="chat-header gap-2 flex items-center ml-auto">
                        <h1 className='ml-2'>{npc_data["name"]}</h1>
                    </div>
                    <div className="chat-bubble bg-website-secondary text-white font-Comfortaa"><span className="loading loading-dots loading-md"></span></div>
                </div>

            </div>
            
                
                }
            </div>
        </>
    )
}

export default ChatHistory