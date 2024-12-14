export const runtime = "edge";

import Companies from "@/components/pages/Companies";

  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  
  return (
    <div className="px-6 py-4">
      <Companies />
    </div>
  );
}
