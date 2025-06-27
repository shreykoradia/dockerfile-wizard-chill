import { Coffee, Music3Icon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-dark-border">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-dark-muted text-lg mb-6 font-inter">
            Crafted by{" "}
            <a
              href="https://twitter.com/shreykoradia"
              className="text-dark-accent hover:text-foreground"
            >
              Shrey
            </a>
            {", "}
            quietly building good things on the internet.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-dark-muted">
            <a
              href="https://peerlist.io/shrey_"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              Shrey's Peerlist
            </a>
            <p className="text-foreground">
              <a
                target="_blank"
                className="text-dark-accent"
                href="https://talentscout.pro"
              >
                TalentScout
              </a>{" "}
              coming soon...
            </p>
          </div>

          <div className="mt-8 text-xs text-dark-muted/60">
            <p>
              © {new Date().getFullYear()} GetMyDockerfile. Making containers
              less scary, one paste at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
