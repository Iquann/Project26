import PricingCard from '../PricingCard';

export default function PricingCardExample() {
  const goldendoodlePrices = [
    { name: "Standard/Medium", price: "$2,500" },
    { name: "Mini", price: "$2,500" },
    { name: "Teacup", price: "$2,800" },
    { name: "Micro Teacup", price: "$3,300" },
  ];

  return (
    <div className="max-w-sm">
      <PricingCard title="Goldendoodles" items={goldendoodlePrices} highlight />
    </div>
  );
}
