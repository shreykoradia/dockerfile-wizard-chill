import { ConfigProps } from "@/components/GeneratorCard";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export const generateDockerFiles = (config: ConfigProps) => {
  const { stack, dependencies, needsRedis, needsPostgres } = config;

  // Simple mock generation - in real app, this would parse the config properly
  let dockerfile = "";
  let dockerCompose = "";
  let dockerignore = "";
  let explanation = "";

  if (stack === "node") {
    dockerfile = `# Node.js Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Run the application
CMD ["npm", "start"]`;

    explanation = `This Dockerfile creates a production-ready Node.js container using Alpine Linux for a smaller image size. It optimizes layer caching by copying package files first, then installing dependencies, and finally copying your source code. The health check ensures your app is running properly.`;
  } else if (stack === "next") {
    dockerfile = `# Next.js Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`;

    explanation = `This multi-stage Dockerfile optimizes your Next.js build for production. It separates dependency installation, building, and runtime into different stages to minimize the final image size. The standalone output is used for the most efficient deployment.`;
  } else if (stack === "fastapi") {
    dockerfile = `# FastAPI Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update \\
    && apt-get install -y --no-install-recommends \\
        build-essential \\
        curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`;

    explanation = `This FastAPI Dockerfile uses Python 3.11 slim image and follows security best practices by running as a non-root user. It installs dependencies first for better layer caching and includes a health check endpoint for container orchestration.`;
  }

  // Generate docker-compose.yml
  dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    ${needsRedis || needsPostgres ? "depends_on:" : ""}${
    needsRedis ? "\n      - redis" : ""
  }${needsPostgres ? "\n      - postgres" : ""}
    restart: unless-stopped
${
  needsRedis
    ? `
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
`
    : ""
}${
    needsPostgres
      ? `
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
`
      : ""
  }`;

  // Generate .dockerignore
  dockerignore = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.next
.nuxt
dist
.cache
coverage
.DS_Store
Thumbs.db
__pycache__
*.pyc
.pytest_cache
.coverage
.venv
venv/`;

  return {
    dockerfile,
    dockerCompose,
    dockerignore,
    explanation,
  };
};

export const downloadAsZip = async (files: {
  dockerfile: string;
  dockerCompose: string;
  dockerignore: string;
  explanation?: string;
}) => {
  const zip = new JSZip();

  zip.file("Dockerfile", files.dockerfile);
  if (files.dockerCompose?.trim()) {
    zip.file("docker-compose.yml", files.dockerCompose);
  }
  zip.file(".dockerignore", files.dockerignore);

  if (files.explanation) {
    zip.file("README.md", `# Explanation\n\n${files.explanation}`);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "docker-setup.zip");
};
