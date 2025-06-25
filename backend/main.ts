import { DockerfileResponseSchema } from "./schema.ts";
// main.ts
import { InputSchema } from "./schema.ts";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

// Gemini client
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: Deno.env.get("LLM_MODEL_KEY")!,
});

const SALT = Deno.env.get("API_SALT_KEY")!;

// HTTP handler
async function handler(req: Request): Promise<Response> {
  const clientSalt = req.headers.get("x-salt-key");

  if (clientSalt !== SALT) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { pathname } = new URL(req.url);
  if (req.method !== "POST" && pathname === "/docker-generate") {
    return new Response("Only POST allowed", { status: 405 });
  }

  let userInput;
  try {
    userInput = await req.json();
  } catch {
    return new Response("Invalid Payload", { status: 400 });
  }

  const parsed = InputSchema.safeParse(userInput);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Compose chat messages
  const promptPayload = JSON.stringify(parsed.data, null, 2);

  const messages = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }, { text: promptPayload }],
    },
  ];

  // Call Gemini
  const response = await genAI.models.generateContent({
    model: Deno.env.get("LLM_MODEL_NAME")!,
    contents: messages,
  });

  const candidate = response?.candidates?.[0];
  const part = candidate?.content?.parts?.[0];
  const text = part?.text ?? "No results found";

  const cleanText = text
    .trim()
    .replace(/^```json\n/, "")
    .replace(/```$/, "");

  const outputResponse = DockerfileResponseSchema.safeParse(
    JSON.parse(cleanText)
  );

  if (!outputResponse.success) {
    return new Response(
      JSON.stringify({ error: outputResponse.error.flatten() }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ result: outputResponse.data }), {
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(handler); // default :8000
