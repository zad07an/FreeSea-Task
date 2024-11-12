import cn from "@/lib/utils";
import {
  createContext,
  OptionHTMLAttributes,
  SelectHTMLAttributes,
  useContext,
} from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

const SelectContext = createContext<boolean | undefined>(undefined);

const useSelectContext = (componentName: string) => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error(
      `${componentName} should be used within useGameSelectContext`
    );
  }
  return context;
};

export const Select = ({
  className,
  children,
  defaultValue,
  ...props
}: Props) => {
  return (
    <SelectContext.Provider value={true}>
      <select
        className={cn(
          "w-full rounded-md bg-primary-input-color py-2 px-4 font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </SelectContext.Provider>
  );
};

type GameSelectProps = OptionHTMLAttributes<HTMLOptionElement>;

export const SelectOption = ({
  className,
  children,
  ...props
}: GameSelectProps) => {
  useSelectContext("SelectOption");

  return (
    <option className={cn(className)} {...props}>
      {children}
    </option>
  );
};
