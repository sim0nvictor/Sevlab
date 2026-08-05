import { cn } from "@/lib/utils";

type NoticeProps = {
  tone?: "error" | "success";
  children: React.ReactNode;
};

/** Inline feedback banner for server-action results passed back via the URL. */
export function Notice({ tone = "error", children }: NoticeProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-red-400/20 bg-red-400/10 text-red-200"
          : "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
      )}
    >
      {children}
    </div>
  );
}
