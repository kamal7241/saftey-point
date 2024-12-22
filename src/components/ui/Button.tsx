import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

type ButtonProps = {
  label?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: "primary" | "dark" | "transparent";
  noLabel?: boolean;
  noBackground?: boolean;
  textColor?: string; // New prop for custom text color
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
  textColor, // Destructure the new prop
}: ButtonProps) {
  // Conditionally remove padding when noLabel is true
  const baseClasses = `flex items-center justify-center gap-2 ${
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
  }

  // Add conditional styling if `noBackground` is true
  if (noBackground) {
    variantClasses = "bg-transparent border-none";
  }

  // Apply custom text color if provided
  const textClasses = textColor ? `text-${textColor}` : "";

  // Combine base, variant, and additional custom class names
  const defaultClasses = `${baseClasses} ${variantClasses} ${textClasses} ${className}`;

  const buttonContent = (
    <>
      {icon && icon}
      {!noLabel && label && <span>{label}</span>}
    </>
  );

  return href ? (
    <Link href={href} className={defaultClasses}>
      {buttonContent}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={defaultClasses}>
      {buttonContent}
    </button>
  );
}
