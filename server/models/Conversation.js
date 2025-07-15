const mongoose = require('mongoose');

const conversation = new mongoose.Schema({
     conversationId: { type: String, required: true },
     userId: { type: String },
     chatId: { type: String, required: true },
     prompt: { type: String, required: true },
     images: [String],
     imagesNeeded: { type: Number, default: 1 },
     resolution: { type: String, default: '1024x1024' },
     imageEngine: { type: String, default: 'Flux-1' },
     createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', conversation);