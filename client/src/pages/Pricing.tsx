import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import PaymentSelector from "@/components/PaymentSelector";
import ProcessTimeline from "@/components/ProcessTimeline";
import DepositInfo from "@/components/DepositInfo";
import SpayNeuterContract from "@/components/SpayNeuterContract";
import InfoCard from "@/components/InfoCard";
import { Plane, Home, Gift, Heart } from "lucide-react";
import puppiesImage from "@assets/generated_images/puppies_playing_together.png";

const goldendoodlePrices = [
  { name: "Standard/Medium", price: "$2,500" },
  { name: "Mini", price: "$2,500" },
  { name: "Teacup", price: "$2,800" },
  { name: "Micro Teacup", price: "$3,300" },
];

const bernedoodlePrices = [
  { name: "Standard/Mini", price: "$2,000 - $3,500", isRange: true },
  { name: "Teacup", price: "$3,000 - $4,000", isRange: true },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={puppiesImage}
              alt="Puppies playing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-pricing-title"
            >
              Buying a Puppy
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Everything you need to know about pricing, deposits, and our buying process.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-semibold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <PricingCard title="Goldendoodles" items={goldendoodlePrices} highlight />
              <PricingCard title="Bernedoodles" items={bernedoodlePrices} />
            </div>
            <p className="text-center text-muted-foreground">
              Deposits are $500 and are included in the prices above.
            </p>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              <DepositInfo />
              <SpayNeuterContract />
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-semibold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Pay Your Deposit
            </h2>
            <div className="max-w-3xl mx-auto">
              <PaymentSelector depositAmount={500} breedType="Goldendoodle" />
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ProcessTimeline />
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className="text-3xl font-semibold mb-8 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Additional Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InfoCard
                icon={Plane}
                title="Puppy Transport"
                description="We can recommend flight nanny services to deliver your puppy right to your airport."
                details={["Includes flight, cabin fee, hotels if needed"]}
              />
              <InfoCard
                icon={Home}
                title="Puppy Boarding"
                description="If you cannot take your puppy on the scheduled date, we offer boarding services."
                details={["$30 per day", "Up to 2 weeks"]}
              />
              <InfoCard
                icon={Gift}
                title="What's Included"
                description="Every puppy comes with everything needed for a great start."
                details={[
                  "Health care by licensed vet",
                  "Blanket with Mom's scent",
                  "Lifetime guidance and advice"
                ]}
              />
              <InfoCard
                icon={Heart}
                title="PayPal Financing"
                description="Break your balance into monthly payments through PayPal."
                details={["Interest-free payments", "Pay over time option"]}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
