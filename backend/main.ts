import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { GoogleGenAI } from "@google/genai";
import { InputSchema, DockerfileResponseSchema } from "./schema.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

// Setup
const SALT = Deno.env.get("API_SALT_KEY")!;
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: Deno.env.get("LLM_MODEL_KEY")!,
});

const router = new Router();

router.post("/docker-generate", async (ctx: Context) => {
  const clientSalt = ctx.request.headers.get("x-salt-key");
  if (clientSalt !== SALT) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  let userInput;
  try {
    userInput = await ctx.request.body.json();
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid Payload" };
    return;
  }

  const parsed = InputSchema.safeParse(userInput);
  if (!parsed.success) {
    ctx.response.status = 400;
    ctx.response.body = { error: parsed.error.flatten() };
    return;
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
    ctx.response.status = 400;
    ctx.response.body = { error: output.error.flatten() };
    return;
  }

  ctx.response.body = { result: output.data };
});

// Setup Oak app
const app = new Application();
app.use(
  oakCors({
    origin: Deno.env.get("FRONTEND_ORIGIN")!,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-salt-key"],
    credentials: true,
  })
);

const port = Number(Deno.env.get("PORT") || 8000);
console.log(`🚀 Listening on http://localhost:${port}`);
await app.listen({ port });
