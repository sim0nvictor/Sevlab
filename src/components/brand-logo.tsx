import Image from "next/image";
import sevlabLogo from "@/assets/sevlab.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  showWordmark?: boolean;
};

export function BrandLogo({
  className,
  imageClassName,
  showWordmark = true,
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/30",
          imageClassName,
        )}
      >
        <Image
          src={sevlabLogo}
          alt="Sevlab logo"
          fill
          className="object-cover"
          sizes="48px"
          priority
        />
      </div>
      {showWordmark ? (
        <div>
          <div className="text-lg font-semibold text-white">Sevlab</div>
          <div className="text-sm text-[var(--muted-foreground)]">
            African builders
          </div>
        </div>
      ) : null}
    </div>
  );
}
