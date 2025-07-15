import { useEffect, useState } from 'react';
import axios from 'axios';

import './style.css';
import { Message } from '../components/Message.jsx';
import ModelGeneratedOutPut from '../components/ModelGeneratedOutPut';
import AuthModel from '../models/auth/AuthModel.jsx';
import Skeleton from '../components/Skeleton';
import PromptBox from '../components/PromptBox';
import ImagePreview from '../components/ImagePreview';
import { FaRegUser } from 'react-icons/fa6';
import History from '../components/History.jsx';
import AnimatedBackground from '../AnimatedBackground.js';
import DropDown from '../components/DropDown.jsx';

const { v4: uuidv4 } = require('uuid');

function Main() {

    const [prompt, setPrompt] = useState('');
    const [numberOfImages, setNumberOfImages] = useState(1);
    const [resolution, setResolution] = useState('1024x1024');
    const [imageEngine, setImageEngine] = useState('Flux-1');
    const [imgIsOpen, setImgIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [messages, setMessages] = useState([]);
    const [isStarting, setIsStarting] = useState(false);
    const [authModelIsOpen, setAuthModelIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDownload = (src) => {
        const link = document.createElement('a');
        link.href = src;

        const timestamp = new Date().getTime();
        link.download = `image_${timestamp}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function fetchConversation(id) {

        axios.get(`http://localhost:5000/api/v1/get-conversation/${id}`)
            .then(res => {

                if (res.data.conversations) {
                    const conversations = res.data.conversations;
                    const allMessages = [];

                    conversations.forEach(convo => {
                        allMessages.push({
                            type: 'user',
                            text: convo.prompt,
                            time: new Date(convo.createdAt),
                        });

                        if (convo.images?.length) {

                            allMessages.push({
                                type: 'loading',
                                count: convo.images.length,
                                time: new Date(convo.createdAt),
                            });

                            setTimeout(() => {
                                setMessages(prev => {
                                    const updated = [...prev];
                                    updated.pop();
                                    return [
                                        ...updated,
                                        {
                                            type: 'bot',
                                            images: convo.images,
                                            time: new Date(convo.createdAt),
                                        }
                                    ];
                                });
                            }, 400);

                        }
                    });

                    setMessages(allMessages);
                }
            });
    }

    useEffect(() => {

        const queryParams = new URLSearchParams(window.location.search);
        const conversationId = queryParams.get('cid');

        if (!conversationId) return;

        fetchConversation(conversationId);

    }, []);

    const handleImageOpen = (src) => {

        setImgIsOpen(!imgIsOpen);
        setSelectedImage(src);
    };

    const handleSend = async (e) => {

        if (!localStorage.getItem('user')) {
            setAuthModelIsOpen(true);
            return;
        }

        if (!prompt) return;

        const params = new URLSearchParams(window.location.search);
        let id = params.get('cid');

        if (!id) {
            id = uuidv4();
            params.set('cid', id);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        }

        const userMessage = { type: 'user', text: prompt, time: new Date() };
        const loadingMessage = { type: 'loading', count: numberOfImages, time: new Date() };

        const chatId = uuidv4().split('-')[0];

        await axios.post('http://localhost:5000/api/v1/save-conversation', {
            conversationId: id,
            chatId,
            userId: JSON.parse(localStorage.getItem('user')).id,
            userMessage: userMessage.text,
            imagesNeeded: numberOfImages,
            resolution,
            imageEngine,
        }).catch(error => console.warn(error));

        setIsStarting(true);

        setMessages(prev => [...prev, userMessage, loadingMessage]);

        const textarea = document.querySelector('.text-field');
        if (textarea) {
            textarea.style.height = 'auto';
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/generate-image', {
                prompt,
                count: numberOfImages,
                resolution,
            });

            if (response.data.success) {
                const images = response.data.images || [];
                setIsStarting(false);
                setPrompt('');

                await axios.post('http://localhost:5000/api/v1/save-conversation-image', {
                    conversationId: id,
                    chatId,
                    images: images,
                }).catch(error => console.warn(error));

                setMessages(prev => {
                    const updated = [...prev];
                    updated.pop();
                    return [...updated, { type: 'bot', images }];
                });
            }
        } catch (error) {
            console.error('Error generating image:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated.pop();
                return updated;
            });
        }
    };


    return (
        <div className='main' >

            <AnimatedBackground />

            <History fetchConversation={fetchConversation} />


            {localStorage.getItem('user') ? <button className='user-btn group' onClick={() => setShowDropdown(!showDropdown)}>

                <FaRegUser className='text-white text-xl relative' />

                <DropDown setShowDropdown={setShowDropdown} showDropdown={showDropdown} />

            </button> : <button className='donate-btn inter-regular' onClick={() => setAuthModelIsOpen(true)}>Register</button>}

            {authModelIsOpen && <AuthModel setAuthModelIsOpen={setAuthModelIsOpen} />}

            {messages.length > 0 && (

                <div className='chat-section' onClick={() => { setShowDropdown(false) }}>

                    {messages.map((message, index) => (

                        <div key={index} className='role'>

                            {message.type === 'user' && <Message message={message} />}

                            {message.type === 'bot' && message.images && <ModelGeneratedOutPut
                                message={message} handleImageOpen={handleImageOpen} handleDownload={handleDownload} />}

                            {message.type === 'loading' && <Skeleton message={message} />}

                        </div>

                    ))}

                </div>
            )}


            <div>
                {messages.length === 0 && (
                    <div className='header'>
                        <h2 className='inter-bold model-text'>Hey , I’m Geo Ai</h2>
                        <h1 className='inter-semibold text'>Ready to bring your imagination to life?</h1>
                    </div>
                )}

                <ImagePreview handleDownload={handleDownload} handleImageOpen={handleImageOpen}
                    imgIsOpen={imgIsOpen} selectedImage={selectedImage} />

                <PromptBox setPrompt={setPrompt} handleSend={handleSend} imageEngine={imageEngine} isStarting={isStarting}
                    numberOfImages={numberOfImages} prompt={prompt} resolution={resolution} setImageEngine={setImageEngine} setNumberOfImages={setNumberOfImages} setResolution={setResolution} />
            </div>
        </div>

    );
}

export default Main;