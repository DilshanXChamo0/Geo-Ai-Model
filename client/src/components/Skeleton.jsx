export default function Skeleton({ message }) {
     return (
          <>
               <span className='inter-regular bot-name'>Geo Ai</span>
               <div className='parent'>
                    {Array.from({ length: message.count }).map((_, i) => (
                         <div key={i} className='image-skeleton' />
                    ))}
               </div>
          </>
     )
}
