import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,

  //   process.env.GROQ_API_KEY is how Next.js reads your .env.local file on the server. It looks up the variable named GROQ_API_KEY and injects it here at runtime.
  // Critical point: process.env only works on the server side — in API routes, Server Components, and server actions. It is never exposed to the browser. This is exactly why our API key stays safe.
});

export default groq;

// This pulls in the official Groq SDK we installed earlier with npm install groq-sdk. It gives us a clean JavaScript class to talk to Groq's API without manually writing fetch calls.
