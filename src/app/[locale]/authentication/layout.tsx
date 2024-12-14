import AuthLayout from "@/components/AuthLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const resolvedParams = await params; // Ensure params is resolved

  return (
    <>
      <AuthLayout params={resolvedParams}>
        <main>{children}</main>
      </AuthLayout>
    </>
  );
}
