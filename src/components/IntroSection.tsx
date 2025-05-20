import { FaRegEnvelope } from "react-icons/fa";
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function IntroSection() {
  return (
    <section id="media" className="relative py-16 px-4 sm:px-8">
      <div className="flex flex-col">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8 }}
          className='flex'
        >
          <img className="w-full lg:max-w-[22rem] max-w-xs" src="/motto.svg" typeof="svg" />
        </motion.div>
        <div className="leading-6 flex flex-col gap-4 md:mb-0 mb-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-dela text-3xl sm:text-4xl"
          >
            Mehr als nur Musik.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-sm sm:text-base break-words"
          >
            Ein Phänomen aus dem Berliner Raum, das die Hardtekk-Szene maßgeblich prägt. Mit atmosphärischen Klängen, prägnanten Melodien und einem innovativen Trackaufbau setze ich neue Maßstäbe und hebe den Sound auf ein neues Niveau. Damit bin ich, der Präsident von Berlin also nicht nur ein DJ, der weiß, wie man auflegt sondern steche zusätzlich mit meinen eigenen Tracks heraus. Das Musikerlebnis was du als Veranstalter buchst ist also nicht nur abwechslungsreich sondern auch originell.
          </motion.p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Button variant="hero" className="flex mt-6 w-full sm:w-40 py-6 cursor-pointer">
              <FaRegEnvelope />
              <p>Jetzt buchen</p>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/kit">
              <Button variant="hero" className="text-white bg-neutral-950 hover:text-white hover:bg-neutral-900 sm:mt-6 w-full sm:w-48 py-6 cursor-pointer">Veranstalter-Kit</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 