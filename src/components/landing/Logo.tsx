interface LogoProps {
  size?: "default" | "large";
  variant?: "default" | "light";
}

export function ProcuturaLogo({
  size = "default",
  variant = "default",
}: LogoProps) {
  const textSize = size === "large" ? "text-3xl" : "text-xl";
  const textColor =
    variant === "light" ? "text-white" : "text-navy-dark dark:text-white";

  return (
    <div className={`flex items-center gap-2 font-bold ${textSize}`}>
      <svg
        width={size === "large" ? "36" : "28"}
        height={size === "large" ? "36" : "28"}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="36" height="36" rx="8" fill="#1e3a5f" />
        <path
          d="M10 11L6 18L10 25"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 11L30 18L26 25"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 24V12H19.5C21.433 12 23 13.567 23 15.5C23 17.433 21.433 19 19.5 19H14"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className={`font-plus ${textColor}`}>
        Proc<span className="text-green">tura</span>
      </span>
    </div>
  );
}
