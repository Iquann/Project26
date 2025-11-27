import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
}

export default function InfoCard({ icon: Icon, title, description, details }: InfoCardProps) {
  return (
    <Card className="h-full" data-testid={`card-info-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        {details && details.length > 0 && (
          <ul className="space-y-1">
            {details.map((detail, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
