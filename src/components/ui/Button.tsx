import { Link } from "@/i18n/routing";
import { ReactNode } from "react";

type ButtonProps = {
  label?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  variant?: "primary" | "dark" | "transparent" | "selected" | "danger";
  disabled?: boolean;
  noLabel?: boolean;
  noBackground?: boolean;
  textColor?: string;
  padding?: string;
  textSize?: string;
};

export default function Button({
  label,
  href,
  type = "button",
  onClick,
  className = "",
  icon,
  disabled,
  variant = "primary",
  noBackground = false,
  noLabel = false,
  textColor,
  textSize = "text-base",
  padding = "px-6 py-2",
}: ButtonProps) {
  const baseClasses = `flex items-center justify-center gap-2 capitalize ${
    noLabel ? "" : padding
  } rounded-md font-medium transition duration-200 ease-in-out ${textSize}`;

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
  } else if (variant === "danger") {
    variantClasses =
      "bg-red-400 text-white border border-red-400 hover:bg-opacity-80";
  }

  if (noBackground) {
    variantClasses = "bg-transparent border-none";
  }

  const textClasses = textColor ? `text-${textColor}` : "";

  // Only append textClasses if no text-related styles are already set in variantClasses
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  const buttonContent = (
    <>
      {icon && (
        <span
          className={`${textClasses} self-center flex items-center justify-center`}
        >
          {icon}
        </span>
      )}
      {!noLabel && label && <span className={textClasses}>{label}</span>}
    </>
  );

  return href ? (
    <Link href={href} className={combinedClasses}>
      {buttonContent}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
      {buttonContent}
    </button>
  );
}
