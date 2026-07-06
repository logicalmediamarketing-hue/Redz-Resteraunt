import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banquets & Events",
  description: "Host your wedding, corporate event, or celebration at Redz Restaurant in Mt Laurel, NJ. Flexible banquet spaces and custom menus for groups of all sizes.",
};

export default function BanquetsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
