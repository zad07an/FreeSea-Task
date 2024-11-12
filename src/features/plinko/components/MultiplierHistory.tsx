import { motion } from "framer-motion";
import { memo } from "react";

interface MultiplierHistoryProps {
  multiplierHistory: number[];
}

export const MultiplierHistory = memo(
  ({ multiplierHistory }: MultiplierHistoryProps) => {
    return (
      <div className="absolute right-4 top-40 flex w-16 flex-col gap-1 overflow-hidden rounded-md md:top-60">
        {/* Animate only the last item added */}
        {multiplierHistory.map((multiplier, index) => {
          if (!multiplier || index > 2) return null;

          return (
            <motion.span
              key={`${multiplier}${index}`}
              className="flex items-center justify-center bg-purpleDark p-1 font-bold bg-gradient-to-r from-primary-orange to-red-500 text-text rounded-md"
              initial={{ opacity: 0, y: 25, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              {multiplier}x
            </motion.span>
          );
        })}
      </div>
    );
  }
);
