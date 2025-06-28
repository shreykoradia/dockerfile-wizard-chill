import { Github } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import clsx from "clsx";

const Header = () => {
  const scrollToGenerator = () => {
    const element = document.getElementById("generator");
    element?.scrollIntoView({ behavior: "smooth" });
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
          <a
            href="https://github.com/shreykoradia/dockerfile-wizard-chill"
            className={clsx(
              "btn-glow border-dark-border bg-transparent text-white hover:bg-dark-card hover:border-dark-accent hover:text-dark-accent neon-glow transition-all duration-200",
              buttonVariants({ variant: "outline", size: "sm" })
            )}
            onClick={() => window.open("https://github.com", "_blank")}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub ⭐
          </a>
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
