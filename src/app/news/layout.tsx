import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News, Happy Hour & Private Dining",
  description:
    "Discover Happy Hour, private dining, events, and current specials at Redz Restaurant in Mt Laurel, NJ.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
