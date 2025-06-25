import { DockerfileResponseSchema } from "./schema.ts";
// main.ts
import { InputSchema } from "./schema.ts";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt.ts";

// Gemini client
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: Deno.env.get("LLM_MODEL_KEY")!,
});

// HTTP handler
async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Only POST allowed", { status: 405 });
  }

  let userInput;
  try {
    userInput = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = InputSchema.safeParse(userInput);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Compose chat messages
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: JSON.stringify(parsed.data, null, 2) },
  ];

  // Call Gemini
  const response = await genAI.models.generateContent({
    model: Deno.env.get("LLM_MODEL_NAME")!,
    contents: messages,
  });
  const text = response.text ?? "No results found";

  const outputResponse = DockerfileResponseSchema.safeParse(text);

  if (!outputResponse.success) {
    return new Response(
      JSON.stringify({ error: outputResponse.error.flatten() }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ output: outputResponse.data }), {
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(handler); // default :8000
