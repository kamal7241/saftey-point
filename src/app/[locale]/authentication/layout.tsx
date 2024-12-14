import AuthLayout from "@/components/AuthLayout";

export default function Layout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: { locale: string }
}) {
  return (
    <>
      <AuthLayout params={params}>
        <main>{children}</main>
      </AuthLayout>
    </>
  )
}