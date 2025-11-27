import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LitterCard from "@/components/LitterCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// todo: remove mock functionality
const mockLitters = {
  goldendoodle: [
    {
      id: "g1",
      motherName: "Rosie",
      fatherName: "Max",
      breed: "Mini Goldendoodle",
      expectedDate: "Dec 15, 2024",
      spotsAvailable: 4,
      totalSpots: 6,
      price: 2500,
      status: "Upcoming" as const,
    },
    {
      id: "g2",
      motherName: "Bella",
      fatherName: "Charlie",
      breed: "Teacup Goldendoodle",
      expectedDate: "Jan 10, 2025",
      spotsAvailable: 2,
      totalSpots: 5,
      price: 2800,
      status: "Upcoming" as const,
    },
    {
      id: "g3",
      motherName: "Daisy",
      fatherName: "Tucker",
      breed: "Mini Goldendoodle",
      expectedDate: "Nov 20, 2024",
      spotsAvailable: 3,
      totalSpots: 7,
      price: 2500,
      status: "Born" as const,
    },
    {
      id: "g4",
      motherName: "Honey",
      fatherName: "Bear",
      breed: "Mini Goldendoodle",
      expectedDate: "Oct 5, 2024",
      spotsAvailable: 0,
      totalSpots: 6,
      price: 2500,
      status: "Sold Out" as const,
    },
  ],
  bernedoodle: [
    {
      id: "b1",
      motherName: "Sage",
      fatherName: "Winston",
      breed: "Mini Bernedoodle",
      expectedDate: "Dec 28, 2024",
      spotsAvailable: 5,
      totalSpots: 8,
      price: 3000,
      status: "Upcoming" as const,
    },
    {
      id: "b2",
      motherName: "Olive",
      fatherName: "Moose",
      breed: "Mini Bernedoodle",
      expectedDate: "Nov 15, 2024",
      spotsAvailable: 1,
      totalSpots: 6,
      price: 3200,
      status: "Selection Open" as const,
    },
    {
      id: "b3",
      motherName: "Willow",
      fatherName: "Atlas",
      breed: "Standard Bernedoodle",
      expectedDate: "Jan 20, 2025",
      spotsAvailable: 6,
      totalSpots: 8,
      price: 2800,
      status: "Upcoming" as const,
    },
  ],
};

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("goldendoodle");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-schedule-title"
            >
              Puppy Schedule
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View upcoming and current litters. Place a deposit to reserve your spot!
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="goldendoodle" data-testid="tab-goldendoodle">
                  Goldendoodles
                </TabsTrigger>
                <TabsTrigger value="bernedoodle" data-testid="tab-bernedoodle">
                  Bernedoodles
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="goldendoodle">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLitters.goldendoodle.map((litter) => (
                  <LitterCard key={litter.id} {...litter} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bernedoodle">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockLitters.bernedoodle.map((litter) => (
                  <LitterCard key={litter.id} {...litter} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Don't see what you're looking for? Join our Master List and we'll contact you 
              when a litter meets your requirements.
            </p>
            <Button variant="outline" data-testid="button-join-master-list">
              Join Master List
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
