import { GoogleGenerativeAI } from "@google/generative-ai";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function FilterByAI(job) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `Analyze if this job is related to any kind of application development (web, mobile, desktop,Shopify, Wordpress etc), AI model development, Data analytics, UI/UX, Graphics design, Package Design.
    If it is related to given topics, return "true". If not, return "false".
    Job title: ${job.title}
    Required skills: ${job.skills.join(', ')}`;

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response.text();
            return response.toLowerCase().includes('true');
        } catch (error) {
            if (error?.status === 429) {
                await delay(2000 * Math.pow(2, attempt));
                continue;
            }
            throw error;
        }
    }
}