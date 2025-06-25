import { Coffee, Music3Icon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 border-t border-dark-border">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-dark-muted text-lg mb-6 font-inter">
            Assembled in a caffeine-fueled haze{" "}
            <Coffee className="inline w-4 h-4 text-red-500 mx-1 mb-[2px]" />{" "}
            while aggressively postponing real adulthood — courtesy of{" "}
            <a
              href="https://shrey.codes"
              className="text-dark-accent font-semibold hover:underline"
            >
              Shrey
            </a>
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-dark-muted">
            <a
              href="https://peerlist.io/shrey_"
              className="hover:text-dark-accent transition-colors flex items-center gap-1"
            >
              My Peerlist
            </a>
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
