
import Image from "next/image";

export default function ChairmansMessagePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-headline text-center font-bold mb-12">
            Chairman's Message
        </h1>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <Image
                src="https://picsum.photos/seed/chairman/400/400"
                alt="Mr. Devinder Singh Rekhi, Founder Chairman"
                data-ai-hint="portrait man"
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
            </div>
            <div className="flex-grow space-y-4 text-muted-foreground">
              <p>
                We as a Group have performed consistently, over the last two and
                a half decades, since our inception in 1992. The Group has
                touched various areas of human life through its ingress into a
                wide spectrum of sectors like Edible Oils, Indian Spices,
                Personal Care Products, Herbal Products, Construction and
                Bicycles. We are fortunate to be in an industry dealing in
                products that will always be in demand.
              </p>
              <p>
                We will continue to create opportunities for our stakeholders,
                investors, partners and shareholders through the support of our
                consumers and that of our team of around 5000 members. Over
                the next few years, will invest more into R&D to create newer
                products and bring state of the art technology across all our
                verticals. We have never let our long-standing reputation and
                numerous commercial successes, make us complacent. We still
                continue to work with the same zeal and dedication that has
                made us what we are today.
              </p>
              <p>
                As a result of the positive growth in the economy,
                health-conscious consumers are willing to pay more for quality
                product. As we hold hands with you, we hope to charter and
                reach new heights in the coming years and work towards a
                better tomorrow for our nation and for the humanity as a whole
                – Lets strive hard every day to “Enhance Lives Globally”.
              </p>
            </div>
          </div>
          <div className="text-right mt-8">
            <p className="font-bold text-lg text-foreground">
              Mr. Devinder Singh Rekhi
            </p>
            <p className="text-sm text-muted-foreground">Founder Chairman</p>
          </div>
        </div>
    </div>
  );
}
