export type ItineraryIcon =
  | "arrival"
  | "movie"
  | "bike"
  | "pub"
  | "cocktails"
  | "pizza"
  | "waterpark"
  | "bbq"
  | "murder-mystery"
  | "tidy-up"
  | "departure";

export type ItineraryEvent = {
  time: string;
  title: string;
  icon: ItineraryIcon;
};

export type ItineraryDay = {
  id: string;
  day: string;
  subtitle?: string;
  events: ItineraryEvent[];
};

export type Room = {
  name: string;
  sleeps: string;
  note?: string;
};

export type TravelIcon = "car" | "train" | "lift";

export type TravelOption = {
  icon: TravelIcon;
  title: string;
  description: string;
};

export type PackingIcon =
  | "swim"
  | "bike"
  | "shoes"
  | "costume"
  | "drink"
  | "towel"
  | "wallet"
  | "misc";

export type PackingItem = {
  icon: PackingIcon;
  title: string;
  description: string;
};

export type CostItem = {
  title: string;
  amount: string;
  description: string;
};

export type HouseRule = {
  title: string;
  description: string;
};

export type Contact = {
  name: string;
  role: string;
  phone?: string;
};

export type NightId = "friday" | "saturday" | "sunday";

export type Night = {
  id: NightId;
  label: string;
};

const arriveTime = "7:00 PM";
const leaveTime = "10:00 AM";
const arriveHuman = `${arriveTime} on Friday`;
const leaveHuman = `${leaveTime} on Monday`;

export const siteConfig = {
  /* ---------------- Who + headline ---------------- */
  brideFirstName: "Leanne",
  groomFirstName: "Luke",
  ampersand: "&",
  heroImageUrl: "HYM46132-1-3971303082.jpg", // "/hero-placeholder.svg",
  heroImageAlt: "Leanne and Luke",

  /* ---------------- Core info ---------------- */
  dateIso: "2027-08-27",
  dateHuman: "Friday 27th – Monday 30th August 2027",
  arriveHuman,
  leaveHuman,
  locationShort: "Lymington, The New Forest",

  /* ---------------- Itinerary ---------------- */
  itinerary: [
    {
      id: "friday",
      day: "Friday",
      subtitle: "Day one",
      events: [
        { time: `${arriveTime}`, title: "Arrive", icon: "arrival" },
        { time: "8:00 PM", title: "Movie night", icon: "movie" },
      ],
    },
    {
      id: "saturday",
      day: "Saturday",
      subtitle: "Day two",
      events: [
        { time: "11:00 AM", title: "Bike ride", icon: "bike" },
        { time: "1:00 PM", title: "Pub lunch", icon: "pub" },
        { time: "3:00 PM", title: "Cocktail masterclass", icon: "cocktails" },
        { time: "7:00 PM", title: "Pizza oven", icon: "pizza" },
      ],
    },
    {
      id: "sunday",
      day: "Sunday",
      subtitle: "Day three",
      events: [
        { time: "11:00 AM", title: "New Forest Water Park", icon: "waterpark" },
        { time: "6:00 PM", title: "BBQ", icon: "bbq" },
        { time: "8:00 PM", title: "Murder mystery night", icon: "murder-mystery" },
      ],
    },
    {
      id: "monday",
      day: "Monday",
      subtitle: "Day four",
      events: [
        { time: "8:00 AM", title: "Tidy up", icon: "tidy-up" },
        { time: `${leaveTime}`, title: "Leave", icon: "departure" },
      ],
    },
  ] satisfies ItineraryDay[],

  /* ---------------- The house ---------------- */
  house: {
    name: "Durns",
    tagline: "A gorgeous, large house to ourselves in the New Forest",
    description:
    "It sleeps 12 people, and has 6 bedrooms. The Ground Floor has a sitting room, dining room, reception hall, and kitchen. The First Floor has 3 double bedrooms. The Second Floor has the loft bedroom, snug, and large bathroom.",
    listingUrl: "", // TODO: optional Airbnb / booking link
    rooms: [
      { name: "Room 1", sleeps: "First Floor", note: "Luke & Leanne" },
      { name: "Room 2", sleeps: "First Floor", note: "Nikki & David" },
      { name: "Room 3", sleeps: "First Floor", note: "Ben & Emma" },
      { name: "Loft Bedroom", sleeps: "Second Floor", note: "Sleeps up to 8" },
      { name: "The Cabin", sleeps: "Shepard's Hut", note: "Alex & Kian" },
      // George, Rich, Sian, Ollie? ( + Lucy?)
    ] satisfies Room[],
    provided: [
      "Towels, shampoo, conditioner and bodywash",
      "Well-stocked pantry (tea, coffee, etc.)",
      "Wellies and picnic blankets",
      "10 adult bikes & helmets",
      "Pool table, dart board, table tennis and garden games",
      "Pizza oven and BBQ",
    ],
  },

  /* ---------------- Getting there ---------------- */
  travel: {
    address: "Durns, Rope Hill, Boldre, Hampshire, SO41 8NE",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=durns+lymore+new+forest",
    intro: `Arrive from ${arriveHuman} — earlier if you fancy helping set up.`,
    options: [
      {
        icon: "car",
        title: "By car",
        description:
          "There's parking for 6 cars at the house. Roughly 30 mins from Southampton, 2.5 hrs from Gloucester, and 3.5 hrs from Cambridge.",
      },
      {
        icon: "train",
        title: "By train",
        description:
          "Nearest station is Brockenhurst, about 10 minutes away by bus. Alternatively, tell us your arrival time and we can try to collect you.",
      },
      {
        icon: "lift",
        title: "Lifts",
        description:
          "If you're unable to drive or catch public transport, then please let us know in your RSVP and we’ll try and arrange someone to collect you.",
      },
    ] satisfies TravelOption[],
  },

  /* ---------------- Food and drink ---------------- */
  foodAndDrink: {
    intro:
      "We've got breakfast and dinners sorted, but lunches and drinks are on you.",
    covered: [
      "Friday — arriving after dinner, but we'll have snacks for the movie night",
      "Saturday — breakfast, and pizza from the oven in the evening",
      "Sunday — breakfast and the BBQ", // TODO: Lunch for Sunday
      "Monday — breakfast before we head off",
      "Tea, coffee, snacks and soft drinks throughout",
    ],
    byo: [
      "Your own booze for the weekend",
      "Saturday’s pub lunch — pay for your own on the day",
      "Sunday's lunch at the water park",
      "Anything you specifically can’t live without",
    ],
    note:
      "Allergies or anything you don’t eat? Tell us in your RSVP and we’ll sort it.",
  },

  /* ---------------- What to bring ---------------- */
  packing: {
    intro: "The house comes with a lot of the necessaries, but don't forget to bring these!",
    items: [
      {
        icon: "swim",
        title: "Might be cold without them",
        description:
          "Swimwear and towels for the water park and swimming pool.",
      },
      {
        icon: "shoes",
        title: "There's a snake in my boot",
        description: "Pack shoes that you can ride and walk in — the New Forest can get muddy.",
      },
      {
        icon: "costume",
        title: "It's not a dress, it's a kilt",
        description:
          "TODO — characters go out roughly a week before, so you’ll know who you’re dressing as.",
      },
      {
        icon: "drink",
        title: "Martini shaken, not stirred",
        description: "Bring your own drinks, whether that be alcoholic or not. Nearest supermarket is 10-mins away.",
      },
    ] satisfies PackingItem[],
  },

  /* ---------------- The costs ---------------- */
  costs: {
    intro:
      "Everything below is split evenly. Here’s exactly what you’re paying for.",
    perPerson: "£180",
    items: [
      {
        title: "The house",
        amount: "£70", // TODO: is £70 each enough???
        description: "Three nights, split between everyone staying.",
      },
      {
        title: "Food kitty",
        amount: "£25", // TODO: £4pp breakfast each day (£12 total), £7pp BBQ, £6pp pizza night
        description: "Breakfasts, the pizza night, the BBQ and everything in between.",
      },
      {
        title: "Activities",
        amount: "£85", // TODO: £60pp for cocktail masterclass, £22pp for water park
        description: "2-hour cocktail masterclass, and a 1-hour water park session (doesn't include wetsuit).",
      },
    ] satisfies CostItem[],
    notIncluded: [
      "Saturday’s pub lunch",
      "Sunday's water park lunch",
      "Your own drinks",
      "Getting there",
    ],
    payment: {
      label: "Pay your share",
      url: "https://settleup.starlingbank.com/luke-day-leanne-newman-4bcac9",
      method: "Pay using the link below or our bank account details:",
      reference: "Account Number: 88213601, Sort Code: 60-83-71",
      deadlineHuman: "at least 1 month before",
      note: "",
    },
  },

  /* ---------------- Good to know ---------------- */
  goodToKnow: {
    rules: [
      {
        title: "Quiet after 11pm",
        description: "We need to try and keep noise to a minimum before 7:30AM and after 10:00PM.",
      },
      {
        title: "No smoking",
        description: "Smoking is strictly prohibited within the property. But it says nothing about edibles...",
      },
      {
        title: "Leave it as we found it",
        description:
          "Items to be put back in place, rubbish in bins, washing up done & put away, and beds to be stripped.",
      }, // 
    ] satisfies HouseRule[],
    contacts: [
      { name: "Leanne", role: "Organiser", phone: "TODO" },
      { name: "Luke", role: "Organiser", phone: "TODO" },
    ] satisfies Contact[],
    groupChatUrl: "https://wa.me/447402904746",
  },

  /* ---------------- RSVP ---------------- */
  rsvpDeadlineHuman: "March 2027",
  nights: [
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ] satisfies Night[],
} as const;

export type SiteConfig = typeof siteConfig;
