import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState({
    miniGoldendoodles: false,
    teacupGoldendoodles: false,
    miniBernedoodles: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const subscriptionMutation = useMutation({
    mutationFn: async (data: { email: string; miniGoldendoodles: boolean; teacupGoldendoodles: boolean; miniBernedoodles: boolean }) => {
      const res = await fetch("/api/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to subscribe");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You've been added to our mailing list!",
      });
      setEmail("");
      setInterests({
        miniGoldendoodles: false,
        teacupGoldendoodles: false,
        miniBernedoodles: false,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    subscriptionMutation.mutate({
      email,
      miniGoldendoodles: interests.miniGoldendoodles,
      teacupGoldendoodles: interests.teacupGoldendoodles,
      miniBernedoodles: interests.miniBernedoodles,
    });
  };

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Contact Us
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <a href="tel:801-600-3204" className="flex items-center gap-2 hover:text-foreground transition-colors" data-testid="link-footer-phone">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>801-600-3204</span>
              </a>
              <a href="mailto:timbertaylordoodles@gmail.com" className="flex items-center gap-2 hover:text-foreground transition-colors" data-testid="link-footer-email">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>timbertaylordoodles@gmail.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>West Ogden, UT</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/goldendoodles" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-goldendoodles">
                Goldendoodles
              </Link>
              <Link href="/bernedoodles" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-bernedoodles">
                Bernedoodles
              </Link>
              <Link href="/puppies" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-puppies">
                Available Puppies
              </Link>
              <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-pricing">
                Pricing
              </Link>
              <Link href="/health-guarantee" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-guarantee">
                Health Guarantee
              </Link>
              <Link href="/schedule" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-schedule">
                Puppy Schedule
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Join Our Mailing List
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">I'm interested in:</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mini-goldendoodles"
                      checked={interests.miniGoldendoodles}
                      onCheckedChange={(checked) => setInterests(prev => ({ ...prev, miniGoldendoodles: !!checked }))}
                      data-testid="checkbox-mini-goldendoodles"
                    />
                    <Label htmlFor="mini-goldendoodles" className="text-sm">Mini Goldendoodles</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="teacup-goldendoodles"
                      checked={interests.teacupGoldendoodles}
                      onCheckedChange={(checked) => setInterests(prev => ({ ...prev, teacupGoldendoodles: !!checked }))}
                      data-testid="checkbox-teacup-goldendoodles"
                    />
                    <Label htmlFor="teacup-goldendoodles" className="text-sm">Teacup Goldendoodles</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mini-bernedoodles"
                      checked={interests.miniBernedoodles}
                      onCheckedChange={(checked) => setInterests(prev => ({ ...prev, miniBernedoodles: !!checked }))}
                      data-testid="checkbox-mini-bernedoodles"
                    />
                    <Label htmlFor="mini-bernedoodles" className="text-sm">Mini Bernedoodles</Label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  data-testid="input-email"
                  disabled={subscriptionMutation.isPending}
                />
                <Button 
                  type="submit" 
                  data-testid="button-subscribe"
                  disabled={subscriptionMutation.isPending}
                >
                  {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2010 - {new Date().getFullYear()}, Timber Taylor Doodles, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
