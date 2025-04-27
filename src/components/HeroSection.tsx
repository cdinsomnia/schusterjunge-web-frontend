export function HeroSection() {
  return (
    <section className="relative py-54 px-4 overflow-hidden mask-b-from-0">
      <video 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/hero/hero.mp4" type="video/mp4" />
        Dein Browser unterstützt aktuell keine Videos. Aktualisiere deinen Browser, falls das Problem weitehrin besteht.
      </video>
    </section>
  );
} 