// This is the code opens a pdf file and pulls out the raw text content. We can then feed this text into Groq to extract structured data from it.

// A Buffer is Node.js's way of holding raw binary data in memory

//Base64 is a way of converting binary data into a plain text string so it can travel safely through JSON

const pdf = require("pdf-parse");

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error(
        "No text found in PDF. The file may be scanned or image-based.",
      );
    }

    return data.text.trim();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse PDF";
    throw new Error(message);
  }
}

export function bufferFromBase64(base64: string): Buffer {
  return Buffer.from(base64, "base64");
}
