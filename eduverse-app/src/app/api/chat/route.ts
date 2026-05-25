import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key Missing: Please add GEMINI_API_KEY to your environment variables to enable EduBot.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the request body
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use the latest Gemini Flash model for fast chat responses
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      systemInstruction: "You are EduBot, a helpful, friendly, and expert AI assistant for the EduVerse platform. EduVerse is an immersive learning platform connecting students with world-class education, mentorship, and career resources. Keep your answers concise, professional, and encouraging. Use emojis occasionally."
    });

    // Convert the frontend history format to the format expected by Gemini
    const formattedHistory = history ? history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Start a chat session with the history
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the new message
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
