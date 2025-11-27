import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentMethodCard from "./PaymentMethodCard";

type PaymentMethod = "paypal" | "cashapp" | "zelle" | "applepay" | "crypto";

interface PaymentSelectorProps {
  depositAmount?: number;
  breedType?: string;
  onPaymentSelect?: (method: PaymentMethod) => void;
}

export default function PaymentSelector({
  depositAmount = 500,
  breedType = "Goldendoodle",
  onPaymentSelect,
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onPaymentSelect?.(method);
  };

  const handleProceed = () => {
    if (selectedMethod) {
      console.log(`Proceeding with ${selectedMethod} payment for ${breedType}`);
    }
  };

  return (
    <Card data-testid="card-payment-selector">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Select Payment Method
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deposit: ${depositAmount} for {breedType}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <PaymentMethodCard
            method="paypal"
            selected={selectedMethod === "paypal"}
            onSelect={handleSelect}
            depositAmount={depositAmount}
          />
          <PaymentMethodCard
            method="cashapp"
            selected={selectedMethod === "cashapp"}
            onSelect={handleSelect}
            depositAmount={depositAmount}
          />
          <PaymentMethodCard
            method="zelle"
            selected={selectedMethod === "zelle"}
            onSelect={handleSelect}
            depositAmount={depositAmount}
          />
          <PaymentMethodCard
            method="applepay"
            selected={selectedMethod === "applepay"}
            onSelect={handleSelect}
            depositAmount={depositAmount}
          />
          <PaymentMethodCard
            method="crypto"
            selected={selectedMethod === "crypto"}
            onSelect={handleSelect}
            depositAmount={depositAmount}
            cryptoDiscount={10}
          />
        </div>

        {selectedMethod === "crypto" && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 dark:text-green-200">
              Pay with Bitcoin or USDT and save 10%! You'll receive wallet details after clicking proceed.
            </p>
          </div>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!selectedMethod}
          onClick={handleProceed}
          data-testid="button-proceed-payment"
        >
          {selectedMethod
            ? `Proceed with ${selectedMethod === "applepay" ? "Apple Pay" : selectedMethod === "cashapp" ? "Cash App" : selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}`
            : "Select a Payment Method"}
        </Button>
      </CardContent>
    </Card>
  );
}
