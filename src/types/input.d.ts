
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
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Add this line
    togglePasswordVisibility?: () => void;
  }
  