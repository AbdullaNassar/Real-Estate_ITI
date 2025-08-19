import fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

async function processDocument(file) {
    try {
        const buffer = fs.readFileSync(file.path);
        let text = '';

        if (file.mimetype === 'application/pdf') {
            try {
                const data = await pdfParse(buffer);
                text = data.text;
            } catch (error) {
                console.error('Error parsing PDF:', error);
                throw new Error('Failed to parse PDF file');
            }
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({buffer});
            text = result.value;
        }

        // Clean up the temporary file
        fs.unlinkSync(file.path);
        
        return text.trim();
    } catch (error) {
        console.error('Error processing document:', error);
        throw error;
    }
}

export default processDocument;