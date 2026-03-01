export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003",
  },
};
