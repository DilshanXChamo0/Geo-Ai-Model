import { useState } from "react"

export function Message({ message }) {

     const [isExpand, setIsExpand] = useState(false);

     const isLong = message.text && message.text.length > 150;
     const displayText = isLong && !isExpand
          ? message.text.slice(0, 150)
          : message.text;

     return (
          <>
               <span className='inter-regular user-name'>You</span>
               <div className='chat-bubble user'>
                    <p className="chat-message inter-regular">

                         {displayText}

                         {!isExpand && isLong && '...  '}

                         {isLong && (
                              <button
                                   onClick={() => setIsExpand(!isExpand)}
                                   style={{
                                        color: 'white',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        fontSize: '0.85rem',
                                        cursor: 'pointer'
                                   }}
                              >
                                   {isExpand ? ' Show less' : 'See more'}
                              </button>
                         )}

                    </p>

               </div>
          </>
     )
}