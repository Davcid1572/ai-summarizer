import groq from "@/lib/groq";
import { extractTextFromPDF, bufferFromBase64 } from "@/utils/pdfParser";
import { SummaryRequest, SummaryResponse } from "@/types/summary";

// This is the prompt engineering core of the whole app. Instead of one fixed prompt, we have three different prompts — one per mode.
// Each prompt is carefully worded to force a specific output shape:

function getPrompt(text: string, mode: string): string {
  const prompts: Record<string, string> = {
    brief: `Summarize the following document in 2-3 sentences only. 
            Capture the absolute core message. Be concise and clear.
            
            Document:
            ${text}
            
            Brief Summary:`,

    detailed: `Write a detailed summary of the following document. 
               Cover all the main points, key arguments, and important details. 
               Use clear paragraphs. Do not use bullet points.
               
               Document:
               ${text}
               
               Detailed Summary:`,

    bullets: `Summarize the following document as a clean bullet point list.
              Each bullet should be one clear, concise point.
              Start each bullet with "•".
              Aim for 5-10 bullets depending on document length.
              
              Document:
              ${text}
              
              Bullet Point Summary:`,
  };

  return prompts[mode] || prompts.brief;

  //   prompts[mode] || prompts.brief — if somehow an invalid mode slips through, we fall back to brief. Defensive programming.
}

// The countWords Function

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(request: Request) {
  // Reading the Request

  try {
    const body = await request.json();
    const { type, mode } = body;

    if (!type || !mode) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let textToSummarize = "";

    //  Handling Text Input

    if (type === "text") {
      const { text } = body as SummaryRequest;
      if (!text || text.trim().length === 0) {
        return Response.json({ error: "No text provided" }, { status: 400 });
      }
      textToSummarize = text;
    } else if (type === "pdf") {
      // Handling PDF Input

      const { base64 } = body;
      if (!base64) {
        return Response.json(
          { error: "No PDF data provided" },
          { status: 400 },
        );
      }
      const buffer = bufferFromBase64(base64);
      textToSummarize = await extractTextFromPDF(buffer);
    } else {
      return Response.json(
        { error: "Invalid type. Must be text or pdf" },
        { status: 400 },
      );
    }

    // 50,000 characters is roughly 8,000-10,000 words. Beyond that we risk hitting Groq's token limit and getting a cryptic error. We catch it early and give a clear message instead.
    // This is called input sanitization
    if (textToSummarize.length > 50000) {
      return Response.json(
        { error: "Document is too long. Please use a shorter document." },
        { status: 400 },
      );
    }

    // Calling Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      stream: false,
      messages: [
        {
          role: "user",
          content: getPrompt(textToSummarize, mode),
        },
      ],
    });

    //  Returning the Response

    const summary = completion.choices[0]?.message?.content || "";

    const response: SummaryResponse = {
      summary,
    };

    return Response.json(response);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    console.error("Summarize API error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
