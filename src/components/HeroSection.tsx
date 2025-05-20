import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative py-38 md:py-54 px-4 overflow-hidden mask-b-from-0"
    >
      <motion.video 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/hero/hero.mp4" type="video/mp4" />
        Dein Browser unterstützt aktuell keine Videos. Aktualisiere deinen Browser, falls das Problem weitehrin besteht.
      </motion.video>
    </motion.section>
  );
} 