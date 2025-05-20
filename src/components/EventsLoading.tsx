import { motion } from 'framer-motion';
import { Skeleton } from './ui/skeleton';

export function EventsLoading() {
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
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        <div className="mb-8">
          <div className="border-b border-white/10">
            <nav className="-mb-px flex">
              <Skeleton className="h-10 w-32 mx-2" />
              <Skeleton className="h-10 w-32 mx-2" />
              <Skeleton className="h-10 w-32 mx-2" />
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-32 mt-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 