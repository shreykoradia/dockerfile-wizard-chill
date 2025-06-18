
import { Heart, Coffee, Twitter, FileText, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-dark-border">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-dark-muted text-lg mb-6 font-inter">
            Built in a weekend with{" "}
            <Heart className="inline w-4 h-4 text-red-500 mx-1" />{" "}
            & caffeine by{" "}
            <span className="text-dark-accent font-semibold">Shrey</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-muted">
            <a
              href="#"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              <Shield className="w-4 h-4" />
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </a>
            <a
              href="#"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              <FileText className="w-4 h-4" />
              Docs
            </a>
            <a
              href="#"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              <Coffee className="w-4 h-4" />
              Buy me coffee ☕?
            </a>
          </div>

          <div className="mt-8 text-xs text-dark-muted/60">
            <p>© 2024 GetMyDockerfile. Making containers less scary, one paste at a time.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
