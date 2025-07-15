import React from 'react'
import { IoClose } from 'react-icons/io5'

export default function Authenticate({ setAuthModelIsOpen, setEmail, setPassword, handleSubmit, setAuthOption }) {
     return (
          <div className='second-container' style={{ height: '470px' }}>
               <IoClose className='close-btn-auth-model' onClick={() => setAuthModelIsOpen(false)} />
               <div className="content">
                    <span className='inter-semibold'>Welcome Back to Geo AI</span>
                    <p className='inter-thin'>Sign in to continue generating stunning visuals from your ideas.</p>

                    <div className="auth">
                         <input type="text" id="email" name="email" onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' className='inter-regular' required />

                         <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' className='inter-regular' required />

                         <button type="submit" className='submit-btn inter-regular' onClick={handleSubmit}>Authenticate</button>
                         <span className='inter-regular'>Don't have an account? <a href="#" className='inter-regular text-white' onClick={() => setAuthOption('Register')}>Create a new account</a></span>
                    </div>
               </div>
          </div>
     )
}
