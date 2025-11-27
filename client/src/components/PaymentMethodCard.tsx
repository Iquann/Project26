import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiPaypal, SiCashapp, SiApple, SiBitcoin } from "react-icons/si";
import { Banknote, CreditCard } from "lucide-react";

type PaymentMethod = "paypal" | "cashapp" | "zelle" | "applepay" | "crypto";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected?: boolean;
  onSelect: (method: PaymentMethod) => void;
  depositAmount: number;
  cryptoDiscount?: number;
}

const methodConfig = {
  paypal: {
    name: "PayPal",
    icon: SiPaypal,
    fee: "3% fee",
    color: "#0070ba",
  },
  cashapp: {
    name: "Cash App",
    icon: SiCashapp,
    fee: "No fee",
    color: "#00D632",
  },
  zelle: {
    name: "Zelle",
    icon: Banknote,
    fee: "No fee",
    color: "#6D1ED4",
  },
  applepay: {
    name: "Apple Pay",
    icon: SiApple,
    fee: "No fee",
    color: "#000000",
  },
  crypto: {
    name: "Crypto (BTC/USDT)",
    icon: SiBitcoin,
    fee: "10% OFF",
    color: "#F7931A",
  },
};

export default function PaymentMethodCard({
  method,
  selected,
  onSelect,
  depositAmount,
  cryptoDiscount = 10,
}: PaymentMethodCardProps) {
  const config = methodConfig[method];
  const Icon = config.icon;
  
  const calculatePrice = () => {
    if (method === "paypal") {
      return depositAmount + (depositAmount * 0.03);
    }
    if (method === "crypto") {
      return depositAmount - (depositAmount * (cryptoDiscount / 100));
    }
    return depositAmount;
  };

  const price = calculatePrice();
  const isCrypto = method === "crypto";

  return (
    <Card
      className={`cursor-pointer transition-all hover-elevate ${
        selected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={() => onSelect(method)}
      data-testid={`card-payment-${method}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Icon className="w-5 h-5" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{config.name}</h4>
            <Badge
              variant={isCrypto ? "default" : "secondary"}
              className={`text-xs ${isCrypto ? "bg-green-600" : ""}`}
            >
              {config.fee}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${price.toFixed(2)}
          </span>
          {isCrypto && (
            <p className="text-xs text-green-600">Save ${(depositAmount * (cryptoDiscount / 100)).toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
