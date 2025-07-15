import { FiDownload } from 'react-icons/fi'

export default function ModelGeneratedOutPut({ message, handleImageOpen, handleDownload }) {
     return (
          <div className='chat-bubble bot'>
               <span className='inter-regular bot-name'>Geo Ai</span>
               <div className='images-list'>
                    {message.images.map((src, i) => (
                         <div key={i} className='images-con' onClick={() => handleImageOpen(src)}>
                              <img src={src} className='generated-image' alt={`Generated ${i + 1}`} />
                              <FiDownload className='download-icon' onClick={() => handleDownload(src)} />
                         </div>
                    ))}
               </div>
          </div>
     )
}
