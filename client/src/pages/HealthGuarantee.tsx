import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function HealthGuarantee() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-guarantee-page-title"
            >
              Two-Year Health Guarantee
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We stand behind the health of every puppy we raise. Our comprehensive 
              health guarantee gives you peace of mind.
            </p>
          </div>

          <div className="space-y-8">
            <Card data-testid="card-guarantee-coverage">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  If your puppy is found to have life-threatening, crippling, and/or disabling 
                  congenital (genetic) health defects within the first two years of life, 
                  we'll replace your puppy free of charge.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Genetic disorders that are life-threatening</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Crippling congenital defects</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Disabling hereditary conditions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-guarantee-exclusions">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  What's Not Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Conditions caused by injury, neglect, or improper care</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Parasites, viruses, or bacterial infections</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Issues resulting from failure to follow vaccination schedule</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Cosmetic issues or minor health conditions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-guarantee-requirements">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Puppy must be examined by a licensed veterinarian within 72 hours of pickup
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Diagnosis must be confirmed by a licensed veterinarian in writing
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Spay/Neuter contract must be honored as agreed
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Puppy must be properly cared for with appropriate nutrition and medical care
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20" data-testid="card-guarantee-promise">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Our Promise
                    </h3>
                    <p className="text-muted-foreground">
                      We are proud of our solid reputation for healthy, happy puppies. 
                      All of our parent dogs are or will be genetically certified. 
                      We are so confident in the lineage of our puppies that we stand 
                      behind this comprehensive health guarantee. Your peace of mind 
                      matters to us.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
