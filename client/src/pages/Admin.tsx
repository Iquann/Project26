import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, Trash2, Edit2, Copy, Mail, Settings, Plus, 
  Bell, Users, DollarSign, LogOut, Lock, Eye, EyeOff,
  CreditCard, Dog, Heart, Check, X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Puppy, Litter, MailingListEntry, Deposit, EmailSettings, PaymentMethod, Notification } from "@shared/schema";
import { apiRequest, queryClient as qc } from "@/lib/queryClient";

type AuthUser = {
  id: string;
  username: string;
  displayName: string | null;
  role: string;
};

type SafeUser = {
  id: string;
  username: string;
  displayName: string | null;
  role: string;
  isActive: boolean | null;
  createdAt: Date | null;
  lastLogin: Date | null;
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: authLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
  });

  const { data: needsSetup } = useQuery<{ needsSetup: boolean }>({
    queryKey: ["/api/auth/needs-setup"],
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (needsSetup?.needsSetup) {
    return <SetupScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AdminDashboard user={user} />;
}

function SetupScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setupMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; displayName: string }) => {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Setup failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/needs-setup"] });
      toast({ title: "Success", description: "Admin account created" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setupMutation.mutate({ username, password, displayName: displayName || username });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Welcome to Admin Setup
            </CardTitle>
            <CardDescription>
              Create your admin account to manage Timber Taylor Doodles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  data-testid="input-setup-display-name"
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  data-testid="input-setup-username"
                />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    data-testid="input-setup-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  data-testid="input-setup-confirm-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={setupMutation.isPending} data-testid="button-setup-submit">
                {setupMutation.isPending ? "Creating Account..." : "Create Admin Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Welcome back!", description: "Login successful" });
    },
    onError: (error: Error) => {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Admin Login
            </CardTitle>
            <CardDescription>
              Sign in to manage your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  data-testid="input-login-username"
                />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    data-testid="input-login-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-login-submit">
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function AdminDashboard({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [editingLitter, setEditingLitter] = useState<Litter | null>(null);
  const [creatingPuppy, setCreatingPuppy] = useState(false);
  const [creatingLitter, setCreatingLitter] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: puppies = [] } = useQuery<Puppy[]>({ queryKey: ["/api/puppies"] });
  const { data: litters = [] } = useQuery<Litter[]>({ queryKey: ["/api/litters"] });
  const { data: mailingList = [] } = useQuery<MailingListEntry[]>({ queryKey: ["/api/mailing-list"] });
  const { data: deposits = [] } = useQuery<Deposit[]>({ queryKey: ["/api/deposits"] });
  const { data: notifications = [] } = useQuery<Notification[]>({ queryKey: ["/api/notifications"] });
  const { data: paymentMethods = [] } = useQuery<PaymentMethod[]>({ queryKey: ["/api/payment-methods"] });
  const { data: allUsers = [] } = useQuery<SafeUser[]>({ 
    queryKey: ["/api/users"],
    enabled: user.role === "admin",
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingDeposits = deposits.filter(d => d.paymentStatus === "pending").length;
  const completedDeposits = deposits.filter(d => d.paymentStatus === "completed").length;

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Logged out", description: "See you soon!" });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const createPuppyMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/puppies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create puppy");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puppies"] });
      toast({ title: "Success", description: "Puppy created" });
      setCreatingPuppy(false);
    },
  });

  const updatePuppyMutation = useMutation({
    mutationFn: async (data: Partial<Puppy>) => {
      const res = await fetch(`/api/puppies/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update puppy");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puppies"] });
      toast({ title: "Success", description: "Puppy updated" });
      setEditingPuppy(null);
    },
  });

  const deletePuppyMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/puppies/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete puppy");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puppies"] });
      toast({ title: "Success", description: "Puppy deleted" });
    },
  });

  const createLitterMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/litters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create litter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/litters"] });
      toast({ title: "Success", description: "Litter created" });
      setCreatingLitter(false);
    },
  });

  const updateLitterMutation = useMutation({
    mutationFn: async (data: Partial<Litter>) => {
      const res = await fetch(`/api/litters/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update litter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/litters"] });
      toast({ title: "Success", description: "Litter updated" });
      setEditingLitter(null);
    },
  });

  const deleteLitterMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/litters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete litter");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/litters"] });
      toast({ title: "Success", description: "Litter deleted" });
    },
  });

  const canEdit = user.role === "admin" || user.role === "manager";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user.displayName || user.username}
                <Badge variant="secondary" className="ml-2">{user.role}</Badge>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setActiveTab("notifications")}
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={() => logoutMutation.mutate()} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 flex-wrap h-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="puppies">Puppies ({puppies.length})</TabsTrigger>
              <TabsTrigger value="litters">Litters ({litters.length})</TabsTrigger>
              <TabsTrigger value="deposits">Deposits ({deposits.length})</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="emails">Subscribers</TabsTrigger>
              <TabsTrigger value="notifications" className="relative">
                Alerts
                {unreadCount > 0 && <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>}
              </TabsTrigger>
              {user.role === "admin" && <TabsTrigger value="users">Users</TabsTrigger>}
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-elevate cursor-pointer" onClick={() => setActiveTab("puppies")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Dog className="h-10 w-10 text-primary" />
                      <div>
                        <p className="text-3xl font-bold">{puppies.length}</p>
                        <p className="text-muted-foreground">Total Puppies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" onClick={() => setActiveTab("litters")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Heart className="h-10 w-10 text-pink-500" />
                      <div>
                        <p className="text-3xl font-bold">{litters.length}</p>
                        <p className="text-muted-foreground">Active Litters</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" onClick={() => setActiveTab("deposits")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <DollarSign className="h-10 w-10 text-green-500" />
                      <div>
                        <p className="text-3xl font-bold">{completedDeposits}</p>
                        <p className="text-muted-foreground">Completed Deposits</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="hover-elevate cursor-pointer" onClick={() => setActiveTab("notifications")}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Bell className="h-10 w-10 text-orange-500" />
                      <div>
                        <p className="text-3xl font-bold">{pendingDeposits}</p>
                        <p className="text-muted-foreground">Pending Actions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {notifications.filter(n => !n.isRead).slice(0, 5).length > 0 && (
                <Card className="mt-8">
                  <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <CardTitle>Recent Alerts</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => markAllReadMutation.mutate()}>
                      Mark all read
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notifications.filter(n => !n.isRead).slice(0, 5).map(notif => (
                        <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <Bell className="h-5 w-5 text-orange-500 mt-0.5" />
                          <div>
                            <p className="font-medium">{notif.title}</p>
                            <p className="text-sm text-muted-foreground">{notif.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="puppies">
              <div className="space-y-6">
                {canEdit && (
                  <div className="flex justify-end">
                    <Button onClick={() => setCreatingPuppy(true)} data-testid="button-create-puppy">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Puppy
                    </Button>
                  </div>
                )}

                {creatingPuppy && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Add New Puppy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PuppyForm
                        onSubmit={(data) => createPuppyMutation.mutate(data)}
                        isLoading={createPuppyMutation.isPending}
                        onCancel={() => setCreatingPuppy(false)}
                      />
                    </CardContent>
                  </Card>
                )}

                {editingPuppy && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Edit Puppy: {editingPuppy.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PuppyForm
                        puppy={editingPuppy}
                        onSubmit={(data) => updatePuppyMutation.mutate({ ...data, id: editingPuppy.id })}
                        isLoading={updatePuppyMutation.isPending}
                        onCancel={() => setEditingPuppy(null)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {puppies.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        No puppies yet. Click "Add Puppy" to create your first listing.
                      </CardContent>
                    </Card>
                  ) : (
                    puppies.map((puppy) => (
                      <Card key={puppy.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                  {puppy.name}
                                </h3>
                                <Badge variant={
                                  puppy.status === "Available" ? "default" :
                                  puppy.status === "Reserved" ? "secondary" : "outline"
                                }>
                                  {puppy.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Breed: {puppy.breed}</p>
                                <p>Color: {puppy.color}</p>
                                <p>Gender: {puppy.gender}</p>
                                <p>Price: ${puppy.price}</p>
                              </div>
                            </div>
                            {canEdit && (
                              <div className="flex gap-2">
                                <Button size="icon" variant="outline" onClick={() => setEditingPuppy(puppy)} data-testid={`button-edit-puppy-${puppy.id}`}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => deletePuppyMutation.mutate(puppy.id)} data-testid={`button-delete-puppy-${puppy.id}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="litters">
              <div className="space-y-6">
                {canEdit && (
                  <div className="flex justify-end">
                    <Button onClick={() => setCreatingLitter(true)} data-testid="button-create-litter">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Litter
                    </Button>
                  </div>
                )}

                {creatingLitter && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Add New Litter</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LitterForm
                        onSubmit={(data) => createLitterMutation.mutate(data)}
                        isLoading={createLitterMutation.isPending}
                        onCancel={() => setCreatingLitter(false)}
                      />
                    </CardContent>
                  </Card>
                )}

                {editingLitter && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Edit Litter: {editingLitter.motherName} x {editingLitter.fatherName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LitterForm
                        litter={editingLitter}
                        onSubmit={(data) => updateLitterMutation.mutate({ ...data, id: editingLitter.id })}
                        isLoading={updateLitterMutation.isPending}
                        onCancel={() => setEditingLitter(null)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {litters.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        No litters yet. Click "Add Litter" to create your first listing.
                      </CardContent>
                    </Card>
                  ) : (
                    litters.map((litter) => (
                      <Card key={litter.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                  {litter.motherName} x {litter.fatherName}
                                </h3>
                                <Badge>{litter.status}</Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Breed: {litter.breed}</p>
                                <p>Expected: {litter.expectedDate}</p>
                                <p>Spots: {litter.spotsAvailable}/{litter.totalSpots}</p>
                                <p>Price: ${litter.price}</p>
                              </div>
                            </div>
                            {canEdit && (
                              <div className="flex gap-2">
                                <Button size="icon" variant="outline" onClick={() => setEditingLitter(litter)} data-testid={`button-edit-litter-${litter.id}`}>
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => deleteLitterMutation.mutate(litter.id)} data-testid={`button-delete-litter-${litter.id}`}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deposits">
              <DepositsTab deposits={deposits} canEdit={canEdit} />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentMethodsTab paymentMethods={paymentMethods} canEdit={canEdit} isAdmin={user.role === "admin"} />
            </TabsContent>

            <TabsContent value="emails">
              <EmailSubscribersTab mailingList={mailingList} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsTab notifications={notifications} onMarkAllRead={() => markAllReadMutation.mutate()} />
            </TabsContent>

            {user.role === "admin" && (
              <TabsContent value="users">
                <UsersTab users={allUsers} currentUserId={user.id} />
              </TabsContent>
            )}

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PuppyForm({ puppy, onSubmit, isLoading, onCancel }: {
  puppy?: Puppy;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: puppy?.name || "",
    breed: puppy?.breed || "Mini Goldendoodle",
    color: puppy?.color || "",
    gender: puppy?.gender || "Male",
    price: puppy?.price || 2500,
    status: puppy?.status || "Available",
    imageSrc: puppy?.imageSrc || "",
    birthDate: puppy?.birthDate || "",
    description: puppy?.description || "",
    weight: puppy?.weight || "",
    personality: puppy?.personality || "",
    vaccinated: puppy?.vaccinated || false,
    microchipped: puppy?.microchipped || false,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name *</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <Label>Breed *</Label>
          <Select value={formData.breed} onValueChange={(value) => setFormData({ ...formData, breed: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Mini Goldendoodle">Mini Goldendoodle</SelectItem>
              <SelectItem value="Teacup Goldendoodle">Teacup Goldendoodle</SelectItem>
              <SelectItem value="Mini Bernedoodle">Mini Bernedoodle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color *</Label>
          <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} required placeholder="e.g. Apricot, Cream" />
        </div>
        <div>
          <Label>Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Price ($) *</Label>
          <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} required />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Birth Date</Label>
          <Input value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} placeholder="Oct 15, 2024" />
        </div>
        <div>
          <Label>Weight</Label>
          <Input value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} placeholder="e.g. 12 lbs" />
        </div>
        <div className="col-span-full">
          <Label>Image URL</Label>
          <Input value={formData.imageSrc || ""} onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })} placeholder="https://..." />
        </div>
        <div className="col-span-full">
          <Label>Personality</Label>
          <Input value={formData.personality} onChange={(e) => setFormData({ ...formData, personality: e.target.value })} placeholder="e.g. Playful, Calm, Friendly" />
        </div>
        <div className="col-span-full">
          <Label>Description</Label>
          <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Tell customers about this puppy..." rows={3} />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.vaccinated} onCheckedChange={(checked) => setFormData({ ...formData, vaccinated: checked })} />
          <Label>Vaccinated</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.microchipped} onCheckedChange={(checked) => setFormData({ ...formData, microchipped: checked })} />
          <Label>Microchipped</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : puppy ? "Save Changes" : "Create Puppy"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function LitterForm({ litter, onSubmit, isLoading, onCancel }: {
  litter?: Litter;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    motherName: litter?.motherName || "",
    fatherName: litter?.fatherName || "",
    breed: litter?.breed || "Mini Goldendoodle",
    expectedDate: litter?.expectedDate || "",
    spotsAvailable: litter?.spotsAvailable || 6,
    totalSpots: litter?.totalSpots || 6,
    price: litter?.price || 2500,
    status: litter?.status || "Upcoming",
    description: litter?.description || "",
    imageSrc: litter?.imageSrc || "",
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Mother Name *</Label>
          <Input value={formData.motherName} onChange={(e) => setFormData({ ...formData, motherName: e.target.value })} required />
        </div>
        <div>
          <Label>Father Name *</Label>
          <Input value={formData.fatherName} onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })} required />
        </div>
        <div>
          <Label>Breed *</Label>
          <Select value={formData.breed} onValueChange={(value) => setFormData({ ...formData, breed: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Mini Goldendoodle">Mini Goldendoodle</SelectItem>
              <SelectItem value="Teacup Goldendoodle">Teacup Goldendoodle</SelectItem>
              <SelectItem value="Mini Bernedoodle">Mini Bernedoodle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Expected Date *</Label>
          <Input value={formData.expectedDate} onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })} required placeholder="January 2025" />
        </div>
        <div>
          <Label>Spots Available</Label>
          <Input type="number" value={formData.spotsAvailable} onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>Total Spots</Label>
          <Input type="number" value={formData.totalSpots} onChange={(e) => setFormData({ ...formData, totalSpots: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>Price ($) *</Label>
          <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} required />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Born">Born</SelectItem>
              <SelectItem value="Selection Open">Selection Open</SelectItem>
              <SelectItem value="Sold Out">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-full">
          <Label>Image URL</Label>
          <Input value={formData.imageSrc || ""} onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })} placeholder="https://..." />
        </div>
        <div className="col-span-full">
          <Label>Description</Label>
          <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : litter ? "Save Changes" : "Create Litter"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function DepositsTab({ deposits, canEdit }: { deposits: Deposit[]; canEdit: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateDepositMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/deposits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/deposits"] });
      toast({ title: "Updated", description: "Deposit status updated" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposits & Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {deposits.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No deposits yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Breed</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Method</th>
                  <th className="text-left p-3">Status</th>
                  {canEdit && <th className="text-left p-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{deposit.customerName}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(deposit.customerEmail);
                          toast({ title: "Copied" });
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {deposit.customerEmail}
                      </button>
                    </td>
                    <td className="p-3">{deposit.breedType}</td>
                    <td className="p-3 font-medium">${(deposit.amount / 100).toFixed(2)}</td>
                    <td className="p-3">{deposit.paymentMethod}</td>
                    <td className="p-3">
                      <Badge variant={deposit.paymentStatus === "completed" ? "default" : "secondary"}>
                        {deposit.paymentStatus}
                      </Badge>
                    </td>
                    {canEdit && (
                      <td className="p-3">
                        {deposit.paymentStatus === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => updateDepositMutation.mutate({ id: deposit.id, status: "completed" })}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateDepositMutation.mutate({ id: deposit.id, status: "failed" })}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentMethodsTab({ paymentMethods, canEdit, isAdmin }: { paymentMethods: PaymentMethod[]; canEdit: boolean; isAdmin: boolean }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Created" });
      setCreating(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/payment-methods/${data.method}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Updated" });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (method: string) => {
      const res = await fetch(`/api/payment-methods/${method}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({ title: "Deleted" });
    },
  });

  return (
    <div className="space-y-6">
      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" />Add Payment Method</Button>
        </div>
      )}

      {(creating || editing) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editing ? "Edit Payment Method" : "Add Payment Method"}</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodForm
              paymentMethod={editing || undefined}
              onSubmit={(data) => editing ? updateMutation.mutate(data) : createMutation.mutate(data)}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onCancel={() => { setCreating(false); setEditing(null); }}
              isEditing={!!editing}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {paymentMethods.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No payment methods configured</CardContent></Card>
        ) : (
          paymentMethods.map((pm) => (
            <Card key={pm.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{pm.displayName}</h3>
                        <Badge variant={pm.isActive ? "default" : "secondary"}>{pm.isActive ? "Active" : "Disabled"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pm.accountInfo || "No account info"}</p>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => setEditing(pm)}><Edit2 className="h-4 w-4" /></Button>
                      {isAdmin && (
                        <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(pm.method)}><Trash2 className="h-4 w-4" /></Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function PaymentMethodForm({ paymentMethod, onSubmit, isLoading, onCancel, isEditing }: {
  paymentMethod?: PaymentMethod;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
  isEditing: boolean;
}) {
  const [formData, setFormData] = useState({
    method: paymentMethod?.method || "",
    displayName: paymentMethod?.displayName || "",
    name: paymentMethod?.name || "",
    accountInfo: paymentMethod?.accountInfo || "",
    instructions: paymentMethod?.instructions || "",
    isActive: paymentMethod?.isActive ?? true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Method ID *</Label>
          <Input value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} required disabled={isEditing} placeholder="cashapp" />
        </div>
        <div>
          <Label>Display Name *</Label>
          <Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} required placeholder="Cash App" />
        </div>
        <div>
          <Label>Account Name</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" />
        </div>
        <div>
          <Label>Account Info (Tag/Email/Address)</Label>
          <Input value={formData.accountInfo} onChange={(e) => setFormData({ ...formData, accountInfo: e.target.value })} placeholder="$YourTag" />
        </div>
        <div className="col-span-full">
          <Label>Instructions</Label>
          <Textarea value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })} placeholder="Instructions for customers..." rows={2} />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function EmailSubscribersTab({ mailingList }: { mailingList: MailingListEntry[] }) {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Email Subscribers ({mailingList.length})</CardTitle>
        <Button onClick={() => {
          const emails = mailingList.map(e => e.email).join(", ");
          navigator.clipboard.writeText(emails);
          toast({ title: "Copied", description: "All emails copied" });
        }}>
          <Copy className="h-4 w-4 mr-2" />Copy All
        </Button>
      </CardHeader>
      <CardContent>
        {mailingList.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No subscribers yet</p>
        ) : (
          <div className="space-y-2">
            {mailingList.map((entry, idx) => (
              <div key={entry.id || idx} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{entry.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Joined: {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => {
                  navigator.clipboard.writeText(entry.email);
                  toast({ title: "Copied" });
                }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NotificationsTab({ notifications, onMarkAllRead }: { notifications: Notification[]; onMarkAllRead: () => void }) {
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Notifications</CardTitle>
        <Button variant="outline" onClick={onMarkAllRead}>Mark All Read</Button>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${!notif.isRead ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900" : ""}`}
              >
                <Bell className={`h-5 w-5 mt-0.5 ${!notif.isRead ? "text-blue-600" : "text-muted-foreground"}`} />
                <div className="flex-1">
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                {!notif.isRead && (
                  <Button size="sm" variant="ghost" onClick={() => markReadMutation.mutate(notif.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UsersTab({ users, currentUserId }: { users: SafeUser[]; currentUserId: string }) {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<SafeUser | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User Created" });
      setCreating(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/users/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User Updated" });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User Deleted" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" />Add User</Button>
      </div>

      {(creating || editing) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editing ? "Edit User" : "Add User"}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              user={editing || undefined}
              onSubmit={(data) => editing ? updateMutation.mutate({ ...data, id: editing.id }) : createMutation.mutate(data)}
              isLoading={createMutation.isPending || updateMutation.isPending}
              onCancel={() => { setCreating(false); setEditing(null); }}
              isEditing={!!editing}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {users.map((u) => (
          <Card key={u.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{u.displayName || u.username}</h3>
                      <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                      {!u.isActive && <Badge variant="destructive">Disabled</Badge>}
                      {u.id === currentUserId && <Badge variant="outline">You</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">@{u.username}</p>
                  </div>
                </div>
                {u.id !== currentUserId && (
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => setEditing(u)}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(u.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UserForm({ user, onSubmit, isLoading, onCancel, isEditing }: {
  user?: SafeUser;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
  isEditing: boolean;
}) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    displayName: user?.displayName || "",
    role: user?.role || "viewer",
    isActive: user?.isActive ?? true,
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Username *</Label>
          <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={isEditing} />
        </div>
        <div>
          <Label>{isEditing ? "New Password (leave blank to keep)" : "Password *"}</Label>
          <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!isEditing} />
        </div>
        <div>
          <Label>Display Name</Label>
          <Input value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin - Full access</SelectItem>
              <SelectItem value="manager">Manager - Can edit content</SelectItem>
              <SelectItem value="viewer">Viewer - Read only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
          <Label>Active</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : isEditing ? "Save Changes" : "Create User"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function SettingsTab() {
  const { data: emailSettings } = useQuery<EmailSettings>({ queryKey: ["/api/email-settings"] });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    senderEmail: "noreply@timbertaylordoodles.com",
    senderName: "Timber Taylor Doodles",
    provider: "sendgrid",
    apiKey: "",
  });

  useEffect(() => {
    if (emailSettings) {
      setFormData({
        senderEmail: emailSettings.senderEmail || "noreply@timbertaylordoodles.com",
        senderName: emailSettings.senderName || "Timber Taylor Doodles",
        provider: emailSettings.provider || "sendgrid",
        apiKey: emailSettings.apiKey || "",
      });
    }
  }, [emailSettings]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/email-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-settings"] });
      toast({ title: "Settings Saved" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure how emails are sent to customers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(formData); }} className="space-y-4 max-w-md">
          <div>
            <Label>Sender Email</Label>
            <Input value={formData.senderEmail} onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })} type="email" />
          </div>
          <div>
            <Label>Sender Name</Label>
            <Input value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} />
          </div>
          <div>
            <Label>Provider</Label>
            <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sendgrid">SendGrid</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="custom">Custom SMTP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>API Key / Password</Label>
            <Input type="password" value={formData.apiKey} onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })} placeholder="Your API key" />
          </div>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
