import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Happy Hour",
  description: "Happy hour at Redz Restaurant in Mt Laurel, NJ — drink and appetizer specials Monday through Friday, 4-6pm.",
};

export default function HappyHourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
