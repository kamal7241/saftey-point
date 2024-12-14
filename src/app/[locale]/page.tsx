export const runtime = "edge";

import NotDevelopedYet from "@/components/NotDevelopedYet";

  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <NotDevelopedYet />
    </div>
  );
}
