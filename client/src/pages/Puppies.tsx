import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PuppyCard from "@/components/PuppyCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import goldendoodleImage from "@assets/generated_images/teacup_goldendoodle_puppy.png";
import bernedoodleImage from "@assets/generated_images/tri-color_bernedoodle_puppy.png";

// todo: remove mock functionality
const mockPuppies = [
  {
    id: "1",
    name: "Maple",
    breed: "Mini Goldendoodle",
    color: "Red",
    gender: "Female" as const,
    price: 2500,
    status: "Available" as const,
    imageSrc: goldendoodleImage,
    birthDate: "Oct 15, 2024",
  },
  {
    id: "2",
    name: "Cooper",
    breed: "Mini Goldendoodle",
    color: "Cream",
    gender: "Male" as const,
    price: 2500,
    status: "Available" as const,
    imageSrc: goldendoodleImage,
    birthDate: "Oct 15, 2024",
  },
  {
    id: "3",
    name: "Luna",
    breed: "Mini Bernedoodle",
    color: "Tri-Color",
    gender: "Female" as const,
    price: 3000,
    status: "Reserved" as const,
    imageSrc: bernedoodleImage,
    birthDate: "Sep 28, 2024",
  },
  {
    id: "4",
    name: "Bear",
    breed: "Mini Bernedoodle",
    color: "Tri-Color",
    gender: "Male" as const,
    price: 2800,
    status: "Available" as const,
    imageSrc: bernedoodleImage,
    birthDate: "Sep 28, 2024",
  },
  {
    id: "5",
    name: "Daisy",
    breed: "Teacup Goldendoodle",
    color: "Apricot",
    gender: "Female" as const,
    price: 2800,
    status: "Sold" as const,
    imageSrc: goldendoodleImage,
    birthDate: "Aug 20, 2024",
  },
  {
    id: "6",
    name: "Charlie",
    breed: "Mini Goldendoodle",
    color: "Red",
    gender: "Male" as const,
    price: 2500,
    status: "Available" as const,
    imageSrc: goldendoodleImage,
    birthDate: "Oct 15, 2024",
  },
];

export default function Puppies() {
  const [breedFilter, setBreedFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPuppies = mockPuppies.filter((puppy) => {
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

          {filteredPuppies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No puppies match your filters.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPuppies.map((puppy) => (
                <PuppyCard key={puppy.id} {...puppy} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
