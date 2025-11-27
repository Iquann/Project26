import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import bernedoodleImage from "@assets/generated_images/tri-color_bernedoodle_puppy.png";

export default function Bernedoodles() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="max-w-7xl mx-auto px-4">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-bernedoodles-title"
            >
              Mini Bernedoodles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Sweet, beautiful, and perfect for families. Our Bernedoodles are raised with love.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src={bernedoodleImage}
                  alt="Mini Bernedoodle"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div>
                <h2
                  className="text-3xl font-semibold mb-6"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  About Bernedoodles
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Bernedoodles are a cross between a Bernese Mountain Dog and a Poodle. 
                    They inherit the calm, gentle nature of Bernese Mountain Dogs combined 
                    with the intelligence and low-shedding coat of Poodles.
                  </p>
                  <p>
                    Our Mini Bernedoodles are as sweet as they are beautiful. They're 
                    tons of fun and thrive in family settings with their laid-back 
                    personalities that make them perfect companions for any home.
                  </p>
                  <p>
                    Known for their stunning tri-color coats in combinations of black, 
                    white, and rust, Bernedoodles are real head-turners wherever they go.
                  </p>
                </div>
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Standard
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">50-90 lbs</p>
                  <p className="text-2xl font-bold text-primary">$2,000 - $3,500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Mini
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">25-50 lbs</p>
                  <p className="text-2xl font-bold text-primary">$2,000 - $3,500</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Teacup
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">Under 25 lbs</p>
                  <p className="text-2xl font-bold text-primary">$3,000 - $4,000</p>
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
              Why Choose Our Bernedoodles?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {[
                "Genetically tested parents",
                "2-year health guarantee",
                "Gorgeous tri-color markings",
                "Calm, gentle temperament",
                "Great with children and other pets",
                "Low-shedding, allergy-friendly coats",
                "Early socialization program",
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
              Ready to Find Your Bernedoodle?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              View our available puppies or check our upcoming litters to reserve your spot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/puppies?breed=bernedoodle">
                <Button size="lg" data-testid="button-view-bernedoodle-puppies">
                  View Available Puppies
                </Button>
              </Link>
              <Link href="/schedule?breed=bernedoodle">
                <Button size="lg" variant="outline" data-testid="button-view-bernedoodle-schedule">
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
