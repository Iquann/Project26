import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Trash2, Edit2, Copy, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Puppy, Litter, MailingListEntry, Deposit } from "@shared/schema";

export default function Admin() {
  const [editingPuppy, setEditingPuppy] = useState<Puppy | null>(null);
  const [editingLitter, setEditingLitter] = useState<Litter | null>(null);
  const [activeTab, setActiveTab] = useState("puppies");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch puppies
  const { data: puppies = [], isLoading: puppiesLoading } = useQuery<Puppy[]>({
    queryKey: ["/api/puppies"],
  });

  // Fetch litters
  const { data: litters = [], isLoading: littersLoading } = useQuery<Litter[]>({
    queryKey: ["/api/litters"],
  });

  // Fetch mailing list
  const { data: mailingList = [], isLoading: mailingListLoading } = useQuery<MailingListEntry[]>({
    queryKey: ["/api/mailing-list"],
  });

  // Fetch deposits
  const { data: deposits = [], isLoading: depositsLoading } = useQuery<Deposit[]>({
    queryKey: ["/api/deposits"],
  });

  // Puppy mutations
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

  // Litter mutations
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage your puppies and litters</p>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 mb-8 flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">Admin Access</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">This is a protected area. Only authorized users should access this.</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="puppies">Puppies ({puppies.length})</TabsTrigger>
              <TabsTrigger value="litters">Litters ({litters.length})</TabsTrigger>
              <TabsTrigger value="emails">
                <Mail className="h-4 w-4 mr-2" />
                Emails ({mailingList.length + deposits.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="puppies">
              <div className="space-y-6">
                {editingPuppy && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Edit Puppy: {editingPuppy.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PuppyForm
                        puppy={editingPuppy}
                        onSubmit={(data) => updatePuppyMutation.mutate(data)}
                        isLoading={updatePuppyMutation.isPending}
                        onCancel={() => setEditingPuppy(null)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {puppiesLoading ? (
                    <p className="text-muted-foreground">Loading puppies...</p>
                  ) : puppies.length === 0 ? (
                    <p className="text-muted-foreground">No puppies found</p>
                  ) : (
                    puppies.map((puppy) => (
                      <Card key={puppy.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                {puppy.name}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Breed: {puppy.breed}</p>
                                <p>Color: {puppy.color}</p>
                                <p>Gender: {puppy.gender}</p>
                                <p>Price: ${puppy.price}</p>
                                <p>Status: {puppy.status}</p>
                                <p>Birth Date: {puppy.birthDate || "N/A"}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPuppy(puppy)}
                                data-testid={`button-edit-puppy-${puppy.id}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePuppyMutation.mutate(puppy.id)}
                                data-testid={`button-delete-puppy-${puppy.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                {editingLitter && (
                  <Card className="border-primary">
                    <CardHeader>
                      <CardTitle>Edit Litter: {editingLitter.motherName} x {editingLitter.fatherName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LitterForm
                        litter={editingLitter}
                        onSubmit={(data) => updateLitterMutation.mutate(data)}
                        isLoading={updateLitterMutation.isPending}
                        onCancel={() => setEditingLitter(null)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4">
                  {littersLoading ? (
                    <p className="text-muted-foreground">Loading litters...</p>
                  ) : litters.length === 0 ? (
                    <p className="text-muted-foreground">No litters found</p>
                  ) : (
                    litters.map((litter) => (
                      <Card key={litter.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                {litter.motherName} x {litter.fatherName}
                              </h3>
                              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                <p>Breed: {litter.breed}</p>
                                <p>Expected: {litter.expectedDate}</p>
                                <p>Spots: {litter.spotsAvailable}/{litter.totalSpots}</p>
                                <p>Price: ${litter.price}</p>
                                <p>Status: {litter.status}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingLitter(litter)}
                                data-testid={`button-edit-litter-${litter.id}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteLitterMutation.mutate(litter.id)}
                                data-testid={`button-delete-litter-${litter.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emails">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Mailing List Subscribers ({mailingList.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mailingListLoading ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : mailingList.length === 0 ? (
                      <p className="text-muted-foreground">No subscribers yet</p>
                    ) : (
                      <div className="space-y-2">
                        {mailingList.map((entry, idx) => (
                          <div
                            key={entry.id || idx}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover-elevate"
                          >
                            <div>
                              <p className="font-medium">{entry.email}</p>
                              <p className="text-sm text-muted-foreground">
                                Subscribed: {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "Unknown"}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText(entry.email);
                                toast({ title: "Copied", description: "Email copied to clipboard" });
                              }}
                              data-testid={`button-copy-email-${idx}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            const emails = mailingList.map((e) => e.email).join(", ");
                            navigator.clipboard.writeText(emails);
                            toast({ title: "Copied", description: "All emails copied to clipboard" });
                          }}
                          data-testid="button-copy-all-emails"
                        >
                          Copy All Emails
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Deposit Customers ({deposits.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {depositsLoading ? (
                      <p className="text-muted-foreground">Loading...</p>
                    ) : deposits.length === 0 ? (
                      <p className="text-muted-foreground">No deposits yet</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Name</th>
                              <th className="text-left p-2">Email</th>
                              <th className="text-left p-2">Phone</th>
                              <th className="text-left p-2">Breed</th>
                              <th className="text-left p-2">Amount</th>
                              <th className="text-left p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deposits.map((deposit, idx) => (
                              <tr key={deposit.id || idx} className="border-b hover:bg-muted/50">
                                <td className="p-2">{deposit.customerName}</td>
                                <td className="p-2">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(deposit.customerEmail);
                                      toast({ title: "Copied", description: "Email copied" });
                                    }}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                    data-testid={`button-copy-customer-email-${idx}`}
                                  >
                                    {deposit.customerEmail}
                                  </button>
                                </td>
                                <td className="p-2">{deposit.customerPhone || "N/A"}</td>
                                <td className="p-2">{deposit.breedType}</td>
                                <td className="p-2">${(deposit.amount / 100).toFixed(2)}</td>
                                <td className="p-2">
                                  <span
                                    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                      deposit.paymentStatus === "completed"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    }`}
                                  >
                                    {deposit.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <Button
                          className="w-full mt-4"
                          onClick={() => {
                            const emails = deposits.map((d) => d.customerEmail).join(", ");
                            navigator.clipboard.writeText(emails);
                            toast({ title: "Copied", description: "All customer emails copied" });
                          }}
                          data-testid="button-copy-all-customer-emails"
                        >
                          Copy All Customer Emails
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PuppyForm({
  puppy,
  onSubmit,
  isLoading,
  onCancel,
}: {
  puppy: Puppy;
  onSubmit: (data: Partial<Puppy>) => void;
  isLoading: boolean;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(puppy);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Breed</Label>
          <Input
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          />
        </div>
        <div>
          <Label>Color</Label>
          <Input
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label>Birth Date</Label>
          <Input
            value={formData.birthDate || ""}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            placeholder="Oct 15, 2024"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function LitterForm({
  litter,
  onSubmit,
  isLoading,
  onCancel,
}: {
  litter: Litter;
  onSubmit: (data: Partial<Litter>) => void;
  isLoading: boolean;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(litter);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Mother Name</Label>
          <Input
            value={formData.motherName}
            onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
          />
        </div>
        <div>
          <Label>Father Name</Label>
          <Input
            value={formData.fatherName}
            onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
          />
        </div>
        <div>
          <Label>Breed</Label>
          <Input
            value={formData.breed}
            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
          />
        </div>
        <div>
          <Label>Expected Date</Label>
          <Input
            value={formData.expectedDate}
            onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
          />
        </div>
        <div>
          <Label>Spots Available</Label>
          <Input
            type="number"
            value={formData.spotsAvailable}
            onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Total Spots</Label>
          <Input
            type="number"
            value={formData.totalSpots}
            onChange={(e) => setFormData({ ...formData, totalSpots: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Born">Born</SelectItem>
              <SelectItem value="Selection Open">Selection Open</SelectItem>
              <SelectItem value="Sold Out">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
