import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "mack-ai",
  name: "Mack-AI",
  isDev: true,
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});
