import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ours = "/images/ours_grand.png";
const taureau = "/images/taureau_debout.png";

export default function ParallaxBearBull() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const bearY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const bullY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none hidden lg:block">
      <motion.img
        src={ours}
        alt="ours"
        className="absolute bottom-0 left-0 w-[300px] opacity-80"
        style={{ y: bearY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
      />
      <motion.img
        src={taureau}
        alt="taureau"
        className="absolute bottom-0 right-0 w-[300px] opacity-80"
        style={{ y: bullY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}
