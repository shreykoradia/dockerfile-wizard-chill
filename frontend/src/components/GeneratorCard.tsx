import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FileText, Zap } from "lucide-react";

interface GeneratorCardProps {
  onGenerate: (config: ConfigProps) => void;
  isLoading: boolean;
}

export interface ConfigProps {
  configText: string;
  stack: string;
  needsRedis: boolean;
  needsPostgres: boolean;
}

const GeneratorCard = ({ onGenerate, isLoading }: GeneratorCardProps) => {
  const [stack, setStack] = useState<string>("");
  const [configText, setConfigText] = useState<string>("");
  const [needsRedis, setNeedsRedis] = useState<boolean>(false);
  const [needsPostgres, setNeedsPostgres] = useState<boolean>(false);

  const handleGenerate = () => {
    if (!stack || !configText.trim()) return;

    onGenerate({
      stack,
      configText,
      needsRedis,
      needsPostgres,
    });
  };

  const showExample = () => {
    if (stack === "nodejs") {
      setConfigText(`{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5"
  }
}`);
    } else if (stack === "nextjs") {
      setConfigText(`{
  "name": "my-next-app",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}`);
    } else if (stack === "fastapi") {
      setConfigText(`fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-multipart==0.0.6`);
    }
  };

  return (
    <section id="generator" className="py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto bg-dark-card border-dark-border animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-space text-white mb-2">
              🛠 Build Your Container
            </CardTitle>
            <p className="text-dark-muted">
              Select your stack, paste your config, get magic ✨
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stack Selection */}
            <div className="space-y-2">
              <Label className="text-white font-medium">Stack</Label>
              <Select value={stack} onValueChange={setStack}>
                <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                  <SelectValue placeholder="Choose your poison..." />
                </SelectTrigger>
                <SelectContent className="bg-dark-card border-dark-border">
                  <SelectItem
                    value="nodejs"
                    className="text-white hover:bg-dark-bg"
                  >
                    ⚪ Node.js
                  </SelectItem>
                  <SelectItem
                    value="nextjs"
                    className="text-white hover:bg-dark-bg"
                  >
                    ⚡ Next.js
                  </SelectItem>
                  <SelectItem
                    value="fastapi"
                    className="text-white hover:bg-dark-bg"
                  >
                    🚀 FastAPI
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Config Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-white font-medium">
                  {stack === "fastapi" ? "requirements.txt" : "package.json"}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showExample}
                  className="text-xs"
                  disabled={!stack}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Show example
                </Button>
              </div>
              <Textarea
                value={configText}
                onChange={(e) => setConfigText(e.target.value)}
                placeholder={
                  stack === "fastapi"
                    ? "Paste your requirements.txt content here..."
                    : "Paste your package.json content here..."
                }
                className="bg-dark-bg border-dark-border text-white font-mono text-sm min-h-[200px] resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-bg/50">
                <Switch
                  checked={needsRedis}
                  onCheckedChange={setNeedsRedis}
                  className="data-[state=checked]:bg-dark-accent"
                />
                <Label className="text-white cursor-pointer">
                  Needs Redis? 🔴
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-dark-bg/50">
                <Switch
                  checked={needsPostgres}
                  onCheckedChange={setNeedsPostgres}
                  className="data-[state=checked]:bg-dark-accent"
                />
                <Label className="text-white cursor-pointer">
                  Wanna Postgres? 🐘
                </Label>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!stack || !configText.trim() || isLoading}
              className={`w-full btn-glow bg-dark-accent text-black font-semibold py-3 text-lg hover:bg-dark-accent/90 ${
                isLoading ? "animate-pulse" : ""
              } ${
                !stack || !configText.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "neon-glow"
              }`}
            >
              <Zap className="w-5 h-5 mr-2" />
              {isLoading
                ? "Generating magic..."
                : "Generate That Dockerfile 🪄"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GeneratorCard;
