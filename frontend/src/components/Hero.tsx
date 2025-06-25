
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 md:py-32 text-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-space font-bold text-white mb-6 leading-tight">
            Paste your stack.
            <br />
            <span className="text-dark-accent">Get your Dockerfile.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-dark-muted mb-8 font-inter">
            No setup drama. Just containers. 🐳
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToGenerator}
              className="btn-glow bg-dark-accent text-black font-semibold px-8 py-3 text-lg hover:bg-dark-accent/90 neon-glow"
            >
              Try the magic ✨
            </Button>
            
            <div className="text-dark-muted text-sm">
              <span className="hidden sm:inline">•</span> Works with Node.js, Python, and more
            </div>
          </div>

          {/* Easter egg hint */}
          <div className="mt-12 text-xs text-dark-muted/60 hover:text-dark-accent transition-colors cursor-default">
            psst... try the konami code for something special 👀
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
