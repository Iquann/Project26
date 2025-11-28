import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PuppyCard from "@/components/PuppyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Puppy } from "@shared/schema";

export default function Puppies() {
  const [breedFilter, setBreedFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: puppies = [], isLoading } = useQuery<Puppy[]>({
    queryKey: ["/api/puppies"],
  });

  const filteredPuppies = puppies.filter((puppy) => {
    const breedMatch = breedFilter === "all" || puppy.breed.toLowerCase().includes(breedFilter.toLowerCase());
    const statusMatch = statusFilter === "all" || puppy.status.toLowerCase() === statusFilter.toLowerCase();
    return breedMatch && statusMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              data-testid="text-puppies-title"
            >
              Available Puppies
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our current litters and find your perfect furry family member.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Select value={breedFilter} onValueChange={setBreedFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-breed-filter">
                <SelectValue placeholder="Filter by breed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Breeds</SelectItem>
                <SelectItem value="goldendoodle">Goldendoodles</SelectItem>
                <SelectItem value="bernedoodle">Bernedoodles</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setBreedFilter("all");
                setStatusFilter("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))}
            </div>
          ) : filteredPuppies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No puppies match your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPuppies.map((puppy) => (
                <PuppyCard 
                  key={puppy.id} 
                  id={puppy.id}
                  name={puppy.name}
                  breed={puppy.breed}
                  color={puppy.color}
                  gender={puppy.gender as "Male" | "Female"}
                  price={puppy.price}
                  status={puppy.status as "Available" | "Reserved" | "Sold"}
                  imageSrc={puppy.imageSrc || "/images/default-puppy.png"}
                  birthDate={puppy.birthDate || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
