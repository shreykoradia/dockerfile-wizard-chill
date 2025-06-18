
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🧊</div>
          <h1 className="text-xl font-space font-semibold text-white">
            GetMyDockerfile
          </h1>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="btn-glow border-dark-border bg-transparent text-white hover:bg-dark-card hover:border-dark-accent"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub ⭐
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="btn-glow border-dark-border bg-transparent text-white hover:bg-dark-card hover:border-dark-accent"
            onClick={() => window.open('https://vercel.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Launch on Vercel
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToGenerator}
            className="text-dark-accent"
          >
            Try it →
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
