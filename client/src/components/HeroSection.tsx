import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/red_goldendoodle_puppy_hero.png";

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Adorable goldendoodle puppy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          data-testid="text-hero-title"
        >
          Mini Goldendoodles & Bernedoodles
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
          Premium, health-tested puppies raised with love in Utah. 
          Your perfect family companion is waiting for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/puppies">
            <Button size="lg" className="text-lg px-8" data-testid="button-view-puppies">
              View Available Puppies
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" data-testid="button-learn-more">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
