const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Validator = require('./validation/Validator');
const Conversation = require('./models/Conversation');
const path = require('path')
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Change for Your MongoDB Connetion String
mongoose.connect(process.env.MONGODB)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.error('MongoDB Connection Failed:', err.message));


app.post('/api/v1/generate-image', async (req, res) => {

    try {
        const { prompt, count, resolution } = req.body;

        if (!prompt || !count || !resolution) {
            return res.status(400).json({
                error: 'Missing required parameters',
                details: { required: ['prompt', 'count', 'resolution'] }
            });
        }

        const [width, height] = resolution.split('x').map(Number);
        if (isNaN(width) || isNaN(height)) {
            return res.status(400).json({
                error: 'Invalid resolution format',
                example: '512x512 or 1024x1024'
            });
        }

        const generatedImages = [];
        const errors = [];

        for (let i = 0; i < count; i++) {
            try {

                // Update API Key
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.API_KEY
                    },
                    body: JSON.stringify({
                        response_image_type: 'png',
                        prompt: prompt,
                        seed: Math.floor(Math.random() * 1000),
                        steps: 23,
                        width: width,
                        height: height,
                        image_num: 1
                    })
                };

                const response = await fetch('https://api.novita.ai/v3beta/flux-1-schnell', options);
                const data = await response.json();

                if (response.ok && data.images?.[0]?.image_url) {
                    generatedImages.push(data.images[0].image_url);
                } else {
                    errors.push({
                        attempt: i + 1,
                        error: data.message || 'Unknown API error',
                        status: response.status
                    });
                }
            } catch (err) {
                errors.push({
                    attempt: i + 1,
                    error: err.message,
                    status: 500
                });
            }
        }

        if (generatedImages.length === 0) {
            throw new Error('All image generation attempts failed');
        }

        res.json({
            success: true,
            images: generatedImages,
            partialErrors: errors.length > 0 ? errors : undefined,
            generatedCount: generatedImages.length,
            failedCount: errors.length
        });

    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.post('/api/v1/user/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.json({ error: 'User details are required.' });

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.json({ error: 'User already exists with this email or username.' });

        const validationErrors = Validator.validateUserRegistration(req.body);
        if (validationErrors.length > 0) return res.json({ error: validationErrors });

        let id = uuidv4();

        const user = new User({
            userId: id,
            username,
            email,
            password
        });

        await user.save();
        res.status(200).json({
            message: 'Your account is created',
            user: { id: id, username: user.username, email: user.email }
        });

    } catch (err) {
        console.warn(err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/v1/user/authenticate', async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) return res.json({ error: 'Email & Password is required' });

    try {

        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.json({ error: 'Invalid email or password' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.json({ error: 'Invalid email or password' });

        res.status(200).json({
            message: 'User is Authenticated',
            user: { id: user.userId, username: user.username, email: user.email }
        });

    } catch (Exception) {
        console.warn(Exception);
    }
});

app.post('/api/v1/save-conversation', (req, res) => {

    const { conversationId, userMessage, imagesNeeded, resolution, imageEngine, chatId, userId } = req.body;

    if (!conversationId || !userMessage || !imagesNeeded || !resolution || !imageEngine || !chatId) return res.status(400).json({ error: 'All fields are required' });

    const newConversation = new Conversation({
        conversationId: conversationId,
        userId: userId,
        chatId: chatId,
        prompt: userMessage,
        imagesNeeded: imagesNeeded,
        resolution: resolution,
        imageEngine: imageEngine
    });

    newConversation.save()
        .then(() => res.status(200).json({ message: 'Conversation saved successfully' }))
        .catch(error => {
            console.error('Error saving conversation:', error);
            res.status(500).json({ error: 'Failed to save conversation' });
        });
});

app.post('/api/v1/save-conversation-image', (req, res) => {

    const { conversationId, chatId, images } = req.body;

    if (!conversationId || !chatId || !images) return res.status(400).json({ error: 'All fields are required' });

    Conversation.findOneAndUpdate({ conversationId: conversationId, chatId: chatId }, { $set: { images: images } }, { new: true })
        .then(updatedConversation => {
            if (!updatedConversation) return res.status(404).json({ error: 'Conversation not found' });
            res.status(200).json({ message: 'Conversation updated successfully', conversation: updatedConversation });
        })
        .catch(error => {
            console.error('Error updating conversation:', error);
            res.status(500).json({ error: 'Failed to update conversation' });
        });
});

app.get('/api/v1/get-conversation/:conversationId', (req, res) => {

    const { conversationId } = req.params;
    if (!conversationId) return res.status(400).json({ error: 'Conversation ID is required' });

    Conversation.find({ conversationId: conversationId })
        .then(conversations => {
            if (!conversations || conversations.length === 0)
                return res.json({ error: 'Conversation not found', status: undefined });

            res.status(200).json({ conversations });
        });
});

app.get('/api/v1/get-prompts/:userId', (req, res) => {

    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    Conversation.aggregate([
        { $match: { userId: userId } },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: "$conversationId",
                prompt: { $first: "$prompt" },
                createdAt: { $first: "$createdAt" },
                conversationId: { $first: "$conversationId" }
            }
        },
        { $sort: { createdAt: -1 } }
    ])
        .then(conversations => {
            if (!conversations || conversations.length === 0)
                return res.json({ error: 'No conversations found for this user', status: undefined });

            res.status(200).json({
                prompts: conversations.map(conv => ({
                    prompt: conv.prompt,
                    createdAt: conv.createdAt,
                    conversationId: conv.conversationId
                }))
            });
        })
        .catch(error => {
            console.error('Error fetching prompts:', error);
            res.status(500).json({ error: 'Failed to fetch prompts' });
        });

});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
