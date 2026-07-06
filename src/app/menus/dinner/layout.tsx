import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dinner Menu",
  description: "Redz Restaurant's dinner menu in Mt Laurel, NJ — prime steaks, fresh seafood, signature burgers, and craft cocktails served Mon-Sat 4-10pm, Sun 5-9pm.",
};

export default function DinnerMenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
