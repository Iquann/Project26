import { Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { PaymentMethod } from "@shared/schema";

export default function PaymentDetailsModal({ method, onClose }: { method: PaymentMethod | null; onClose: () => void }) {
  const { toast } = useToast();

  if (!method) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Payment details copied to clipboard" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {method.displayName} Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {method.name && (
            <div>
              <p className="text-sm text-muted-foreground">Account Name</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="font-semibold">{method.name}</p>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(method.name || "")} data-testid="button-copy-name">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {method.accountInfo && (
            <div>
              <p className="text-sm text-muted-foreground">Payment Info</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="font-semibold font-mono text-lg">{method.accountInfo}</p>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(method.accountInfo || "")} data-testid="button-copy-account">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {method.instructions && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground font-semibold mb-2">Instructions:</p>
              <p className="text-sm text-foreground">{method.instructions}</p>
            </div>
          )}

          <Button onClick={onClose} className="w-full" data-testid="button-close-payment-modal">
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
