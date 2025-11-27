import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Place Deposit",
    description: "Reserve your spot with a $500 non-refundable deposit on an upcoming litter.",
  },
  {
    title: "Puppies Born",
    description: "You'll be notified by email with photos and general information about the puppies.",
  },
  {
    title: "Weekly Updates",
    description: "Watch the litter grow through weekly video updates posted to our website.",
  },
  {
    title: "Selection Time",
    description: "At 5 weeks, select your puppy via phone call, FaceTime, or in-person visit.",
  },
  {
    title: "Balance Payment",
    description: "Pay the remaining balance 2 weeks before pickup. Financing available via PayPal.",
  },
  {
    title: "Puppy Goes Home",
    description: "At 8 weeks, your new family member is ready to come home with you!",
  },
];

export default function ProcessTimeline() {
  return (
    <div className="space-y-4">
      <h3
        className="text-2xl font-semibold mb-6"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
        data-testid="text-process-title"
      >
        Our Process
      </h3>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative pl-12" data-testid={`step-${index + 1}`}>
              <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {index + 1}
              </div>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
