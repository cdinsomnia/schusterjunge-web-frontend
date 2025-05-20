import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

export function Events() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      id="events" 
      className="py-24 px-4 sm:px-8 bg-gradient-to-b from-black via-zinc-900/50 to-zinc-900 relative overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none"
      />
      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="font-dela text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Kommende Events</h1>
          <p className="text-sm sm:text-base break-words text-white/80 leading-relaxed max-w-2xl mx-auto">
            Entdecke die nächsten Live-Auftritte und Events. Sei dabei, wenn der Schusterjunge-Effekt live auf die Bühne kommt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaCalendarAlt className="text-2xl text-purple-400/60" />
              <h2 className="font-dela text-xl">Hardtekk Festival</h2>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Das größte Hardtekk Festival Deutschlands. Sei dabei, wenn die besten Acts der Szene aufeinandertreffen.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <FaMapMarkerAlt />
              <span>Berlin, Deutschland</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
              <FaTicketAlt />
              <span>Tickets verfügbar</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <FaCalendarAlt className="text-2xl text-blue-400/60" />
              <h2 className="font-dela text-xl">Club Night</h2>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Eine exklusive Club Night mit den besten Hardtekk Acts. Erlebe den Schusterjunge-Effekt live.
            </p>
            <div className="flex items-center gap-4 text-sm text-white/60">
              <FaMapMarkerAlt />
              <span>Hamburg, Deutschland</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/60 mt-2">
              <FaTicketAlt />
              <span>Bald verfügbar</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 