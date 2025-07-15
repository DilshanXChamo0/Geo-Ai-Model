export default function Alert({ message, isShow = false }) {
     return (
          isShow && (
               <div className='alert-container inter-regular'>
                    <span>{message}</span>
               </div>
          )
     )
}
