import React, { useEffect } from 'react';

function AnimatedBackground() {
     useEffect(() => {
          const script = document.createElement('script');
          script.src = '/finisher-header.es5.min.js';
          script.type = 'text/javascript';
          script.onload = () => {
               new window.FinisherHeader({
                    count: 20,
                    size: {
                         min: 5,
                         max: 100,
                         pulse: 0.1
                    },
                    speed: {
                         x: { min: 0, max: 0.2 },
                         y: { min: 0, max: 0.4 }
                    },
                    colors: {
                         background: '#22222',
                         particles: ['#8955f8']
                    },
                    blending: 'overlay',
                    opacity: {
                         center: 0,
                         edge: 0.7
                    },
                    skew: 0,
                    shapes: ['c']
               });
          };
          document.body.appendChild(script);
     }, []);

     return (
          <div
               className="finisher-header"
               style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1, // send background behind your app
               }}
          ></div>
     );
}

export default AnimatedBackground;