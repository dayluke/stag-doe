import { HeroSection } from "@/components/sections/hero-section";
import { DetailsSection } from "@/components/sections/details-section";
import { MenusSection } from "@/components/sections/menus-section";
import { AccommodationSection } from "@/components/sections/accommodation-section";
import { VenueSection } from "@/components/sections/venue-section";
import { DressCodeSection } from "@/components/sections/dress-code-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { GiftsSection } from "@/components/sections/gifts-section";
import { Footer } from "@/components/sections/footer";
import { RsvpCta } from "@/components/rsvp/rsvp-cta";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <DetailsSection />
      <MenusSection />
      <AccommodationSection />
      <VenueSection />
      <DressCodeSection />
      <TimelineSection />
      <RsvpCta />
      <GiftsSection />
      <Footer />
    </main>
  );
}
