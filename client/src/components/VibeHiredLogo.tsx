import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface HireNestLogoProps {
  className?: string;
  size?: number;
}

export function VibeHiredLogo({ className, size = 64 }: HireNestLogoProps) {
  const word1 = Array.from("Hire");
  const word2 = Array.from("Nest");

  const letterVariants = {
    hidden: { y: 20, opacity: 0, rotate: -5 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
        delay: i * 0.07,
      },
    }),
    hover: {
      y: -5,
      scale: 1.08,
      transition: { type: "spring" as const, stiffness: 300, damping: 10 },
    },
  };

  return (
    <div
      className={cn("flex items-center justify-start cursor-default", className)}
      style={{ minHeight: size }}
    >
      <motion.div
        className="flex items-center gap-2"
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            width: size * 0.7,
            height: size * 0.7,
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: size * 0.4 }}
          >
            nest_eco_leaf
          </span>
        </motion.div>

        {/* Text */}
        <div
          className="flex items-baseline font-bold tracking-tight"
          style={{ fontSize: size * 0.7, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
        >
          {/* "Hire" */}
          <div className="flex">
            {word1.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                whileHover="hover"
                className="inline-block origin-bottom"
                style={{ color: "#0F172A" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* "Nest" */}
          <div className="flex">
            {word2.map((letter, i) => (
              <motion.span
                key={i + word1.length}
                custom={i + word1.length}
                variants={letterVariants}
                whileHover="hover"
                className="inline-block origin-bottom"
                style={{ color: "#4F46E5" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Named export alias
export { VibeHiredLogo as HireNestLogo };
