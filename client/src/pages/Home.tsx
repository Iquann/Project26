import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BreedSection from "@/components/BreedSection";
import HealthGuaranteeBanner from "@/components/HealthGuaranteeBanner";
import goldendoodleImage from "@assets/generated_images/teacup_goldendoodle_puppy.png";
import bernedoodleImage from "@assets/generated_images/tri-color_bernedoodle_puppy.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        
        <BreedSection
          title="Mini Goldendoodles"
          description="We specialize in Red Mini Goldendoodles and Teacup Goldendoodles - healthy, happy beautiful puppies raised by our family. Goldendoodles have charming personalities with a goofy fun-loving nature and are all-around great family pets."
          imageSrc={goldendoodleImage}
          imageAlt="Adorable goldendoodle puppy"
          learnMoreLink="/goldendoodles"
          puppiesLink="/puppies?breed=goldendoodle"
          scheduleLink="/schedule?breed=goldendoodle"
          imagePosition="left"
        />
        
        <div className="bg-card">
          <BreedSection
            title="Mini Bernedoodles"
            description="Our Mini Bernedoodles are as sweet as they are beautiful. Bernedoodles are tons of fun. They thrive in a family setting and have laid-back personalities that make them perfect companions."
            imageSrc={bernedoodleImage}
            imageAlt="Beautiful bernedoodle puppy"
            learnMoreLink="/bernedoodles"
            puppiesLink="/puppies?breed=bernedoodle"
            scheduleLink="/schedule?breed=bernedoodle"
            imagePosition="right"
          />
        </div>
        
        <HealthGuaranteeBanner />
      </main>
      <Footer />
    </div>
  );
}
