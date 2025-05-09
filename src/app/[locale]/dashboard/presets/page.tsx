"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const presetLinks = [
  { name: "Branches", link: "/dashboard/presets/branches" },
  { name: "Discounts", link: "/dashboard/presets/discounts" },
  { name: "Facility", link: "/dashboard/presets/facility" },
  { name: "Currencies", link: "/dashboard/presets/currencies" },
  { name: "Locations", link: "/dashboard/presets/locations" },
  { name: "Partners", link: "/dashboard/presets/partners" },
  { name: "Cancellations - Refunds", link: "/dashboard/presets/cancellations-refunds" }
];

export default function PresetsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Presets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presetLinks.map((item, index) => (
          <Link href={item.link} key={index}>
            <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h2 className="text-lg font-semibold">{item.name}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
