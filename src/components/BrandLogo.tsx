import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  priority?: boolean;
};

export default function BrandLogo({ priority = false }: BrandLogoProps) {
  return (
    <Link href="/" className="flex flex-col items-center" aria-label="Redz Restaurant home">
      <span className="block w-[150px]" aria-hidden="true">
        <Image
          src="/images/original/logo-mark-hires.png"
          alt=""
          width={536}
          height={332}
          sizes="150px"
          className="h-auto w-[150px] max-w-none"
          priority={priority}
        />
      </span>
      <span className="mt-1.5 whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-[0.1em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        Inspired American Fare
      </span>
    </Link>
  );
}
