import cn from "@/lib/utils";
import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: Props) => {
  return (
    <input
      className={cn(
        "grow rounded-bl-md bg-primary-input-color shadow-md  rounded-tl-md p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none md:p-2",
        className
      )}
      {...props}
    />
  );
};
