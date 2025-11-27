import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Pricing from "@/pages/Pricing";
import Puppies from "@/pages/Puppies";
import Schedule from "@/pages/Schedule";
import HealthGuarantee from "@/pages/HealthGuarantee";
import Goldendoodles from "@/pages/Goldendoodles";
import Bernedoodles from "@/pages/Bernedoodles";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/puppies" component={Puppies} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/health-guarantee" component={HealthGuarantee} />
      <Route path="/goldendoodles" component={Goldendoodles} />
      <Route path="/bernedoodles" component={Bernedoodles} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
