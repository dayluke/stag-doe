/**
 * Edit this file to customise the invitation content.
 * It is the single source of truth for all copy, dates,
 * menu items, accommodation options, and gift registry links.
 */

export type MenuCourse = {
  name: string;
  description: string;
};

export type MenuOption = {
  id: "traditional" | "vegetarian" | (string & {});
  title: string;
  subtitle?: string;
  imageUrl?: string;
  courses: MenuCourse[];
};

export type Accommodation = {
  name: string;
  distance: string;
  priceRange?: string;
  description: string;
  url?: string;
  imageUrl?: string;
};

export type TimelineEntry = {
  time: string;
  title: string;
  description?: string;
};

export type GiftOption = {
  title: string;
  description: string;
  url: string;
  label: string;
};

export const siteConfig = {
  /* ---------------- Couple + headline ---------------- */
  brideFirstName: "Leanne",
  groomFirstName: "Luke",
  ampersand: "&",
  heroImageUrl: "252A7560.JPG", // "/hero-placeholder.svg",
  heroImageAlt: "Leanne and Luke",

  /* ---------------- Core info ---------------- */
  dateIso: "2027-09-15",
  dateHuman: "Saturday, 15th September 2027",
  timeArrival: "1:00 PM",
  timeCeremony: "1:30 PM",
  locationShort: "Clock Barn, Tufton Warren",
  venueShortName: "Clock Barn",
  venueAddress: "Tufton Warren, Whitchurch, Hampshire, RG28 7RB",
  venueMapUrl:
    "https://www.google.com/maps/search/?api=1&query=Clock+Barn+Tufton+Warren",

  /* ---------------- Menus ---------------- */
  menus: [
    {
      id: "traditional",
      title: "Traditional Menu",
      subtitle: "A British-garden inspired tasting",
      courses: [
        {
          name: "Starter",
          description:
            "Pressed pork belly and roasted chicken thighs",
        },
        {
          name: "Main",
          description:
            "Butterflied legs of lamb with rosemary and garlic served with roast potatoes & roasted parsnips, carrots and butternut squash",
        },
        {
          name: "Palate cleanser",
          description:
            "Strawberry and champagne sorbet",
        },
        {
          name: "Dessert",
          description:
            "Trio of desserts: Salted caramel brownie with ice cream, Strawberry and lemon tart, Vanilla and mango cheesecake",
        },
      ],
    },
    {
      id: "vegetarian",
      title: "Vegetarian Menu",
      subtitle: "Garden-forward and just as indulgent",
      courses: [
        {
          name: "Starter",
          description: "Ravioli of goat's cheese with cherry vine tomatoes",
        },
        {
          name: "Main",
          description:
            "Honey Nut Roast with grilled creamed corn and roast potatoes",
        },
        {
          name: "Palate cleanser",
          description:
            "Strawberry and champagne sorbet",
        },
        {
          name: "Dessert",
          description:
            "Trio of desserts: Salted caramel brownie with ice cream, Strawberry and lemon tart, Vanilla and mango cheesecake",
        },
      ],
    },
  ] satisfies MenuOption[],

  /* ---------------- Accommodation ---------------- */
  accommodation: [
    {
      name: "Farmhouse – Clock Barn",
      distance: "0 miles — at the venue",
      priceRange: "£",
      description:
        "The Farmhouse is a small house with 9 rooms onsite at Clock Barn. This has been booked for immediate family and the wedding party only. For other guests, we have detailed alternative accommodation options that are available both onsite and in nearby villages.",
      url: "#",
    },
    {
      name: "Rose Barn – Clock Barn",
      distance: "0 miles — at the venue",
      priceRange: "££",
      description:
        "Rose Barn rooms are located on the grounds of our beautiful venue. If you would prefer easy access to your room after carriages, then Rose Barn could be for you!",
      url: "#",
    },
    {
      name: "White Hart Hotel – Whitchurch",
      distance: "2.6 miles",
      priceRange: "££",
      description:
        "The White Hart hotel is located approximately 5 minutes away from the venue via car. It is located within Whitchurch, the closest village to our venue.",
      url: "https://whiteharthotelwhitchurch.co.uk/",
    },
    {
      name: "White Hart – Overton",
      distance: "6.3 miles",
      priceRange: "£££",
      description:
        "The White Hart Overton is located within our own village, just 15 minutes via car from the venue. ",
      url: "https://uphaminns.co.uk/inns/the-white-hart-overton/",
    },
  ] satisfies Accommodation[],

  /* ---------------- Dress code ---------------- */
  dressCode: {
    title: "Summer Pastels",
    description:
      "We can't wait to celebrate with you! When it comes to what to wear, we want everyone to feel wonderful and at ease, so choose an outfit that makes you feel your best while embracing the joyful and elegant spirit of our day. We're envisioning a beautiful palette of summer pastel tones — think lilacs, baby pinks, blues and butter yellows. Please kindly avoid wearing white or ivory to allow the bride to shine.",
  },

  /* ---------------- Timeline ---------------- */
  timeline: [
    { time: "1:00 PM", title: "Arrival", description: "Welcome drinks in the walled garden" },
    { time: "1:30 PM", title: "Ceremony", description: "Vows in the Orangery" },
    { time: "2:00 PM", title: "Drinks reception", description: "Canapés on the lawn" },
    { time: "3:30 PM", title: "Wedding breakfast", description: "Wedding breakfast in the Great Hall" },
    { time: "5:30 PM", title: "Speeches", description: "" },
    { time: "6:30 PM", title: "First dance", description: "Then the party starts" },
    { time: "8:00 PM", title: "Cake cutting and evening food", description: "" },
    { time: "11:00 PM", title: "Carriages", description: "Carriages at midnight" },
  ] satisfies TimelineEntry[],

  /* ---------------- Gifts / Registry ---------------- */
  gifts: {
    intro:
      "Your presence on the day is the best gift we could ask for. If you would like to contribute to our honeymoon or new home, we would be incredibly grateful.",
    options: [
      {
        title: "Honeymoon fund",
        description: "Help us disappear somewhere warm for a week or two.",
        url: "https://www.theknot.com/",
        label: "Contribute on The Knot",
      },
      {
        title: "Home together",
        description: "A curated list of little things for our new home.",
        url: "https://www.theknot.com/",
        label: "View registry",
      },
    ] satisfies GiftOption[],
  },

  /* ---------------- RSVP ---------------- */
  rsvpDeadlineHuman: "1st August 2027",
} as const;

export type SiteConfig = typeof siteConfig;
