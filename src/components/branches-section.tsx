import { useLanguage } from "@/lib/language-context";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function BranchesSection() {
  const { t, language } = useLanguage();

  const { data: branches, isLoading } = useQuery({
    queryKey: ['/api/branches'],
    queryFn: async () => {
      const response = await fetch('/api/branches');
      if (!response.ok) throw new Error('Failed to fetch branches');
      return response.json();
    },
  });

  const activeBranches = branches?.filter((branch: any) => branch.isActive) || [];

  if (isLoading) {
    return (
      <section id="branches" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("Toimipisteemme", "Our Branches")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeBranches || activeBranches.length === 0) {
    return null;
  }

  return (
    <section id="branches" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("Toimipisteemme", "Our Branches")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Palvelemme sinua useammassa toimipisteessä. Valitse lähin ravintola tilauksen yhteydessä.",
              "We serve you at multiple locations. Choose the nearest restaurant when placing your order."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {activeBranches.map((branch: any) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {language === "fi" ? branch.name : branch.nameEn}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{branch.address}</div>
                      <div>{branch.postalCode} {branch.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <a href={`tel:${branch.phone}`} className="hover:text-primary transition-colors">
                      {branch.phone}
                    </a>
                  </div>

                  {branch.email && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-5 h-5 flex-shrink-0" />
                      <a href={`mailto:${branch.email}`} className="hover:text-primary transition-colors">
                        {branch.email}
                      </a>
                    </div>
                  )}

                  {branch.openingHours && (
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        {t("Aukioloajat", "Opening Hours")}
                      </div>
                    </div>
                  )}
                </div>

                {(branch.latitude && branch.longitude) && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {t("Näytä kartalla", "View on Map")}
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
