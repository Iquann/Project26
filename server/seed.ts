import { db } from "./db";
import { puppies, litters } from "@shared/schema";

const seedPuppies = [
  {
    name: "Maple",
    breed: "Mini Goldendoodle",
    color: "Red",
    gender: "Female",
    price: 2500,
    status: "Available",
    imageSrc: "/assets/generated_images/teacup_goldendoodle_puppy.png",
    birthDate: "Oct 15, 2024",
  },
  {
    name: "Cooper",
    breed: "Mini Goldendoodle",
    color: "Cream",
    gender: "Male",
    price: 2500,
    status: "Available",
    imageSrc: "/assets/generated_images/teacup_goldendoodle_puppy.png",
    birthDate: "Oct 15, 2024",
  },
  {
    name: "Luna",
    breed: "Mini Bernedoodle",
    color: "Tri-Color",
    gender: "Female",
    price: 3000,
    status: "Reserved",
    imageSrc: "/assets/generated_images/tri-color_bernedoodle_puppy.png",
    birthDate: "Sep 28, 2024",
  },
  {
    name: "Bear",
    breed: "Mini Bernedoodle",
    color: "Tri-Color",
    gender: "Male",
    price: 2800,
    status: "Available",
    imageSrc: "/assets/generated_images/tri-color_bernedoodle_puppy.png",
    birthDate: "Sep 28, 2024",
  },
  {
    name: "Daisy",
    breed: "Teacup Goldendoodle",
    color: "Apricot",
    gender: "Female",
    price: 2800,
    status: "Sold",
    imageSrc: "/assets/generated_images/teacup_goldendoodle_puppy.png",
    birthDate: "Aug 20, 2024",
  },
  {
    name: "Charlie",
    breed: "Mini Goldendoodle",
    color: "Red",
    gender: "Male",
    price: 2500,
    status: "Available",
    imageSrc: "/assets/generated_images/teacup_goldendoodle_puppy.png",
    birthDate: "Oct 15, 2024",
  },
];

const seedLitters = [
  {
    motherName: "Rosie",
    fatherName: "Max",
    breed: "Mini Goldendoodle",
    expectedDate: "Dec 15, 2024",
    spotsAvailable: 4,
    totalSpots: 6,
    price: 2500,
    status: "Upcoming",
  },
  {
    motherName: "Bella",
    fatherName: "Charlie",
    breed: "Teacup Goldendoodle",
    expectedDate: "Jan 10, 2025",
    spotsAvailable: 2,
    totalSpots: 5,
    price: 2800,
    status: "Upcoming",
  },
  {
    motherName: "Daisy",
    fatherName: "Tucker",
    breed: "Mini Goldendoodle",
    expectedDate: "Nov 20, 2024",
    spotsAvailable: 3,
    totalSpots: 7,
    price: 2500,
    status: "Born",
  },
  {
    motherName: "Honey",
    fatherName: "Bear",
    breed: "Mini Goldendoodle",
    expectedDate: "Oct 5, 2024",
    spotsAvailable: 0,
    totalSpots: 6,
    price: 2500,
    status: "Sold Out",
  },
  {
    motherName: "Sage",
    fatherName: "Winston",
    breed: "Mini Bernedoodle",
    expectedDate: "Dec 28, 2024",
    spotsAvailable: 5,
    totalSpots: 8,
    price: 3000,
    status: "Upcoming",
  },
  {
    motherName: "Olive",
    fatherName: "Moose",
    breed: "Mini Bernedoodle",
    expectedDate: "Nov 15, 2024",
    spotsAvailable: 1,
    totalSpots: 6,
    price: 3200,
    status: "Selection Open",
  },
  {
    motherName: "Willow",
    fatherName: "Atlas",
    breed: "Standard Bernedoodle",
    expectedDate: "Jan 20, 2025",
    spotsAvailable: 6,
    totalSpots: 8,
    price: 2800,
    status: "Upcoming",
  },
];

async function seed() {
  console.log("Seeding database...");
  
  // Check if data already exists
  const existingPuppies = await db.select().from(puppies);
  if (existingPuppies.length > 0) {
    console.log("Database already has data, skipping seed.");
    return;
  }

  // Insert puppies
  for (const puppy of seedPuppies) {
    await db.insert(puppies).values(puppy);
  }
  console.log(`Inserted ${seedPuppies.length} puppies`);

  // Insert litters
  for (const litter of seedLitters) {
    await db.insert(litters).values(litter);
  }
  console.log(`Inserted ${seedLitters.length} litters`);

  console.log("Seeding complete!");
}

seed().catch(console.error);
