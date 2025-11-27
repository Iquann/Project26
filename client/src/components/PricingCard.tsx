import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PriceItem {
  name: string;
  price: string;
  isRange?: boolean;
}

interface PricingCardProps {
  title: string;
  items: PriceItem[];
  highlight?: boolean;
}

export default function PricingCard({ title, items, highlight }: PricingCardProps) {
  return (
    <Card className={highlight ? "border-primary/50" : ""} data-testid={`card-pricing-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-4">
        <CardTitle
          className="text-2xl"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-muted-foreground">{item.name}</span>
              <Badge variant="secondary" className="font-semibold">
                {item.price}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
