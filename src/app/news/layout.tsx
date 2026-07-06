import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Specials",
  description: "The latest news, events, and specials at Redz Restaurant in Mt Laurel, NJ — including Spirits After 4 and seasonal happenings.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
