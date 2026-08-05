import { type Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import {
  respondToPartnershipRequest,
  withdrawPartnershipRequest,
} from "@/lib/actions/partnerships";
import { formatDate, param, type SearchParams } from "@/lib/params";
import { getPartnershipRequests } from "@/lib/queries";
import type { PartnershipStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Partnerships | Sevlab",
  description: "Manage collaboration requests you have sent and received.",
};

const statusTone: Record<PartnershipStatus, string> = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  accepted: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  declined: "border-white/10 bg-white/5 text-[var(--muted-foreground)]",
};

export default async function PartnershipsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const error = param(sp.error);
  const sent = param(sp.sent) === "1";

  const { incoming, outgoing } = await getPartnershipRequests();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {sent ? <Notice tone="success">Request sent.</Notice> : null}
      {error ? <Notice>{error}</Notice> : null}

      <div className="surface-card p-5 sm:p-6">
        <p className="text-sm text-[var(--muted-foreground)]">Partnerships</p>
        <h1 className="mt-1 font-[var(--font-heading)] text-3xl font-semibold text-white">
          People you are building with
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Requests are private. Only you and the other builder can see them.
        </p>
        <Link
          href="/discover"
          className="mt-5 inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white transition hover:border-white/20"
        >
          Find someone new
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Incoming ({incoming.length})
        </h2>

        {incoming.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm text-[var(--muted-foreground)]">
            No incoming requests yet. Filling in your skills makes you easier to find.
          </div>
        ) : (
          incoming.map((request) => (
            <article key={request.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    <Link href={`/builders/${request.senderId}`} className="hover:underline">
                      {request.sender?.name ?? "Unknown builder"}
                    </Link>
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {[request.sender?.role, request.sender?.country, formatDate(request.createdAt)]
                      .filter(Boolean)
                      .join(" \u00b7 ")}
                  </p>
                </div>
                <Badge className={`border shrink-0 ${statusTone[request.status]}`}>
                  {request.status}
                </Badge>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm text-white/90">{request.message}</p>

              {request.projectId ? (
                <Link
                  href={`/projects/${request.projectId}`}
                  className="mt-3 inline-flex text-sm text-[var(--accent)] hover:underline"
                >
                  About a specific project
                </Link>
              ) : null}

              {request.status === "pending" ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  <form action={respondToPartnershipRequest}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" name="decision" value="accepted" />
                    <Button type="submit">Accept</Button>
                  </form>
                  <form action={respondToPartnershipRequest}>
                    <input type="hidden" name="requestId" value={request.id} />
                    <input type="hidden" name="decision" value="declined" />
                    <Button type="submit" variant="outline">
                      Decline
                    </Button>
                  </form>
                </div>
              ) : null}

              {request.status === "accepted" && request.sender ? (
                <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                  You accepted. Reach out via their profile links to get started.
                </p>
              ) : null}
            </article>
          ))
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Sent ({outgoing.length})
        </h2>

        {outgoing.length === 0 ? (
          <div className="surface-card p-6 text-center text-sm text-[var(--muted-foreground)]">
            You have not sent any requests yet.
          </div>
        ) : (
          outgoing.map((request) => (
            <article key={request.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    <Link href={`/builders/${request.recipientId}`} className="hover:underline">
                      {request.recipient?.name ?? "Unknown builder"}
                    </Link>
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {formatDate(request.createdAt)}
                  </p>
                </div>
                <Badge className={`border shrink-0 ${statusTone[request.status]}`}>
                  {request.status}
                </Badge>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm text-white/90">{request.message}</p>

              {request.status === "pending" ? (
                <form action={withdrawPartnershipRequest} className="mt-5">
                  <input type="hidden" name="requestId" value={request.id} />
                  <Button type="submit" variant="ghost">
                    Withdraw request
                  </Button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
