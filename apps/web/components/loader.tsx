import { LoaderCircle } from "lucide-react";
import React from "react";

interface loaderProp {
  size: number;
  textColor: string;
  spinnerColor: string;
}

export const Loader = (props: loaderProp) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="animate-spin">
        <LoaderCircle color={props.spinnerColor} size={props.size} />
      </div>
      <p className={`text-2xl animate-pulse text-${props.textColor}`}>
        loading...
      </p>
    </div>
  );
};
