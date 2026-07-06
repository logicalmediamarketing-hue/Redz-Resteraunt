import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind Redz Restaurant — inspired American fare, craft cocktails, and warm hospitality inside the DoubleTree Suites in Mt Laurel, NJ.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
