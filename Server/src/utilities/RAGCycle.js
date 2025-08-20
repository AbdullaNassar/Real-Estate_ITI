import vectorDBModel from '../models/vectorDBModel.js';
import axios from 'axios';
// =================================Embedding==============================
const EMBED_URL = "https://api.openai.com/v1/embeddings";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
};

async function getEmbedding(text) {
    try {
        const response = await axios.post(
            EMBED_URL,
            {
                input: text,
                model: "text-embedding-ada-002"
            },
            { headers }
        );        

        return response.data.data[0].embedding;
    } catch (err) {
        console.error("Embedding Error:", err.response?.data || err.message);
        throw err;
    }
}

//===================================VectorDB========================================

// Cosine similarity function stays the same
function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

// Save to MongoDB
async function addDocument(embedding, content) {
    const doc = new vectorDBModel({ embedding, content });
    await doc.save();
}

// Search all documents in MongoDB
async function search(queryEmbedding, topK = 3) {
    const allDocs = await vectorDBModel.find();

    const scored = allDocs.map(doc => ({
        content: doc.content,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    console.log("Docs with scores:", scored); // 👈 Log here
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

//===============================RAG=======================================

// Add multiple documents to the vector store
export async function addDocs(docs) {
    for (const doc of docs) {
        const embedding = await getEmbedding(doc);
        addDocument(embedding, doc);
    }
}

// Ask a question and get an answer using retrieved context
export async function askQuestion(question) {
    const queryEmbedding = await getEmbedding(question);
    const topDocs = await search(queryEmbedding);

    const context = topDocs.map(d => d.content).join("\n---\n");

    const prompt = `You are a helpful assistant. Use the context below to answer the question.\n\nContext:\n${context}\n\nQuestion: ${question}`;

    const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
            model: "gpt-4o-mini",
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        },
        { headers }
    );

    let text = response.data.choices[0].text.trim();

    text = text.replace(/\\(.?)\\*/g, "\n$1\n");

    text = text.split("\n").map(line => line.trim()).join("\n");

    return text;
}
