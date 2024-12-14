import { Link } from "@/i18n/routing";

type ButtonProps = {
  label: string; // The button text
  href?: string; // If present, it acts as a link
  type?: "button" | "submit" | "reset"; // Button types
  onClick?: () => void; // Click event handler
  className?: string; // Additional Tailwind CSS classes
};

export default function Button({
  label,
  href,
  type = "button",
  onClick,
  className = "",
}: ButtonProps) {
  const baseClasses = `inline-block px-6 py-2 rounded-md font-medium transition duration-200 ease-in-out`;
  const defaultClasses = `${baseClasses} text-white bg-blue-500 hover:bg-blue-600 ${className}`;

  return href ? (
    <Link href={href} className={defaultClasses}>
      {label}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={defaultClasses}>
      {label}
    </button>
  );
}
