
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCVx9TLB_fYaNygBqfqYSWSGb_5N1KYoUw" });

export const generateTurfRecommendation = async (userInterest: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Based on the user's interest: "${userInterest}", suggest a high-energy sport and why they should book a turf for it today. Keep it short and motivating (max 3 sentences).`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return "Ready for a game? Book your favorite turf now and get moving!";
  }
};

export const generateBookingNote = async (turfName: string, sport: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Generate a fun, energetic booking confirmation note for a player who just booked "${turfName}" for a game of ${sport}. Use emojis.`,
    });
    return response.text;
  } catch (error) {
    return "Great choice! See you on the field soon! ⚽️🔥";
  }
};

export const generateSupportResponse = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are a helpful customer support agent for "SportsHub", a premium sports venue booking platform. 
      Users can book turfs for Football, Cricket, Badminton, etc. 
      Answer the user's question briefly and professionally.
      User Query: "${query}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Support Error:", error);
    return "I'm having trouble connecting to the support server right now. T_T Please try again later.";
  }
};
