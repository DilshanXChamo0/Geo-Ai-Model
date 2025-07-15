import Alert from '../../components/Alert'
import { useState } from 'react'
import axios from 'axios';
import Authenticate from './Authenticate';
import Register from './Register';

export default function AuthModel({ setAuthModelIsOpen }) {

     const [username, setUsername] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [response, setResponse] = useState('');
     const [show, setShow] = useState(false);
     const [authOption, setAuthOption] = useState('register');

     async function handleSubmit() {
          await axios.post('http://localhost:5000/api/v1/user/authenticate', {
               email,
               password
          })
               .then(response => {
                    if (response.data.error) {
                         setResponse(response.data.error);
                         setShow(true);
                    } else {
                         setResponse(response.data.message);
                         localStorage.setItem('user', JSON.stringify(response.data.user));
                         setAuthModelIsOpen(false);
                    }

               })
               .catch(error => console.warn(error));
     }

     async function register() {

          await axios.post('http://localhost:5000/api/v1/user/register', {
               username,
               email,
               password
          })
               .then(response => {

                    console.log(response.data)

                    if (response.data.error) {
                         setResponse(response.data.error);
                         setShow(true);
                    } else {
                         setResponse(response.data.message);
                         localStorage.setItem('user', JSON.stringify(response.data.user));
                         setAuthModelIsOpen(false);
                    }

               })
               .catch(error => console.warn(error));
     }

     return (
          <div className='auth-model'>
               <Alert message={response} isShow={show} />
               {
                    authOption === 'login' ?
                         <Authenticate
                              handleSubmit={handleSubmit}
                              setAuthModelIsOpen={setAuthModelIsOpen}
                              setEmail={setEmail}
                              setPassword={setPassword}
                              setAuthOption={setAuthOption}
                         /> : <Register
                              register={register}
                              setAuthModelIsOpen={setAuthModelIsOpen}
                              setEmail={setEmail}
                              setPassword={setPassword}
                              setUsername={setUsername}
                              setAuthOption={setAuthOption}
                         />

               }
          </div>
     )
}
