import mongoose from "mongoose";

const vectorSchema = new mongoose.Schema({
    embedding: {
        type: [Number],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const vectorDBModel = mongoose.model('VectorDB', vectorSchema);

export default vectorDBModel;