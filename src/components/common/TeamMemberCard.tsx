
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCircle } from "lucide-react";

type TeamMemberCardProps = {
  name: string;
  title: string;
  education?: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export function TeamMemberCard({ name, title, education, description, imageUrl, imageHint }: TeamMemberCardProps) {
  return (
    <Card className="flex flex-col text-center items-center h-full">
      <CardHeader className="pt-8">
        <Image
          src={imageUrl}
          alt={name}
          data-ai-hint={imageHint}
          width={150}
          height={150}
          className="rounded-full mx-auto shadow-lg"
        />
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <CardTitle className="font-headline text-xl mt-4">{name}</CardTitle>
        <p className="text-primary font-semibold">{title}</p>
        {education && <p className="text-sm text-muted-foreground mt-1">{education}</p>}
        <CardDescription className="mt-4 text-left flex-grow">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
