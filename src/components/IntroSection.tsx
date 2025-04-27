import { FaRegEnvelope } from "react-icons/fa";
import { Button } from './ui/button';

export function IntroSection() {
  return (
    <section id="media" className="relative py-16 px-8">
      <div className="flex flex-col">
        <div className='flex px-0 opacity-60'>
          <img className="animate-fade-in" src="/motto.svg" typeof="svg" />
        </div>
        <div className="leading-6 flex flex-col gap-4">
          <h1 className="font-[Dela_Gothic_One] text-4xl animate-fade-in-up delay-500">Mehr als nur Musik.</h1>
          <p className="animate-fade-in duration-1000 delay-1500">Ein Phänomen aus dem Berliner Raum, das die Hardtekk-Szene maßgeblich prägt. Mit atmosphärischen Klängen, prägnanten Melodien und einem innovativen Trackaufbau setze ich neue Maßstäbe und hebe den Sound auf ein neues Niveau. Damit bin ich, der Präsident von Berlin also nicht nur ein DJ, der weiß, wie man auflegt sondern steche zusätzlich mit meinen eigenen Tracks heraus. Das Musikerlebnis was du als Veranstalter buchst ist also nicht nur abwechslungsreich sondern auch originell.</p>
        </div>
        <div className="flex flex-row">
          <Button variant="hero" className="flex mt-6 w-40 py-6 cursor-pointer animate-fade-in">
            <FaRegEnvelope />
            <p>Jetzt buchen</p>
          </Button>
          <Button variant="link" className="flex mt-6 w-48 py-6 cursor-pointer animate-fade-in">Veranstalter-Kit</Button>
        </div>
      </div>
    </section>
  );
} 