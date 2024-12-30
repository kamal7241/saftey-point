import { PageHeaderProps } from "@/types/ui.types";
import Breadcrumb from "./ui/Breadcrumb";

export default function PageHeader({
  breadcrumbItems,
  title,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap">
      <div>
        <h1 className="py-1.5 text-2xl capitalize text-dark">{title}</h1>
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  );
}
