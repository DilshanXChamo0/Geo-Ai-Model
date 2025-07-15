import { IoMdHelp } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUserHeart } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";

export default function DropDown({ showDropdown, setShowDropdown }) {

     return (

          showDropdown && (
               <div className="hover-dropdown" >
                    <div className="list inter-regular">

                         <div className='user-info'>
                              <div>
                                   <span>Hello,  </span>
                                   <span>{JSON.parse(localStorage.getItem('user')).username}</span>
                              </div>
                              <span style={{ fontSize: 12, paddingTop: 5 }}>{JSON.parse(localStorage.getItem('user')).email}</span>
                         </div>

                         <p><TbUserHeart className='text-white text-md relative' /> Profile</p>
                         <p><IoSettingsOutline className='text-white text-md relative' /> Settings</p>
                         <p><VscFeedback className='text-white text-md relative' /> Feedback</p>
                         <p><IoMdHelp className='text-white text-md relative' /> Help</p>

                         <button className="inter-regular" onClick={() => { localStorage.removeItem('user'); setShowDropdown(false); window.location.reload(); }}>Logout</button>
                    </div>
               </div >
          )
     )
}
