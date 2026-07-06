import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menus",
  description: "Explore the menus at Redz Restaurant in Mt Laurel, NJ — breakfast, dinner, and happy hour featuring inspired American fare.",
};

export default function MenusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
