
export interface InputProps {
  label?: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  icon?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  iconSVG?: React.ReactNode;
  extraClass?: string;
  border?: boolean;
  iconEnd?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add this line
  togglePasswordVisibility?: () => void;
}
export interface TextareaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name: string;
  icon?: string;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
  iconSVG?: React.ReactNode;
  extraClass?: string;
  border?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void; // Add this line
  togglePasswordVisibility?: () => void;
}