import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Dining",
  description: "Intimate private dining rooms at Redz Restaurant in Mt Laurel, NJ — perfect for business dinners, rehearsal dinners, and special occasions.",
};

export default function PrivateDiningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
