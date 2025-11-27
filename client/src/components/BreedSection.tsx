import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface BreedSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  learnMoreLink: string;
  puppiesLink: string;
  scheduleLink: string;
  imagePosition?: "left" | "right";
}

export default function BreedSection({
  title,
  description,
  imageSrc,
  imageAlt,
  learnMoreLink,
  puppiesLink,
  scheduleLink,
  imagePosition = "left",
}: BreedSectionProps) {
  const imageOrder = imagePosition === "left" ? "lg:order-1" : "lg:order-2";
  const contentOrder = imagePosition === "left" ? "lg:order-2" : "lg:order-1";

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`${imageOrder}`}>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="rounded-lg shadow-lg w-full"
              data-testid={`img-${title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </div>
          <div className={`${contentOrder}`}>
            <h2
              className="text-3xl lg:text-4xl font-semibold mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-title`}
            >
              {title}
            </h2>
            <p className="text-muted-foreground mb-6">{description}</p>
            <div className="space-y-4">
              <Link href={learnMoreLink}>
                <Button variant="outline" className="w-full sm:w-auto" data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  More About {title}
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={puppiesLink}>
                  <Button className="w-full sm:w-auto" data-testid={`button-view-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                    View Current Puppies
                  </Button>
                </Link>
                <Link href={scheduleLink}>
                  <Button variant="secondary" className="w-full sm:w-auto" data-testid={`button-schedule-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                    View Puppy Schedule
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
