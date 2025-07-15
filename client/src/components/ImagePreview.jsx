import { FiDownload } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'

export default function ImagePreview({ imgIsOpen = false, selectedImage, handleImageOpen, handleDownload }) {
     return (
          <div className="image-preview" style={{ display: imgIsOpen ? 'block' : 'none' }}>
               <div className='image-modal'>
                    <img src={selectedImage} alt="Preview" className='preview-image' />
                    <IoClose onClick={handleImageOpen} className='close-icon' />
                    <FiDownload className='download-icon-preview' onClick={() => handleDownload(selectedImage)} />
               </div>
          </div>
     )
}
