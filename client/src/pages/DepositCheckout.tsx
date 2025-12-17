import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import PayPalButton from "@/components/PayPalButton";
import PaymentDetailsModal from "@/components/PaymentDetailsModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { PaymentMethod as PaymentMethodType } from "@shared/schema";

type PaymentMethod = "paypal" | "cashapp" | "zelle" | "applepay" | "crypto";

export default function DepositCheckout() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState<PaymentMethodType | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: paymentMethods = [] } = useQuery<PaymentMethodType[]>({
    queryKey: ["/api/payment-methods"],
  });

  const depositAmount = 500;
  const depositInCents = depositAmount * 100;
  const depositWithFee = selectedMethod === "paypal" ? Math.round(depositAmount * 1.03 * 100) : depositInCents;

  const createDepositMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to create deposit");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Deposit created! You'll receive a confirmation email shortly.",
      });
      navigate("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    },
  });

  const handlePayPalSuccess = (orderData: any) => {
    if (!selectedMethod || !customerName || !customerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createDepositMutation.mutate({
      customerName,
      customerEmail,
      customerPhone,
      breedType: "Goldendoodle",
      amount: depositInCents,
      paymentMethod: selectedMethod,
      paymentStatus: "completed",
      paypalOrderId: orderData.id,
    });
  };

  const handleNonPayPalSubmit = () => {
    if (!selectedMethod || !customerName || !customerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a payment method",
        variant: "destructive",
      });
      return;
    }

    const methodInfo = paymentMethods.find((m) => m.method === selectedMethod);
    if (methodInfo) {
      setShowPaymentDetails(methodInfo);
    }

    createDepositMutation.mutate({
      customerName,
      customerEmail,
      customerPhone,
      breedType: "Goldendoodle",
      amount: selectedMethod === "crypto" ? Math.round(depositAmount * 0.9 * 100) : depositInCents,
      paymentMethod: selectedMethod,
      paymentStatus: "pending",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Reserve Your Puppy
            </h1>
            <p className="text-muted-foreground">
              Place a deposit to secure your spot on our waitlist
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      data-testid="input-customer-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="john@example.com"
                      data-testid="input-customer-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(801) 555-1234"
                      data-testid="input-customer-phone"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PaymentMethodCard
                      method="paypal"
                      selected={selectedMethod === "paypal"}
                      onSelect={setSelectedMethod}
                      depositAmount={depositAmount}
                    />
                    <PaymentMethodCard
                      method="cashapp"
                      selected={selectedMethod === "cashapp"}
                      onSelect={setSelectedMethod}
                      depositAmount={depositAmount}
                    />
                    <PaymentMethodCard
                      method="zelle"
                      selected={selectedMethod === "zelle"}
                      onSelect={setSelectedMethod}
                      depositAmount={depositAmount}
                    />
                    <PaymentMethodCard
                      method="applepay"
                      selected={selectedMethod === "applepay"}
                      onSelect={setSelectedMethod}
                      depositAmount={depositAmount}
                    />
                    <PaymentMethodCard
                      method="crypto"
                      selected={selectedMethod === "crypto"}
                      onSelect={setSelectedMethod}
                      depositAmount={depositAmount}
                      cryptoDiscount={10}
                    />
                  </div>
                </CardContent>
              </Card>

              {selectedMethod === "paypal" && (
                <Card>
                  <CardHeader>
                    <CardTitle>PayPal Checkout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        Total: ${(depositWithFee / 100).toFixed(2)} (includes 3% processing fee)
                      </p>
                    </div>
                    <PayPalButton
                      amount={(depositWithFee / 100).toFixed(2)}
                      currency="USD"
                      intent="CAPTURE"
                      onSuccess={handlePayPalSuccess}
                      onError={() => {
                        toast({
                          title: "Payment Error",
                          description: "There was an error processing your payment",
                          variant: "destructive",
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {selectedMethod && selectedMethod !== "paypal" && (
                <Button
                  onClick={handleNonPayPalSubmit}
                  size="lg"
                  className="w-full"
                  disabled={createDepositMutation.isPending}
                  data-testid="button-submit-deposit"
                >
                  {createDepositMutation.isPending ? "Processing..." : "View Payment Details"}
                </Button>
              )}
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Deposit Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Amount</span>
                    <span className="font-semibold">${depositAmount}</span>
                  </div>
                  {selectedMethod === "paypal" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Processing Fee</span>
                        <span className="font-semibold">${((depositWithFee - depositInCents) / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-4 flex justify-between text-lg">
                        <span>Total</span>
                        <span className="font-bold">${(depositWithFee / 100).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {selectedMethod === "crypto" && (
                    <div className="border-t pt-4 flex justify-between text-lg">
                      <span>Total (10% OFF)</span>
                      <span className="font-bold text-green-600">${(depositAmount * 0.9).toFixed(2)}</span>
                    </div>
                  )}
                  {selectedMethod && selectedMethod !== "paypal" && selectedMethod !== "crypto" && (
                    <div className="border-t pt-4 flex justify-between text-lg">
                      <span>Total</span>
                      <span className="font-bold">${depositAmount}</span>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg space-y-2">
                    <p className="text-sm font-semibold">What's Next?</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>✓ Confirm your deposit</li>
                      <li>✓ We'll contact you with litter updates</li>
                      <li>✓ Select your puppy at 5 weeks</li>
                      <li>✓ Pay balance 2 weeks before pickup</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PaymentDetailsModal method={showPaymentDetails} onClose={() => setShowPaymentDetails(null)} />
      <Footer />
    </div>
  );
}
