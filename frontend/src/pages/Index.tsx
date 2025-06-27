import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GeneratorCard, { ConfigProps } from "@/components/GeneratorCard";
import ResultSection from "@/components/ResultSection";
import Footer from "@/components/Footer";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { downloadAsZip } from "@/utils/dockerGenerator";
import { useToast } from "@/hooks/use-toast";
import { useGenerateDocker } from "@/hooks/useGenerateDocker";

export interface ResponseProps {
  dockerfile: string;
  dockerCompose: string;
  dockerignore: string;
  explanation: string;
}

const Index = () => {
  const [results, setResults] = useState<ResponseProps>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { konamiActivated, resetKonami } = useKonamiCode();
  const generateMutation = useGenerateDocker();
  const { toast } = useToast();

  useEffect(() => {
    if (konamiActivated) {
      toast({
        title: "🎉 Easter Egg Activated!",
        description:
          "Kubernetes YAML mode unlocked! (Just kidding, but that would be cool)",
      });
      resetKonami();
    }
  }, [konamiActivated, toast, resetKonami]);

  const handleGenerate = async (config: ConfigProps) => {
    generateMutation.mutate(config, {
      onSuccess: (data) => {
        setResults(data);
        toast({
          title: "🎉 Docker files generated!",
          description: "Your containers are ready to ship",
        });

        setTimeout(() => {
          const element = document.querySelector(".animate-slide-in");
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "❌ Generation failed",
          description: error.message,
        });
      },
    });
  };

  const handleDownload = () => {
    if (results) {
      downloadAsZip(results);
      toast({
        title: "📦 Download started!",
        description: "Your Docker files are being packaged",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <GeneratorCard onGenerate={handleGenerate} isLoading={isLoading} />
      {results && (
        <ResultSection results={results} onDownload={handleDownload} />
      )}
      <Footer />
    </div>
  );
};

export default Index;
