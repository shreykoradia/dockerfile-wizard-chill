import { z } from "zod";

// ────────────────────────────────────────────
//  Zod schema for validating response payload
// ────────────────────────────────────────────
export const DockerfileResponseSchema = z.object({
  dockerfile: z.string(),
  compose: z.string(),
  ignore: z.string(),
  explain: z.string(),
});

// ────────────────────────────────────────────
//  Zod schema for validating incoming payload
// ────────────────────────────────────────────
export const InputSchema = z.object({
  stack: z.enum(["node", "next", "fastapi"]),
  dependencies: z.string().min(5),
  needsRedis: z.boolean().optional(),
  needsPostgres: z.boolean().optional(),
});
