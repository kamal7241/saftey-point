export const runtime = "edge";
import NotDevelopedYet from "@/components/NotDevelopedYet";

export default function page() {
  return (
    <div className="flex justify-center flex-col gap-5 text-lg items-center py-5">
      Support
      <NotDevelopedYet />
    </div>
  );
}
