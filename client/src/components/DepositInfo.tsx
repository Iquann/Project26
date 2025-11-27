import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function DepositInfo() {
  return (
    <Card data-testid="card-deposit-info">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Deposit Information
          </CardTitle>
          <Badge className="bg-primary text-lg px-3 py-1">$500</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Non-Refundable Deposit</p>
            <p className="text-sm text-muted-foreground">
              Deposits are non-refundable but transferable to a future litter if needed.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Deposit Policy:</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Deposits are placed on currently available puppies or upcoming litters</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Selection order is first-in, first-out based on deposit date</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>You may transfer your deposit to an alternate litter if needed</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>When transferring, you'll be placed at the end of the list for the new litter</span>
            </li>
          </ul>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> We do not take deposits based on gender or color of the puppy. 
            Customers with deposits will select their puppy when puppies are 4-5 weeks old.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
