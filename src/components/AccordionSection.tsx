import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { FaCalendarAlt } from "react-icons/fa";
import { TrackChip } from './TrackChip';

interface Track {
  name: string;
  spotifyUrl: string;
}

interface ThugLifeGlass {
  top: string;
  left: string;
  size: string;
  initialY: number;
  animateY: number;
  initialRotate: number;
  animateRotate: number;
  duration: number;
}

const tracks: Track[] = [
  { name: "Wonder", spotifyUrl: "https://open.spotify.com/track/5ocomHgsB7RtpCAbQ7Wvgl?si=204f1a5ad8534b81" },
  { name: "So Bad", spotifyUrl: "https://open.spotify.com/track/1m3psx0gfp2FfTB4Eu09IC?si=951d67df5b1a44a9" },
  { name: "Fast and Furious", spotifyUrl: "https://open.spotify.com/track/2V5xQvBB1qPI1GaJwVdJ0Q?si=2cc8573949c340ee" },
  { name: "I Need To Know", spotifyUrl: "https://open.spotify.com/track/3fWzJUk6ZyDVDLW4ENvy6V?si=9d96faa6e2384fea" }
];

const thugLifeGlasses: ThugLifeGlass[] = [
  { top: "top-1/4", left: "right-1/4", size: "w-48 h-48", initialY: -20, animateY: 20, initialRotate: -15, animateRotate: 15, duration: 4 },
  { top: "bottom-1/4", left: "left-1/4", size: "w-48 h-48", initialY: 20, animateY: -20, initialRotate: 15, animateRotate: -15, duration: 5 },
  { top: "top-1/3", left: "right-1/3", size: "w-56 h-56", initialY: -20, animateY: 20, initialRotate: -20, animateRotate: 20, duration: 4.5 },
  { top: "bottom-1/3", left: "left-1/3", size: "w-56 h-56", initialY: 20, animateY: -20, initialRotate: 20, animateRotate: -20, duration: 5.5 },
  { top: "top-1/2", left: "right-1/2", size: "w-64 h-64", initialY: -20, animateY: 20, initialRotate: -25, animateRotate: 25, duration: 4 },
  { top: "bottom-1/2", left: "left-1/2", size: "w-64 h-64", initialY: 20, animateY: -20, initialRotate: 25, animateRotate: -25, duration: 5 },
  { top: "top-1/6", left: "right-1/6", size: "w-48 h-48", initialY: -20, animateY: 20, initialRotate: -15, animateRotate: 15, duration: 4.5 },
  { top: "bottom-1/6", left: "left-1/6", size: "w-48 h-48", initialY: 20, animateY: -20, initialRotate: 15, animateRotate: -15, duration: 5.5 },
  { top: "top-2/3", left: "right-2/3", size: "w-56 h-56", initialY: -20, animateY: 20, initialRotate: -20, animateRotate: 20, duration: 4 },
  { top: "bottom-2/3", left: "left-2/3", size: "w-56 h-56", initialY: 20, animateY: -20, initialRotate: 20, animateRotate: -20, duration: 5 },
  { top: "top-1/5", left: "right-1/5", size: "w-64 h-64", initialY: -20, animateY: 20, initialRotate: -25, animateRotate: 25, duration: 4.5 },
  { top: "bottom-1/5", left: "left-1/5", size: "w-64 h-64", initialY: 20, animateY: -20, initialRotate: 25, animateRotate: -25, duration: 5.5 },
  { top: "top-2/5", left: "right-2/5", size: "w-48 h-48", initialY: -20, animateY: 20, initialRotate: -15, animateRotate: 15, duration: 4 }
];

export function AccordionSection() {
  return (
    <section id="media" className="py-24 px-4 sm:px-8 bg-gradient-to-b from-zinc-900 via-black/50 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {thugLifeGlasses.map((glass, index) => (
        <motion.div
          key={index}
          initial={{ y: glass.initialY, rotate: glass.initialRotate }}
          animate={{ y: glass.animateY, rotate: glass.animateRotate }}
          transition={{ duration: glass.duration, repeat: Infinity, repeatType: "reverse" }}
          className={`absolute ${glass.top} ${glass.left} ${glass.size} opacity-20`}
        >
          <img 
            src="/pattern.png" 
            alt="Thug Life Brille" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}

      <div className="max-w-4xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-dela-large text-4xl sm:text-5xl mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Zusammengefasst</h2>
          <p className="text-sm sm:text-base break-words text-white/80 leading-relaxed max-w-2xl mx-auto">
            Meine Geschichte, meine Laufbahn und kommende Events - alles auf einen Blick.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 h-fit">
            <div className="flex flex-col leading-6 gap-4">
              <ol className="list-disc pl-5 space-y-4">
                <li className="break-words text-white/80">
                  <span className="font-dela text-purple-400/60">14+</span> Veröffentlichungen, darunter aktuelle Releases:
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tracks.map((track) => (
                      <TrackChip
                        key={track.name}
                        trackName={track.name}
                        spotifyUrl={track.spotifyUrl}
                      />
                    ))}
                  </div>
                </li>
                <li className="break-words text-white/80">
                  <span className="font-dela text-blue-400/60">31+</span> verschiedene Veranstaltungen in 5 Bundesländern deutschlandweit
                </li>
                <li className="break-words text-white/80">
                  <span className="font-dela text-purple-400/60">8+</span> Jahre Erfahrung im Bereich der Musikproduktion
                </li>
              </ol>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="story" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <span className="font-dela group-hover:text-white transition-colors">Vorgeschichte</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed">
                  <div className="space-y-4">
                    <p>Schon in frühen Jahren bemerkten die Eltern des jungen Schusterbuben sein ausgeprägtes Rhythmusgefühl. Im Alter von 10 Jahren erhielt er zum ersten mal Schlagzeug Unterricht, welcher ihn in den nächsten Jahren begleitet und ihm eine gute Basis für rhythmische Elemente mitgegeben hat.</p>
                    <p>Mit 17 Jahren wurde er dann, wenn auch nur durch Zufall, mit seinem ersten Musikprogramm bekannt gemacht. Er beschäftigte sich zunächst nicht viel mit der Materie, sondern legte einfach los. Was zunächst ein reines Hobby war, entwickelte sich nach und nach zu seiner Berufung.</p>
                    <p>Geplagt von privaten Problemen und der Unschlüssigkeit über seine künftige Laufbahn, stand er sogar kurz davor der Musik ein Ende zu setzen. Aber im Jahr 2019, ließ er schließlich alles hinter sich und startete seinen Werdegang.</p>
                    <p>Nun holte er in den nächsten Jahren all das Wissen nach, welches man für eine solide Produktion braucht. Motivierter denn je und mit einer unzerstörbaren Entschlossenheit entwickelte er seinen Sound immer und immer weiter, bis er schlussendlich zu dem Schusterjungen geworden ist, den man heute kennt.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="progression" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <span className="font-dela group-hover:text-white transition-colors">Laufbahn</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed">
                  <div className="space-y-4">
                    <p>Seit der Bube wahrhaftig durchzieht, gab es die unterschiedlichsten Leute, mit denen er in Kontakt getreten ist, welche ihn gecoached haben, ob es in Sachen Produktion war, oder ihm einfach ein offenes Ohr geschenkt haben, was neue Musik anging.</p>
                    <p>Obwohl er immer Teil eines ,,Labels", oder auch einer ,,Crew" sein wollte, konnte er sich musikalisch mit vielen Gruppierungen kaum noch identifizieren, da sein Style nicht mehr dem typischen Hardtekk zuzuordnen ist.</p>
                    <p>Dies bemerkten auch andere Künstler und Veranstalter, wodurch er immer wieder an neuen Orten spielen konnte, wie Saarbrücken, Frankfurt am Main oder Im Central Club in Erfurt. Auch größere Künstler wie DJ Gollum oder Empyre One sind durch seinen Track ,,I Need To Know" auf ihn gestoßen und baten um eine Kollaboration.</p>
                    <p>Parallel dazu spielte er aktiv im Raum Berlin und Umgebung und wird bis heute regelmäßig von der Citybounce Crew gebucht.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="events" className="border-white/10">
                <AccordionTrigger className="text-left hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <span className="font-dela group-hover:text-white transition-colors">Veranstaltungen</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-white/70">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-4 mb-6 shadow-lg"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                            <div className="relative bg-gradient-to-br bg-white/10 p-2 rounded-full">
                              <FaCalendarAlt className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-dela text-lg text-white mb-1">Neuer Event-Bereich verfügbar.</h4>
                          <p className="text-white/90 mb-3">Schaue dir jetzt an, wo der Präsident von Berlin als nächstes auflegt. Dort findest du auch weitere Informationen und Ticketlinks, wenn verfügbar.</p>
                          <motion.a
                            href="/events"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                          >
                            Zu den Events
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <div className='flex flex-col gap-6'>
                    <div>
                      <h3 className="font-dela text-lg mb-4 text-white/90">Geplante Veranstaltungen für das Jahr 2025</h3>
                      <ol className="space-y-2 list-disc pl-5 text-sm sm:text-base">
                        <li className="break-words text-white/80">Weißer Hase (Berlin) // 20.06.</li>
                        <li className="break-words text-white/80">Club Bergwerk (Potsdam) // 04.07.</li>
                        <li className="break-words text-white/80">Dreamdale Outdoor Festival (Eschede) // 29.08.-30.08.</li>
                        <li className="break-words text-white/80">Scheunen Rave (Herzberg(Elster)) // 13.09.</li>
                        <li className="break-words text-white/80">Rave One (Trebbin) // 29.11.</li>
                        <li className="break-words text-white/80">Bunteshaus (Celle) // 06.12.</li>
                      </ol>
                    </div>
                    <div>
                      <h3 className="font-dela text-lg mb-4 text-white/90">Vergangene Veranstaltungen</h3>
                      <ol className="space-y-2 list-disc pl-5 text-sm sm:text-base columns-1 md:columns-2">
                        <li className="break-words text-white/80">Central Club (Erfurt)</li>
                        <li className="break-words text-white/80">Crazy Friesack (Friesack)</li>
                        <li className="break-words text-white/80">DOCKS (Hamburg)</li>
                        <li className="break-words text-white/80">Ellen Noir (Magdeburg)</li>
                        <li className="break-words text-white/80">Factory (Magdeburg)</li>
                        <li className="break-words text-white/80">Frosch der Club (Frankfurt (Oder))</li>
                        <li className="break-words text-white/80">Gleis 1 (Genthin)</li>
                        <li className="break-words text-white/80">Graf Karl (Kassel)</li>
                        <li className="break-words text-white/80">Hafenstube Weißwasser (Weißwasser)</li>
                        <li className="break-words text-white/80">Haithabu Bar (Delitzsch)</li>
                        <li className="break-words text-white/80">Hardraise Festival 2021 (by Strezzkidz)</li>
                        <li className="break-words text-white/80">Haus der Offiziere (Brandenburg)</li>
                        <li className="break-words text-white/80">Kamea Club (Frankfurt Oder)</li>
                        <li className="break-words text-white/80">Kili (Berlin)</li>
                        <li className="break-words text-white/80">Klubhaus Ludwigsfelde</li>
                        <li className="break-words text-white/80">Kulti (Trebbin)</li>
                        <li className="break-words text-white/80">Rave Rebirth Festival 2023 (by Tunnelfactory)</li>
                        <li className="break-words text-white/80">Schorrehalle (Halle)</li>
                        <li className="break-words text-white/80">Sky Club (Leipzig)</li>
                        <li className="break-words text-white/80">Sky Partyzone (Halle)</li>
                        <li className="break-words text-white/80">Stage Club (Saarbrücken)</li>
                        <li className="break-words text-white/80">Void (Berlin)</li>
                        <li className="break-words text-white/80">Waschhaus (Potsdam)</li>
                        <li className="break-words text-white/80">Wasserzentrum (Bitterfeld)</li>
                      </ol>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 