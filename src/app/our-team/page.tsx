
import { Card, CardContent } from "@/components/ui/card";
import { TeamMemberCard } from "@/components/common/TeamMemberCard";

const teamMembers = [
  {
    name: "Mr. Devinder Singh Rekhi",
    title: "MD Chairperson",
    education: "Post Graduate MBA in Marketing and Management",
    description: "He has a distribution and management experience of more than 20 years. Working with world topmost companies in FMCG has been a wonderful asset for managing the financials, the personal relations and strategy formation for the company.",
    imageUrl: "https://picsum.photos/seed/devinder-rekhi/150/150",
    imageHint: "professional man portrait",
  },
  {
    name: "Mr. AmritPal Singh Rekhi",
    title: "Director Production",
    description: "He has a 20 years long experience in the technology field and manufacturing process and is responsible for the manufacturing of quality products.",
    imageUrl: "https://picsum.photos/seed/amritpal-rekhi/150/150",
    imageHint: "male executive portrait",
  },
  {
    name: "Mr. Bhupinder Singh Rekhi",
    title: "Chief Purchase and Sales Director",
    education: "Post Graduate MBA",
    description: "A good negotiator a management post graduate MBA has a special role in the company as Chief Purchase and Sales Director. His role is to negotiate for the best price and best quality products and market the end products through the distribution channel creating demand and an exclusive place in the competitive marketplace.",
    imageUrl: "https://picsum.photos/seed/bhupinder-rekhi/150/150",
    imageHint: "corporate man portrait",
  },
  {
    name: "Dr. Harpreet Kaur Rekhi",
    title: "Dental Surgeon",
    description: "Dental Surgeon with more than 25 years experience serving more than 50,000 patients. She is empanelled with ISP CNP and Nashik Muncipal Corportion.",
    imageUrl: "https://picsum.photos/seed/harpreet-rekhi/150/150",
    imageHint: "female doctor portrait",
  },
];

export default function OurTeamPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          Our Team
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Meet the dedicated professionals behind Rekhi Group.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.name} {...member} />
        ))}
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <CardContent className="text-center text-muted-foreground space-y-4 p-8">
            <h2 className="text-2xl font-headline text-foreground font-bold">Our Extended Family</h2>
          <p>
            Apart from this the company has around 20 staff and 50 workers working effortlessly to provide the best quality products keeping in the values of the company.
          </p>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Backbone of the Group</h3>
            <p>
              Rajeev Sachdev, Jagganath Kanawade, Datta Kale, Kishor Pawar, Deepak, Ratan, Pawar Madam, Vishal, Neeta are the backbone of the Group attached with the companys growth from years.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
