import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText } from "lucide-react";

export default function SpayNeuterContract() {
  return (
    <Card data-testid="card-spay-neuter">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Spay / Neuter Contract
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              Pets Only - We Do Not Sell to Breeders
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              All puppies are sold as pets only with a strict Spay/Neuter contract. 
              We require proof of Spay/Neuter before your puppy is 1 year old.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
