
'use client';

import { TimelineItem } from '@/components/common/TimelineItem';

const timelineData = [
  {
    year: '1992',
    title: 'R.P.REKHI AND SONS',
    description:
      'Brokerage House Edible Oil, Exporters Fruits and Vegetables',
  },
  {
    year: '2002',
    title: 'REKHI PRODUCTS PVT LTD',
    description: 'Manufacturers Refined Edible Oil and Spices Brand UTSAV',
  },
  {
    year: '2006',
    title: 'SIMMAR DEVELOPERS',
    description:
      'Commercial and Residential Projects over 1,00,000 sq feet. Warehousing and Logistics support with more than 30,000 sq feet',
  },
  {
    year: '2012',
    title: 'LIVIN SOURCES INDIA PVT LTD',
    description:
      'Manufacturers Herbal Foot Spray, Body Spray and other personal Ayurvedic products under the brand name "LIVIN HERBALS"',
  },
  {
    year: '2020',
    title: 'THE CYCLE STOP',
    description: '“BLACKWOLF” BICYCLE MANUFACTURERS AND HERO CYCLES EBO',
  },
];

export default function EstablishmentYearPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          Our Journey Through the Years
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          The company initialised operations in the year 1992 and expanded with
          the addition of the following ventures.
        </p>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border"></div>
        <div className="space-y-16">
          {timelineData.map((item, index) => (
            <TimelineItem
              key={index}
              year={item.year}
              title={item.title}
              description={item.description}
              align={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
