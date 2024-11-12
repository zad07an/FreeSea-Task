import cn from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ className, children, ...props }: Props) => {
  return (
    <button
      className={cn(
        " w-full px-3 py-1.5 flex items-center justify-center gap-2 rounded-md bg-primary-background disabled:opacity-80 disabled:pointer-events-none disabled:cursor-not-allowed hover:bg-opacity-90 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
