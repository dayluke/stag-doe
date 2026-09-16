import { HeroSection } from "@/components/sections/hero-section";
import { DetailsSection } from "@/components/sections/details-section";
import { ItinerarySection } from "@/components/sections/itinerary-section";
import { HouseSection } from "@/components/sections/house-section";
import { TravelSection } from "@/components/sections/travel-section";
import { FoodDrinkSection } from "@/components/sections/food-drink-section";
import { WhatToBringSection } from "@/components/sections/what-to-bring-section";
import { CostsSection } from "@/components/sections/costs-section";
import { GoodToKnowSection } from "@/components/sections/good-to-know-section";
import { Footer } from "@/components/sections/footer";
import { RsvpCta } from "@/components/rsvp/rsvp-cta";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <DetailsSection />
      <ItinerarySection />
      <HouseSection />
      <TravelSection />
      <FoodDrinkSection />
      <WhatToBringSection />
      <CostsSection />
      <RsvpCta />
      <GoodToKnowSection />
      <Footer />
    </main>
  );
}
