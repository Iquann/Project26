import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import goldendoodleImage from "@assets/generated_images/teacup_goldendoodle_puppy.png";
import heroImage from "@assets/generated_images/red_goldendoodle_puppy_hero.png";

export default function Goldendoodles() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Goldendoodle puppy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-goldendoodles-title"
            >
              Mini Goldendoodles
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Healthy, happy, beautiful puppies raised by our family in Utah.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl font-semibold mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  About Goldendoodles
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Goldendoodles are a cross between a Golden Retriever and a Poodle. 
                    They combine the best traits of both breeds - the friendly, 
                    loving nature of Golden Retrievers with the intelligence and 
                    hypoallergenic coat of Poodles.
                  </p>
                  <p>
                    Our Goldendoodles have charming personalities with a goofy, 
                    fun-loving nature. They're all-around great family pets who 
                    love to play, cuddle, and be part of your daily life.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={goldendoodleImage}
                  alt="Mini Goldendoodle"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-semibold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Sizes & Pricing
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Standard/Medium
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">40-65 lbs</p>
                  <p className="text-2xl font-bold text-primary">$2,500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mini
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">25-40 lbs</p>
                  <p className="text-2xl font-bold text-primary">$2,500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Teacup
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">15-25 lbs</p>
                  <p className="text-2xl font-bold text-primary">$2,800</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Micro Teacup
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Under 15 lbs</p>
                  <p className="text-2xl font-bold text-primary">$3,300</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-semibold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Why Choose Our Goldendoodles?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                "Health-tested parents",
                "2-year health guarantee",
                "Early neurological stimulation",
                "Temperament tested for best placement",
                "Raised in a loving home environment",
                "Socialized with children and other pets",
                "Hypoallergenic, low-shedding coats",
                "Lifetime breeder support",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2
              className="text-3xl font-semibold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ready to Find Your Goldendoodle?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              View our available puppies or check our upcoming litters to reserve your spot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/puppies?breed=goldendoodle">
                <Button size="lg" data-testid="button-view-goldendoodle-puppies">
                  View Available Puppies
                </Button>
              </Link>
              <Link href="/schedule?breed=goldendoodle">
                <Button size="lg" variant="outline" data-testid="button-view-goldendoodle-schedule">
                  View Upcoming Litters
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
