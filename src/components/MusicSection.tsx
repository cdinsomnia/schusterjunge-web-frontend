import { motion } from 'framer-motion';
import { FaStar, FaPlay, FaUsers } from "react-icons/fa";

export function MusicSection() {
  return (
    <section id="music" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-zinc-900 via-black/50 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h1 className="font-dela-large text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Meine Musik produziere ich nicht nur selber, sondern bringe sie auch zu dir.</h1>
            <p className="text-sm sm:text-base break-words text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto">
              Mich macht aus, dass alles aus einer Hand kommt. In den Jahren seitdem ich Musik produziere habe ich meine Techniken verfeinert. Ich vertreibe sie selbst und Live ist es genau das, was du bekommst: Meine Musik. Von Anfang bis Ende.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <FaStar className="text-2xl text-purple-400/60" />
                <h2 className="font-dela text-xl">Qualität</h2>
              </div>
              <p className="text-sm text-white/70">
                Ein ordentlicher Trackaufbau, Mix & Master sind in meiner Produktion die wichtigsten Bausteine. Live wird nur das gespielt, was von mir kommt und all diese Kriterien erfüllt.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <FaPlay className="text-2xl text-blue-400/60" />
                <h2 className="font-dela text-xl">Live-Set</h2>
              </div>
              <p className="text-sm text-white/70">
                Einzigartige Live-Performance mit eigenen Tracks und dem Schusterjunge-Effekt, sorgen genau für das kontrastreiche Programm, was deine Veranstaltung benötigt.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <FaUsers className="text-2xl text-purple-400/60" />
                <h2 className="font-dela text-xl">Publikum</h2>
              </div>
              <p className="text-sm text-white/70">
                Musik, die Hörer und Veranstalter gleichermaßen begeistert. Mein ausgewogener Sound lässt Grenzen verschwimmen und vereint Fans.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <FaStar className="text-2xl text-blue-400/60" />
                <h2 className="font-dela text-xl">Erfahrung</h2>
              </div>
              <p className="text-sm text-white/70">
                Über 8 Jahre Erfahrung in der Musikproduktion und Live-Performance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 