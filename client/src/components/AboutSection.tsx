import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ownersImage from "@assets/generated_images/business_owners_with_puppies.png";

export default function AboutSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2
              className="text-3xl lg:text-4xl font-semibold mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-about-title"
            >
              About Us
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We are Ashlie and Jessi, cousins and business partners! We love working together 
                to provide the finest Goldendoodles and Bernedoodles available for your family.
              </p>
              <p>
                We set the foundational work for our puppies to become the best possible family dogs. 
                We focus on empowering, not enabling; Early Neurological Stimulation (ENS) and Early 
                Scent Introduction (ESI); Puppy Massage Handling; and building that foundation of trust, 
                love and respect.
              </p>
              <p>
                We are trained to perform puppy temperament testing to ensure successful puppy placement. 
                This helps you avoid emotional and costly re-homing scenarios. We want our puppies to be 
                in the best homes for them and you!
              </p>
            </div>
            <div className="mt-8">
              <Link href="/about">
                <Button variant="outline" data-testid="button-learn-more-about">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src={ownersImage}
              alt="Ashlie and Jessi with puppies"
              className="rounded-lg shadow-lg w-full"
              data-testid="img-owners"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
