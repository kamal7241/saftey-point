import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

type ButtonProps = {
  label?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: "primary" | "dark" | "transparent" | "selected";
  noLabel?: boolean;
  noBackground?: boolean;
  textColor?: string;
};

export default function Button({
  label,
  href,
  type = "button",
  onClick,
  className = "",
  icon,
  variant = "primary",
  noBackground = false,
  noLabel = false,
  textColor,
}: ButtonProps) {
  const baseClasses = `flex items-center justify-center gap-2 capitalize ${
    noLabel ? "" : "px-6 py-2"
  } rounded-md font-medium transition duration-200 ease-in-out`;

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses =
      "bg-primary text-white border border-primary hover:bg-primary-dark";
  } else if (variant === "dark") {
    variantClasses = "bg-dark text-white border border-dark hover:bg-dark-dark";
  } else if (variant === "transparent") {
    variantClasses =
      "bg-transparent text-primary border border-light-300 hover:border-light-400";
  } else if (variant === "selected") {
    variantClasses =
      "bg-gray-201 text-primary border border-light-300 hover:border-light-400";
  }

  if (noBackground) {
    variantClasses = "bg-transparent border-none";
  }

  const textClasses = textColor ? `text-${textColor}` : "";

  // Only append textClasses if no text-related styles are already set in variantClasses
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  const buttonContent = (
    <>
      {icon && <span className={textClasses}>{icon}</span>}
      {!noLabel && label && <span className={textClasses}>{label}</span>}
    </>
  );

  return href ? (
    <Link href={href} className={combinedClasses}>
      {buttonContent}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {buttonContent}
    </button>
  );
}
