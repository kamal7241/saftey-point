import SuccessIcon from "./icons/SuccessIcon";

interface SuccessMessageProps {
  title: string;
  msg: string;
  bigger?: boolean;
}

const SuccessMessage = ({ title, msg, bigger }: SuccessMessageProps) => (
  <div
    className={`${
      bigger
        ? "text-green-400 flex justify-center items-center flex-col gap-12 text-center"
        : "border border-green-100 bg-green-200 flex w-full text-green-400 rounded-lg p-4 gap-3"
    }`}
  >
    <span
      className={`${
        bigger
          ? " border-green-101 rounded-full w-10 h-10 flex-none block shadow-custom2"
          : ""
      }`}
    >
      <SuccessIcon />
    </span>
    <div>
      <h4
        className={`${
          bigger ? "text-3xl font-bold mb-3" : "text-sm font-semibold"
        }`}
      >
        {title}
      </h4>
      <p
        className={`${
          bigger
            ? "text-xl font-medium text-black text-pretty max-w-[250px]"
            : "text-sm"
        }`}
      >
        {msg}
      </p>
    </div>
  </div>
);

export default SuccessMessage;
