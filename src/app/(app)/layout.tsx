import { redirect } from "next/navigation";
import { AppFooter } from "@/components/shell/footer";
import { MobileNav } from "@/components/shell/mobile-nav";
import { Navbar } from "@/components/shell/navbar";
import { Sidebar } from "@/components/shell/sidebar";
import { signOut } from "@/lib/actions/auth";
import { getCommunityStats } from "@/lib/queries";
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

  // maybeSingle() so a missing profile row renders the shell instead of
  // throwing, and real community counts replace the old placeholder numbers.
  const [profileResult, stats] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, role, country, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
    getCommunityStats(),
  ]);

  const profile = profileResult.data;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      <Sidebar
        userName={profile?.name ?? user.email ?? "Builder"}
        userRole={profile?.role ?? ""}
        userAvatarUrl={profile?.avatar_url ?? null}
        stats={stats}
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
