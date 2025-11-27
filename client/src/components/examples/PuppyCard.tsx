import PuppyCard from '../PuppyCard';
import goldendoodleImage from "@assets/generated_images/teacup_goldendoodle_puppy.png";

export default function PuppyCardExample() {
  return (
    <div className="max-w-sm">
      <PuppyCard
        id="demo-1"
        name="Maple"
        breed="Mini Goldendoodle"
        color="Red"
        gender="Female"
        price={2500}
        status="Available"
        imageSrc={goldendoodleImage}
        birthDate="Oct 15, 2024"
      />
    </div>
  );
}
