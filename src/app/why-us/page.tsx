
import { Gem, ShieldCheck, Building } from "lucide-react";

export default function WhyUsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-headline text-center font-bold mb-12">Why Us?</h1>
        <div className="space-y-10 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Gem className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold font-headline text-foreground">
                Our Commitment
              </h2>
            </div>
            <p className="text-muted-foreground ml-12">
              The group believes in supplying best quality products with
              reasonable pricing. There will never be a compromise in the
              quality of the products the company under the group
              manufactures, sources and for the services it provides. We want
              all the consumers purchasing the products of our brand to be
              confident of the quality and assure them that the company shall
              supply the best, and with the latest technology the product with
              best quality can be provided with reasonable price.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold font-headline text-foreground">
                Quality Policy
              </h2>
            </div>
            <p className="text-muted-foreground ml-12">
              The company has its own Laboratory research team and follows the
              internationally accepted methods of quality checks and assures
              the consumers of the best quality. The company sources the best
              material around the Globe and maintains the highest quality
y
              parameters set. The Company is and ISO 9001 certified and GMP
              certified.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Building className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-semibold font-headline text-foreground">
                Infrastructure
              </h2>
            </div>
            <p className="text-muted-foreground ml-12">
              The company has various sate of the art infrastructure be it
              packing house, research and development, Laboratory, Warehousing
              etc. The total infrastructure is built with utmost quality
              checks and audits. The approximate area exceeds 30,000 Sqmt open
              land area and around 20,000 sq feet built up facility.
            </p>
          </div>
        </div>
    </div>
  );
}
