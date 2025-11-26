import { motion } from 'framer-motion';

interface AnimatedClickHereButtonProps {
  onClick?: () => void;
}

export default function AnimatedClickHereButton({ onClick = () => console.log('Button clicked!') }: AnimatedClickHereButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="px-8 py-3 bg-gradient-to-br from-[#f6d4c8] to-[#e7c9a8] text-white rounded-lg shadow-xl font-semibold text-lg md:text-xl"
      animate={{
        y: [0, -10, 0], // Bounce effect
      }}
      transition={{
        duration: 1,
        repeat: Infinity, // Infinite loop for bouncing
        repeatType: "reverse", // Reverse direction after each cycle
        ease: "easeInOut",
      }}
    >
      Click Here
    </motion.button>
  );
}
