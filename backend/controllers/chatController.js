const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Kost, Logbook } = require('../models/kostModel');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Fetch Context (RAG)
        const kosts = await Kost.findAll();

        // Format kost data for the AI context
        const contextData = kosts.map(k => {
            return `
        - Name: ${k.name}
        - Price: Rp ${parseInt(k.price).toLocaleString('id-ID')}
        - Address: ${k.address}
        - Description: ${k.description}
        - Available: ${k.room_available ? 'Yes' : 'No'}
        - Owner Phone: ${k.owner_phone}
        - Last Update: ${k.last_room_update}
        `;
        }).join('\n');

        const systemPrompt = `
    You are a helpful AI assistant for a Boarding House (Kost) search application around Universitas Klabat (Unklab).
    Your name is "KostBot".
    
    STRICT DOMAIN RESTRICTION:
    - You MUST ONLY answer questions related to boarding houses (kost), facilities, prices, locations, room availability, and how to contact owners.
    - If the user asks about anything else (e.g., politics, coding, general knowledge, math, homework), you MUST politely refuse by saying: "Maaf, saya hanya dapat membantu pertanyaan seputar informasi kost di sekitar Universitas Klabat."
    
    CONTEXT DATA:
    Use the following list of available kosts to answer user questions accurately. Do not make up facts. If a kost is not in the list, say you don't have information about it.
    
    LIST OF KOSTS:
    ${contextData}
    
    USER QUESTION: "${message}"
    
    Answer politely and concisely in Indonesian or English depending on the user's language.
    `;

        // 2. Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        // 3. Log Activity
        await Logbook.log('USE_CHATBOT', `User: ${message} | AI: ${responseText.substring(0, 50)}...`);

        res.json({ response: responseText });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({
            message: 'Maaf, sistem sedang sibuk. Silakan coba lagi nanti.',
            error: error.message
        });
    }
};
