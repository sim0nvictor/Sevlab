import Link from "next/link";

const footerLinks = {
  help: [
    { label: "Get Help", href: "/help" },
    { label: "FAQ", href: "/help#faq" },
  ],
  support: [
    { label: "Support", href: "/help#support" },
    { label: "Contact Us", href: "mailto:sevmediax@gmail.com" },
  ],
};

export function AppFooter() {
  return (
    <footer className="border-t border-white/8 bg-white/[0.03] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="sm:col-span-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-[var(--accent)]" />
              <span className="font-[var(--font-heading)] text-lg font-semibold text-white">
                Sevlab
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              A community for African builders to share projects, get help, and collaborate.
            </p>
          </div>

          {/* Get Help */}
          <div>
            <h3 className="text-sm font-medium text-white">Get Help</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted-foreground)] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted-foreground)] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach Out */}
          <div>
            <h3 className="text-sm font-medium text-white">Reach Out</h3>
            <div className="mt-3 space-y-3">
              <a
                href="https://x.com/Sevlabx?s=20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @Sevlabx
              </a>
              <a
                href="mailto:sevmediax@gmail.com"
                className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-white"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                sevmediax@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-6 text-xs text-[var(--muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} Sevlab. Built for African builders.</p>
          <div className="flex gap-4">
            <Link href="/help#privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/help#terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}