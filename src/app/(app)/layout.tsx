import { redirect } from "next/navigation";
import { AppFooter } from "@/components/shell/footer";
import { MobileNav } from "@/components/shell/mobile-nav";
import { Navbar } from "@/components/shell/navbar";
import { Sidebar } from "@/components/shell/sidebar";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated visitors, but this is a
  // cheap second guard in case this layout is ever reached directly.
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, country")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <Sidebar
        userName={profile?.name ?? user.email ?? "Builder"}
        userRole={profile?.role ?? ""}
        onSignOut={signOut}
      />
      <div className="min-w-0">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-5 sm:px-6 md:pb-8 md:pt-6">
          {children}
        </main>
        <MobileNav />
        <AppFooter />
      </div>
    </div>
  );
}