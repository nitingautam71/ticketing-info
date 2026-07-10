import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // SQLite doesn't support `skipDuplicates` on createMany, so guard on count instead
  // (safe to re-run without erroring, though it won't pick up content edits after first seed).
  const existingFaqs = await prisma.faqEntry.count();
  if (existingFaqs > 0) {
    console.log('FAQs already seeded, skipping.');
  } else {
    await prisma.faqEntry.createMany({
      data: [
        {
          category: 'Booking',
          question: 'How do I complete a booking?',
          answer:
            'Search and shortlist what you want, then submit an enquiry, call us, or message us on WhatsApp. One of our travel consultants confirms availability and pricing with you directly and completes the booking — we do not yet take online payments.',
          sortOrder: 1,
        },
        {
          category: 'Booking',
          question: 'Is the pricing I see final?',
          answer:
            'Displayed prices are indicative starting fares pulled from our search partners. Final pricing is confirmed by a consultant once your exact dates, fare class, and add-ons are locked in.',
          sortOrder: 2,
        },
        {
          category: 'Support',
          question: "What's the fastest way to reach a human?",
          answer: 'WhatsApp and phone are both monitored during business hours and are the fastest way to get a same-day response.',
          sortOrder: 3,
        },
      ],
    });
  }

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials > 0) {
    console.log('Testimonials already seeded, skipping.');
  } else {
    await prisma.testimonial.createMany({
      data: [
        {
          name: 'Amelia R.',
          location: 'London, UK',
          quote: 'Booked a last-minute business trip to Dubai over WhatsApp in under an hour. Genuinely easier than the big booking sites.',
          rating: 5,
          published: true,
        },
        {
          name: 'Daniel K.',
          location: 'Toronto, Canada',
          quote: 'The team sorted flights, hotel, and an airport transfer for our honeymoon as one package. Great communication throughout.',
          rating: 5,
          published: true,
        },
      ],
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
