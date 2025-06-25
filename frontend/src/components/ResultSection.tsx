import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponseProps } from "@/pages/Index";

interface ResultSectionProps {
  results: ResponseProps;
  onDownload: () => void;
}

const ResultSection = ({ results, onDownload }: ResultSectionProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dockerfile");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: `${type} copied to clipboard`,
    });
  };

  const CodeBlock = ({
    content,
    filename,
  }: {
    content: string;
    filename: string;
  }) => (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-dark-muted font-mono">{filename}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(content, filename)}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
      <pre className="code-block text-green-400 whitespace-pre-wrap text-sm leading-relaxed">
        {content}
      </pre>
    </div>
  );

  return (
    <section className="py-16 animate-slide-in">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-dark-card border-dark-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-space text-white mb-2">
              🎉 Your Container is Ready!
            </CardTitle>
            <p className="text-dark-muted">
              Fresh Docker configs, hot off the press
            </p>
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-dark-bg border border-dark-border">
                <TabsTrigger
                  value="dockerfile"
                  className="data-[state=active]:bg-dark-accent data-[state=active]:text-black"
                >
                  Dockerfile
                </TabsTrigger>
                <TabsTrigger
                  value="compose"
                  className="data-[state=active]:bg-dark-accent data-[state=active]:text-black"
                >
                  docker-compose.yml
                </TabsTrigger>
                <TabsTrigger
                  value="dockerignore"
                  className="data-[state=active]:bg-dark-accent data-[state=active]:text-black"
                >
                  .dockerignore
                </TabsTrigger>
                <TabsTrigger
                  value="explain"
                  className="data-[state=active]:bg-dark-accent data-[state=active]:text-black"
                >
                  WTF did I just generate?
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="dockerfile" className="space-y-4">
                  <CodeBlock
                    content={results.dockerfile}
                    filename="Dockerfile"
                  />
                </TabsContent>

                <TabsContent value="compose" className="space-y-4">
                  <CodeBlock
                    content={results.dockerCompose}
                    filename="docker-compose.yml"
                  />
                </TabsContent>

                <TabsContent value="dockerignore" className="space-y-4">
                  <CodeBlock
                    content={results.dockerignore}
                    filename=".dockerignore"
                  />
                </TabsContent>

                <TabsContent value="explain" className="space-y-4">
                  <div className="bg-dark-bg/50 rounded-lg p-6">
                    <h3 className="text-lg font-space text-white mb-4">
                      🤓 What just happened?
                    </h3>
                    <div className="text-dark-muted space-y-3 leading-relaxed">
                      <p>{results.explanation}</p>
                      <div className="mt-4 p-4 bg-dark-card rounded border-l-4 border-dark-accent">
                        <p className="text-white font-medium">💡 Pro tip:</p>
                        <p>
                          Run{" "}
                          <code className="bg-dark-bg px-2 py-1 rounded text-dark-accent">
                            docker build -t my-app .
                          </code>{" "}
                          to build your image!
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="mt-8 text-center">
              <Button
                onClick={onDownload}
                className="btn-glow bg-dark-accent text-black font-semibold px-6 py-3 hover:bg-dark-accent/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download all as ZIP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResultSection;
