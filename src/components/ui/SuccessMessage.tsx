import SuccessIcon from "./icons/SuccessIcon";

interface SuccessMessageProps {
  title: string;
  msg: string;
}

const SuccessMessage = ({ title, msg }: SuccessMessageProps) => (
  <div className="border border-green-100 bg-green-200 flex w-full text-green-400 rounded-lg p-4 gap-3">
    <SuccessIcon />
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="text-sm">{msg}</p>
    </div>
  </div>
);

export default SuccessMessage;
