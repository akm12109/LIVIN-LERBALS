
import Image from "next/image";

export default function AboutRekhiGroupPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-3xl font-headline text-center mb-16 font-bold">
            About Rekhi Group
        </h1>
        <div className="space-y-20 text-muted-foreground">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/quality/800/600"
                alt="Quality and Integrity"
                data-ai-hint="quality certificate"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Quality and Integrity
              </h2>
              <p className="mt-4 text-left">
                REKHI GROUP is always committed to quality and integrity, and
                that’s what reflects in our products that never fail to delight
                our customers. With a single goal of offering our customers a
                superior range of products that they can choose as per their
                needs. In that quest, we have broadened our business horizons by
                introducing various needs of Quality Living.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <Image
                src="https://picsum.photos/seed/ambition/800/600"
                alt="Global Ambitions"
                data-ai-hint="global map"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:order-1 text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Global Ambitions
              </h2>
              <p className="mt-4 text-left">
                We are an Indian conglomerate with international footprint and
                global ambitions. The group has in the recent past successfully
                undertaken the growth strategy of capacity expansion, green
                field projects and acquisitions, thus creating an unchallenged
                competitive advantage. With secured raw material supply source,
                'near to customer' sales points and a robust distribution and
                dealer network, we are creating market and brand leadership.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/innovation/800/600"
                alt="Innovation and Technology"
                data-ai-hint="modern laboratory"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Innovation &amp; R&amp;D
              </h2>
              <p className="mt-4 text-left">
                Despite the considerable success the company has achieved, it
                continues to invest substantial resources in exploring sourcing
                and adopting the latest technological advancements in various
                field which is what enables their R&amp;D to constantly come
                up with new, innovative solutions.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:order-2">
              <Image
                src="https://picsum.photos/seed/teamwork/800/600"
                alt="Human Resources"
                data-ai-hint="team meeting"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:order-1 text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Our People
              </h2>
              <p className="mt-4 text-left">
                Equal importance is given to the development of the company’s
                human resource. REKHI GROUP has always recruited the best
                talent available in the industry – people with years of
                expertise and experience behind them. Moreover, frequent
                in-house training sessions are conducted in all departments – be
                it Production or Accounts or Sales &amp; Marketing – to not just
                increase their knowledge base but also improve their skills.
                This self–reliance not only boosts morale and confidence, but
                also contributes towards a healthier bottom line.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="https://picsum.photos/seed/reputation/800/600"
                alt="Reputation and Vision"
                data-ai-hint="handshake deal"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-semibold font-headline text-foreground inline-block border-b-2 border-primary pb-1">
                Vision &amp; Values
              </h2>
              <p className="mt-4 text-left">
                With the immense experienced personal in the Group, REKHI GROUP
                has earned a solid reputation for its vision, entrepreneurial
                spirit and competitive edge. But the focus on the commercial
                aspects of their ventures has not made the company lose their
                human touch. The organization cares for its people, as much as
                it does for its products. And when we say ‘people’, we refer to
                all its stakeholders: the staff, suppliers, clients,
                shareholders…all the way to its end-users –the customers, More
                so, as their products are meant for human consumption human use.
              </p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <h3 className="text-2xl font-semibold font-headline text-foreground mb-2">
              Company's MOTTO
            </h3>
            <p className="italic text-lg">
              &quot;HUM-TUM approach for a better LIVIN healthier and quality Green
              life with equality to all.&quot;
            </p>
          </div>

          <p className="text-center">
            The Group has not only expanded its business through integration and
            market penetration, but also diversified into various sectors.
          </p>
        </div>
    </div>
  );
}
