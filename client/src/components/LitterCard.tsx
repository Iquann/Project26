import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import { Link } from "wouter";

interface LitterCardProps {
  id: string;
  motherName: string;
  fatherName: string;
  breed: string;
  expectedDate: string;
  spotsAvailable: number;
  totalSpots: number;
  price: number;
  status: "Upcoming" | "Born" | "Selection Open" | "Sold Out";
}

export default function LitterCard({
  id,
  motherName,
  fatherName,
  breed,
  expectedDate,
  spotsAvailable,
  totalSpots,
  price,
  status,
}: LitterCardProps) {
  const statusColor = {
    "Upcoming": "bg-blue-600",
    "Born": "bg-green-600",
    "Selection Open": "bg-yellow-600",
    "Sold Out": "bg-gray-500",
  };

  const isSoldOut = status === "Sold Out";

  return (
    <Card className="hover-elevate" data-testid={`card-litter-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {motherName} x {fatherName}
          </CardTitle>
          <Badge className={statusColor[status]}>{status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{breed}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Expected: {expectedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{spotsAvailable} of {totalSpots} spots available</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-lg font-bold text-primary" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ${price.toLocaleString()}
            </p>
          </div>
          {!isSoldOut && (
            <Link href={`/deposit/litter/${id}`}>
              <Button data-testid={`button-deposit-${id}`}>
                Place Deposit
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
