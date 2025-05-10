"use client";
import MainPageLinksGrid, { MainPageLinkItem } from "@/components/ui/MainPageLinksGrid";

const presetLinks: MainPageLinkItem[] = [
    { name: "Branches", link: "/dashboard/presets/branches" },
    { name: "Discounts", link: "/dashboard/presets/discounts" },
    { name: "Facility", link: "/dashboard/presets/facility" },
    { name: "Currencies", link: "/dashboard/presets/currencies" },
    { name: "Locations", link: "/dashboard/presets/locations" },
    { name: "Partners", link: "/dashboard/presets/partners" },
    { name: "Cancellations - Refunds", link: "/dashboard/presets/cancellations-refunds" }
];

export default function PresetsPage() {
    return <MainPageLinksGrid title="Presets" links={presetLinks} />;
}
