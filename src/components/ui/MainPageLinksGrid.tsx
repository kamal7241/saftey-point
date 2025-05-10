import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export interface MainPageLinkItem {
    name: string;
    link: string;
}

interface MainPageLinksGridProps {
    title: string;
    links: MainPageLinkItem[];
}

const toTranslationKey = (name: string) =>
    name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

export default function MainPageLinksGrid({ title, links }: MainPageLinksGridProps) {
    const t = useTranslations("nav");
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 capitalize">{t(toTranslationKey(title))}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {links.map((item, index) => (
                    <Link href={item.link} key={index}>
                        <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <h2 className="text-lg font-semibold capitalize">{t(toTranslationKey(item.name))}</h2>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}