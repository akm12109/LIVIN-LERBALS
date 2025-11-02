
import Image from "next/image";

export default function FoundersVisionPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-headline text-center font-bold mb-16">
            Founder&apos;s Vision For Starting The Group
        </h1>
        <div className="space-y-20 text-muted-foreground">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/beginning/800/600"
                alt="The Beginning"
                data-ai-hint="old storefront"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                The Beginning
              </h2>
              <p className="mt-4 text-left">
                The founder directors Mr Devinder Singh Rekhi, Amrit pal Singh
                Rekhi and Bhupinder Singh Rekhi started with distribution for a
                FMGC trading company Hindustan Lever Ltd for the Indirect
                Coverage markets and established themselves in the trade
                distribution reach to three districts and around 5000 outlets
                in a span of ten years. The experience of distribution with
                major FMCG companies like Hindustan Lever Ltd, Dabur India Ltd,
                Parle Biscuits Pvt Ltd, Godrej Home Products, L’Oreal, Balsara,
                Patanjali, Perfettie, NOKIA, Reliance Mobile and Blow plast
                (VIP Suitcase), Malpani Products Pvt Ltd made the directors
                confident in starting their own brand and distribute the
                product through the experienced channel. A hunt for the product
                started and after much study they decided to start an edible
                oil company. As they were distributors for Malpani products who
                were in the business of tobacco and Edible oil, an offer was
                made to take over the unit of edible oil from Malpani group and
                this led to the start of the manufacturing business of the
                group.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <Image
                src="https://picsum.photos/seed/vision-future/800/600"
                alt="Our Vision"
                data-ai-hint="modern factory"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:order-1 text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Our Vision
              </h2>
              <p className="mt-4 text-left">
                The Vision was quite clear, Our Product, Our brand and
                Distribution to the whole country……. The company has approached
                the market with the strategy of reverse integration and after
                achieving the target of Rs 2000 million are soon going to come
                up with a refining plant of 200-300 tons per day capacity. Our
                vision is to be globally recognized company to produce, source
                and market the best world class quality products by adopting
                world class latest environment friendly technology and to build
                strong brand loyal customer base for the years to come plus to
                build trust and healthy relations among our employees, our
                investors, our society.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/mission-global/800/600"
                alt="Our Mission"
                data-ai-hint="global trade"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Our Mission
              </h2>
              <p className="mt-4 text-left">
                The Company has diversified in various areas of human life
                through its ingress into a wide spectrum of sectors like Edible
                Oils, Indian Spices, Fresh Fruits &amp; Vegetables Exports,
                Herbal Personal Care Products, Ayurvedic Propriety Medicines,
                Dental Health Care, Construction and Bicycles. The company
                intends to be a global company through supplies of these
                products all over the world.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
