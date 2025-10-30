import { Loader } from "../../components/loader";

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-white">
      <Loader size={60} textColor="black" spinnerColor="gray" />
    </div>
  );
}
