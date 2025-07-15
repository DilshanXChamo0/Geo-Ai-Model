import { FaArrowUp, FaStop } from 'react-icons/fa6'

export default function PromptBox({ isStarting, prompt, numberOfImages, setPrompt, setNumberOfImages,
     resolution, setResolution, imageEngine, setImageEngine, handleSend }) {

     const handlePromptChange = (e) => {
          setPrompt(e.target.value);

          const textarea = e.target;
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
     };

     return (
          <>
               <div className='prompt-box'>
                    <textarea
                         rows={1}
                         value={prompt}
                         onChange={handlePromptChange}
                         placeholder='Prompt me with your vision...'
                         className='text-field inter-regular auto-expand'
                    />
                    <div className='settings'>
                         <div className='dropdown'>
                              {!isStarting && (
                                   <>
                                        <div className='choose'>
                                             <select name="numberOfImages" value={numberOfImages} onChange={(e) => { setNumberOfImages(e.target.value) }} className='inter-regular count'>
                                                  <option value="1">1 Image</option>
                                                  <option value="2">2 Images</option>
                                                  <option value="3">3 Images</option>
                                                  <option value="4">4 Images</option>
                                             </select>
                                        </div>
                                        <div className='choose'>
                                             <select name="resolution" value={resolution} onChange={(e) => { setResolution(e.target.value) }} className='inter-regular count'>
                                                  <option value="1024x1024">1024x1024</option>
                                                  <option value="2048x2048">2048x2048</option>
                                                  <option value="4096x4096">4096x4096</option>
                                             </select>
                                        </div>
                                        <div className='choose'>
                                             <select name="engine" value={imageEngine} onChange={(e) => { setImageEngine(e.target.value) }} className='inter-regular count'>
                                                  <option value="null">Image Engine</option>
                                                  <option value="Flux-1">Flux-1</option>
                                             </select>
                                        </div>
                                   </>
                              )}
                         </div>
                         <div className='btn-section'>
                              {isStarting ? (
                                   <button className='btn'>
                                        <FaStop className='icon' />
                                   </button>
                              ) : (
                                   <button className='btn' onClick={handleSend}>
                                        <FaArrowUp className='icon' />
                                   </button>
                              )}
                         </div>
                    </div>
               </div>



               <div className="mini-content">

                    <textarea
                         rows={1}
                         value={prompt}
                         onChange={handlePromptChange}
                         placeholder='Prompt me with your vision...'
                         className='text-field inter-regular auto-expand'
                    />
                    
                    {!isStarting && (
                         <div className='dropdown-two'>
                              <div>
                                   <div className='choose-two'>
                                        <select name="numberOfImages" value={numberOfImages} onChange={(e) => { setNumberOfImages(e.target.value) }} className='inter-regular count'>
                                             <option value="1">1 Image</option>
                                             <option value="2">2 Images</option>
                                             <option value="3">3 Images</option>
                                             <option value="4">4 Images</option>
                                        </select>
                                   </div>
                                   <div className='choose-two'>
                                        <select name="resolution" value={resolution} onChange={(e) => { setResolution(e.target.value) }} className='inter-regular count'>
                                             <option value="1024x1024">1024x1024</option>
                                             <option value="2048x2048">2048x2048</option>
                                             <option value="4096x4096">4096x4096</option>
                                        </select>
                                   </div>
                                   <div className='choose-two'>
                                        <select name="engine" value={imageEngine} onChange={(e) => { setImageEngine(e.target.value) }} className='inter-regular count'>
                                             <option value="Flux-1">Flux-1</option>
                                        </select>
                                   </div>
                              </div>
                              <div className='btn-section'>
                                   {isStarting ? (
                                        <button className='btn'>
                                             <FaStop className='icon' />
                                        </button>
                                   ) : (
                                        <button className='btn' onClick={handleSend}>
                                             <FaArrowUp className='icon' />
                                        </button>
                                   )}
                              </div>
                         </div>
                    )}
               </div>
          </>
     )
}
