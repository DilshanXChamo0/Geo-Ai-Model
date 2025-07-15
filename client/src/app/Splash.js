import React, { useEffect } from 'react';
import icon from '../assets/Geo-Logo.svg';
import './style.css';
import AnimatedBackground from '../AnimatedBackground';

const splash = () => {

    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.href = '/c/';
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            gap: '10px',
            color: 'white'
        }}>

            <AnimatedBackground />

            <div className='splash-content'>
                <img src={icon} alt="logo" width={110} />

                <h1 className='inter-bold' style={{
                    paddingBottom: '10px',
                    paddingTop: '20px'
                }}>Geo Ai</h1>

                <p className='inter-thin'>Transform words into stunning, geo-inspired visuals powered by AI. Whether it's a mountain at sunrise or a futuristic cityscape by the sea, just type your vision — and let Geo AI bring it to life.</p>

            </div>

            <footer className="inter-regular"
                style={{
                    position: 'fixed',
                    bottom: '10px'
                }}
            >
                <p>© Developed by Dilshan | Freely Usable Model</p>
            </footer>
        </div>
    )

}

export default splash