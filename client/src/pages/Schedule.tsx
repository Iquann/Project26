import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LitterCard from "@/components/LitterCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { Litter } from "@shared/schema";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("goldendoodle");

  const { data: litters = [], isLoading } = useQuery<Litter[]>({
    queryKey: ["/api/litters"],
  });

  const goldendoodleLitters = litters.filter(l => l.breed.toLowerCase().includes("goldendoodle"));
  const bernedoodleLitters = litters.filter(l => l.breed.toLowerCase().includes("bernedoodle"));

  const LitterGrid = ({ items }: { items: Litter[] }) => (
    isLoading ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    ) : items.length === 0 ? (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No litters found.</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((litter) => (
          <LitterCard 
            key={litter.id} 
            id={litter.id}
            motherName={litter.motherName}
            fatherName={litter.fatherName}
            breed={litter.breed}
            expectedDate={litter.expectedDate}
            spotsAvailable={litter.spotsAvailable}
            totalSpots={litter.totalSpots}
            price={litter.price}
            status={litter.status as "Upcoming" | "Born" | "Selection Open" | "Sold Out"}
          />
        ))}
      </div>
    )
  );

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
              <LitterGrid items={goldendoodleLitters} />
            </TabsContent>

            <TabsContent value="bernedoodle">
              <LitterGrid items={bernedoodleLitters} />
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
