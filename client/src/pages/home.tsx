import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Syringe,
  Pill,
  Heart,
  Beaker,
  TrendingUp,
  Shield,
  Truck,
  FlaskConical,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import type { Product } from "@shared/schema";
import heroVideo from "@assets/generated_videos/pharmaceutical_molecules_in_blue_gold.mp4";
import heroPoster from "@assets/stock_images/abstract_3d_molecule_a664a06d.jpg";

const categories = [
  {
    name: "Injectables",
    slug: "injectables",
    icon: Syringe,
    description: "Premium injectable compounds",
    count: "18 products",
  },
  {
    name: "Orals",
    slug: "orals",
    icon: Pill,
    description: "Oral compounds",
    count: "17 products",
  },
  {
    name: "Post Cycle / Pharma",
    slug: "pct-pharma",
    icon: Heart,
    description: "PCT & pharmaceutical",
    count: "17 products",
  },
  {
    name: "Peptides",
    slug: "peptides",
    icon: Beaker,
    description: "Therapeutic peptides",
    count: "12 products",
  },
  {
    name: "Growth Hormone",
    slug: "growth-hormone",
    icon: TrendingUp,
    description: "HGH & growth factors",
    count: "5 products",
  },
];

const qualityBadges = [
  {
    icon: FlaskConical,
    title: "Lab Tested",
    description: "Every batch verified for purity",
  },
  {
    icon: Shield,
    title: "Pharmaceutical Grade",
    description: "Premium quality assurance",
  },
  {
    icon: Truck,
    title: "Discrete Shipping",
    description: "Secure, unmarked packaging",
  },
  {
    icon: CheckCircle,
    title: "Quality Guaranteed",
    description: "Satisfaction assured",
  },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", "featured"],
  });

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={heroPoster}
          className="absolute inset-0 w-full h-full object-cover"
          data-testid="hero-background-video"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 mb-6">
              <FlaskConical className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Premium Pharmaceutical Grade</span>
            </div>
            
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Premium Pharmaceutical
              <br />
              <span className="text-gold">Grade Products</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted source for lab-tested, pharmaceutical-grade compounds. 
              Every product verified for purity and potency.
            </p>
            
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gold text-black font-semibold"
                asChild
                data-testid="button-browse-catalog"
              >
                <Link href="/shop">
                  Browse Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border"
                asChild
                data-testid="button-contact-us"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold tracking-tight lg:text-3xl">
              Product Categories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse our complete selection of pharmaceutical products
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                data-testid={`link-category-${category.slug}`}
              >
                <Card className="group h-full card-hover-gold transition-all">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                      <category.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-medium text-foreground">{category.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.description}
                    </p>
                    <span className="mt-2 text-xs text-gold">{category.count}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-card/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight lg:text-3xl">
                Featured Products
              </h2>
              <p className="mt-1 text-muted-foreground">
                Popular selections from our catalog
              </p>
            </div>
            <Button variant="outline" asChild data-testid="link-view-all-products">
              <Link href="/shop">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featuredProducts?.slice(0, 8).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            {!isLoading && (!featuredProducts || featuredProducts.length === 0) && (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">
                  Products loading... Please check back shortly.
                </p>
                <Button className="mt-4 bg-gold text-black" asChild>
                  <Link href="/shop">Browse All Products</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl font-bold tracking-tight lg:text-3xl">
              Why Choose Us
            </h2>
            <p className="mt-2 text-muted-foreground">
              Commitment to quality and customer satisfaction
            </p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qualityBadges.map((badge) => (
              <div
                key={badge.title}
                className="flex flex-col items-center text-center rounded-lg border border-border bg-card p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 mb-4">
                  <badge.icon className="h-6 w-6 text-gold" />
                </div>
                <p className="font-medium text-foreground">{badge.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-card to-card/80 border border-gold/20 p-8 lg:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="font-heading text-2xl font-bold tracking-tight lg:text-3xl">
                Ready to Order?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Browse our complete catalog of pharmaceutical-grade products. 
                Contact us directly for inquiries and orders.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gold text-black font-semibold"
                  asChild
                  data-testid="button-browse-products"
                >
                  <Link href="/shop">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold/50 text-gold"
                  asChild
                  data-testid="button-contact-order"
                >
                  <Link href="/contact">Contact for Order</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
