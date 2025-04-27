import { HeroSection } from '../components/HeroSection';
import { IntroSection } from '../components/IntroSection';
import { MusicSection } from '../components/MusicSection';
import { AccordionSection } from '../components/AccordionSection';

export function Home() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <IntroSection />
      <MusicSection />
      <AccordionSection />
    </div>
  );
} 