import { useEffect, useState } from 'react'
import icon from '../assets/Geo-Logo.svg';
import { FiPlus } from 'react-icons/fi';
import axios from 'axios';

export default function History({ fetchConversation }) {

     const [prompts, setPrompts] = useState([]);
     const [isSelected, setIsSelected] = useState('');

     useEffect(() => {

          async function fetchPrompts() {
               await axios.get(`http://13.51.168.1:5000/api/v1/get-prompts/${JSON.parse(localStorage.getItem('user')).id}`)
                    .then(response => setPrompts(response.data.prompts))
                    .catch(error => console.warn(error))
          }

          setTimeout(() => {
               if (localStorage.getItem('user')) {
                    fetchPrompts();
               }
          }, 500);

          setIsSelected(new URLSearchParams(window.location.search).get('cid') || '');

     }, []);

     function shortenPrompt(prompt) {
          if (prompt.length > 30) {
               return prompt.substring(0, 36) + '...';
          }
          return prompt;
     }

     function handleChatClick(conversationId) {

          const params = new URLSearchParams(window.location.search);
          params.set('cid', conversationId);
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newUrl);

          fetchConversation(conversationId);

     }


     return (
          <div className='history-container'>
               <img src={icon} alt="Logo" className='logo' />
               <div className="border-his" />

               <span className='inter-regular'>Chats</span>
               <div className="history-list inter-regular">
                    <ul>
                         {prompts.map((prompt, index) => (
                              <li key={index} className={isSelected === prompt.conversationId ? 'selected' : ''} onClick={() => {
                                   handleChatClick(prompt.conversationId);
                                   setIsSelected(prompt.conversationId);
                              }}>
                                   {shortenPrompt(prompt.prompt)}
                              </li>
                         ))}

                         {!localStorage.getItem('user') && <p className='inter-regular' style={{ paddingLeft: '10px' }}>Please log in to see your chat history.</p>}
                    </ul>
               </div>

               <button className='new-chat-btn inter-regular'>
                    <FiPlus className='text-white text-xl relative' onClick={() => {
                         const params = new URLSearchParams(window.location.search);
                         params.delete('cid');
                         const newUrl = `${window.location.pathname}?${params.toString()}`;
                         window.history.replaceState({}, '', newUrl);
                         window.location.reload();

                    }} />
               </button>

          </div>
     )
}
