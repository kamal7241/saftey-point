export const runtime = "edge";

export default function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  
  return <h1>staff-management</h1>
  }