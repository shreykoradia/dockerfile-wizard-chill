import { GoogleGenAI } from "@google/genai";
import { InputSchema, DockerfileResponseSchema } from "./schema.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

// Load environment variables
const SALT = Deno.env.get("API_SALT_KEY")!;
const FRONTEND_ORIGIN = Deno.env.get("FRONTEND_ORIGIN")!;
const ALLOWED_ORIGINS = FRONTEND_ORIGIN.split(",").map((o) => o.trim());
function getCorsOrigin(origin: string): string | undefined {
  return origin && ALLOWED_ORIGINS.includes(origin) ? origin : undefined;
}

const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: Deno.env.get("LLM_MODEL_KEY")!,
});

Deno.serve(async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);
  const origin =
    req.headers.get("origin") ??
    new URL(req.headers.get("referer") ?? "").origin;
  const allowedOrigin = getCorsOrigin(origin);

  // If origin is not allowed, reject early
  if (!allowedOrigin) {
    return new Response("CORS Origin Not Allowed", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-salt-key",
      },
    });
  }

  // Only allow POST /docker-generate
  if (req.method !== "POST" || pathname !== "/docker-generate") {
    return new Response("Not Found", { status: 404 });
  }

  const clientSalt = req.headers.get("x-salt-key");
  if (clientSalt !== SALT) {
    return new Response("Unauthorized", { status: 401 });
  }

  let userInput;
  try {
    userInput = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid Payload" }, 400, allowedOrigin);
  }

  const parsed = InputSchema.safeParse(userInput);
  if (!parsed.success) {
    return jsonResponse({ error: parsed.error.flatten() }, 400, allowedOrigin);
  }

  const promptPayload = JSON.stringify(parsed.data, null, 2);
  const messages = [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }, { text: promptPayload }],
    },
  ];

  const response = await genAI.models.generateContent({
    model: Deno.env.get("LLM_MODEL_NAME")!,
    contents: messages,
  });

  const text =
    response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No results found";
  const cleanText = text
    .trim()
    .replace(/^```json\n/, "")
    .replace(/```$/, "");

  const output = DockerfileResponseSchema.safeParse(JSON.parse(cleanText));
  if (!output.success) {
    return jsonResponse({ error: output.error.flatten() }, 400, allowedOrigin);
  }

  return jsonResponse({ result: output.data }, 200, allowedOrigin);
});

// deno-lint-ignore no-explicit-any
function jsonResponse(data: any, status = 200, originOverride: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": originOverride,
    },
  });
}
