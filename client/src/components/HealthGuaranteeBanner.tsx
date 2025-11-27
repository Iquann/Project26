import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Heart, CheckCircle } from "lucide-react";

export default function HealthGuaranteeBanner() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2
            className="text-3xl lg:text-4xl font-semibold mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            data-testid="text-guarantee-title"
          >
            2-Year Health Guarantee
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are proud of our solid reputation for healthy, happy puppies. All of our parent dogs 
            are genetically certified, and we back every puppy with our comprehensive health guarantee.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="text-center p-6">
            <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Genetically Tested Parents
            </h3>
            <p className="text-sm text-muted-foreground">
              All parent dogs undergo comprehensive genetic testing
            </p>
          </div>
          <div className="text-center p-6">
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Vet Checked
            </h3>
            <p className="text-sm text-muted-foreground">
              Every puppy receives health care from our licensed vet
            </p>
          </div>
          <div className="text-center p-6">
            <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Free Replacement
            </h3>
            <p className="text-sm text-muted-foreground">
              If genetic defects are found, we replace your puppy free of charge
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/health-guarantee">
            <Button data-testid="button-view-guarantee">View Full Health Guarantee</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
