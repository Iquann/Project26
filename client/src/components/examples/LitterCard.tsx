import LitterCard from '../LitterCard';

export default function LitterCardExample() {
  return (
    <div className="max-w-sm">
      <LitterCard
        id="demo-litter"
        motherName="Rosie"
        fatherName="Max"
        breed="Mini Goldendoodle"
        expectedDate="Dec 15, 2024"
        spotsAvailable={4}
        totalSpots={6}
        price={2500}
        status="Upcoming"
      />
    </div>
  );
}
