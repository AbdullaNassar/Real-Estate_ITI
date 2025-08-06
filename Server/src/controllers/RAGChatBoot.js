import { addDocs, askQuestion } from "../utilities/RAGCycle.js";

export const uploadDocument = async (req,res) => {
    const { documents } = req.body;
        if (!Array.isArray(documents)) {
            return res.status(400).json({ error: "documents must be an array" });
        }
    try {
        await addDocs(documents);
        res.status(200).json({ message: "Documents uploaded and indexed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to upload documents" });
    }
}

export const setQuery = async (req,res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question is required" });
    try {
        const answer = await askQuestion(question);
        res.json({ answer });
    } catch (error) {
        console.log(error);
        
        console.error("Query Error:", error.response?.data || error.message || error);
        res.status(500).json({ error: "Failed to process query" });
    }
}