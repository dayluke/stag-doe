"use client";

import { Leaf, UtensilsCrossed } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Section } from "@/components/ui/section";
import { siteConfig, type MenuOption } from "@/lib/site-config";

function MenuCard({ menu }: { menu: MenuOption }) {
  const Icon = menu.id === "vegetarian" ? Leaf : UtensilsCrossed;
  return (
    <article className="relative mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-sm">
      <span
        aria-hidden
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-accent/60 text-primary"
      >
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="mb-6 text-center">
        <h3 className="font-display text-2xl leading-none">{menu.title}</h3>
        {menu.subtitle ? (
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {menu.subtitle}
          </p>
        ) : null}
      </div>

      <ul className="mt-2 space-y-6">
        {menu.courses.map((course, i) => (
          <li key={course.name} className="relative pl-6">
            <h4 className="font-display text-base tracking-wide uppercase text-muted-foreground">
              {course.name}
            </h4>
            <p className="mt-1 text-foreground/90 leading-relaxed">
              {course.description}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function MenusSection() {
  return (
    <Section
      id="menus"
      eyebrow="What we'll be eating"
      title="The Menus"
      description="Swipe between the two menu options — please pick one for each person in your RSVP."
      tone="soft"
      containerClassName="max-w-4xl"
    >
      <div className="relative px-8">
        <Carousel opts={{ loop: true, align: "center" }}>
          <CarouselContent>
            {siteConfig.menus.map((menu) => (
              <CarouselItem key={menu.id}>
                <MenuCard menu={menu} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots />
        </Carousel>
      </div>
    </Section>
  );
}
