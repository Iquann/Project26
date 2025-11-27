import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface PuppyCardProps {
  id: string;
  name: string;
  breed: string;
  color: string;
  gender: "Male" | "Female";
  price: number;
  status: "Available" | "Reserved" | "Sold";
  imageSrc: string;
  birthDate?: string;
}

export default function PuppyCard({
  id,
  name,
  breed,
  color,
  gender,
  price,
  status,
  imageSrc,
  birthDate,
}: PuppyCardProps) {
  const statusColor = {
    Available: "bg-green-600",
    Reserved: "bg-yellow-600",
    Sold: "bg-gray-500",
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-puppy-${id}`}>
      <div className="relative aspect-square">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 right-3 ${statusColor[status]}`}>
          {status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            data-testid={`text-puppy-name-${id}`}
          >
            {name}
          </h3>
          <Badge variant="outline">{gender}</Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground mb-3">
          <p>{breed}</p>
          <p>Color: {color}</p>
          {birthDate && <p>Born: {birthDate}</p>}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${price.toLocaleString()}
          </span>
          {status === "Available" && (
            <Link href={`/deposit/${id}`}>
              <Button size="sm" data-testid={`button-reserve-${id}`}>
                Reserve
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
