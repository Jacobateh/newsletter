import Image from "next/image";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  widthClass?: string;
}

export function Logo({
  className,
  widthClass = "max-w-[300px] sm:max-w-[340px]",
}: LogoProps) {
  return (
    <div className={cn("relative mx-auto h-28 w-full", widthClass, className)}>
      <Image
        src="/hausa-arabia-logo.png"
        alt="Hausa Arabia — Arabic • Hausa • English"
        fill
        sizes="(min-width: 640px) 340px, 300px"
        className="object-contain"
        priority
      />
    </div>
  );
}
