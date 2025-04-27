import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function AccordionSection() {
  return (
    <section id="media" className="relative py-16 px-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <div className="w-full md:w-1/2 transition-all duration-300 ease-in-out">
          <div className="flex flex-col leading-6 gap-4">
            <h1 className="font-[Dela_Gothic_One] text-4xl animate-fade-in-left delay-300">Zusammengefasst</h1>
            <ol className="list-disc pl-5">
              <li>Über 14 Veröffentlichungen, darunter aktuelle Releases wie "Wonder", "So Bad", "Fast and Furious" & "I Need To Know".</li>
              <li>Auftritt in über mehr als 31 verschiedenen Veranstaltungen in 5 verschiedenen Bundesländern deutschlandweit</li>
              <li>Mehr als 8 Jahre Erfahrung im Bereich der Musikproduktion</li>
            </ol>
          </div>
          <img 
            className="animate-fade-in w-full h-auto object-cover rounded-lg shadow-lg" 
            src="/upload/shoot01/SCHUSTER_1.png" 
            alt="Schusterjunge" 
          />
        </div>

        <div className="w-full md:w-1/2 transition-all duration-300 ease-in-out">
          <Accordion 
            type="multiple" 
            className="w-full transition-all duration-300 ease-in-out"
          >
            <AccordionItem value="story" className="border-b border-zinc-800">
              <AccordionTrigger className="hover:bg-zinc-900/20 px-4 py-3 rounded-t-md transition-all">Vorgeschichte</AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-2">
                Schon in frühen Jahren bemerkten die Eltern des jungen Schusterbuben sein ausgeprägtes Rhythmusgefühl. Im Alter von 10 Jahren erhielt er zum ersten mal Schlagzeug Unterricht, welcher ihn in den nächsten Jahren begleitet und ihm eine gute Basis für rhythmische Elemente mitgegeben hat. Mit 17 Jahren wurde er dann, wenn auch nur durch Zufall, mit seinem ersten Musikprogramm bekannt gemacht. Er beschäftigte sich zunächst nicht viel mit der Materie, sondern legte einfach los. Was zunächst ein reines Hobby war, entwickelte sich nach und nach zu seiner Berufung. Geplagt von privaten Problemen und der Unschlüssigkeit über seine künftige Laufbahn, stand er sogar kurz davor der Musik ein Ende zu setzen. Aber im Jahr 2019, ließ er schließlich alles hinter sich und startete seinen Werdegang. Nun holte er in den nächsten Jahren all das Wissen nach, welches man für eine solide Produktion braucht. Motivierter denn je und mit einer unzerstörbaren Entschlossenheit entwickelte er seinen Sound immer und immer weiter, bis er schlussendlich zu dem Schusterjungen geworden ist, den man heute kennt.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="progression" className="border-b border-zinc-800">
              <AccordionTrigger className="hover:bg-zinc-900/20 px-4 py-3 transition-all">Laufbahn</AccordionTrigger>
              <AccordionContent className="px-4 py-4 space-y-2">
                Seit der Bube wahrhaftig durchzieht, gab es die unterschiedlichsten Leute, mit denen er in Kontakt getreten ist, welche ihn gecoached haben, ob es in Sachen Produktion war, oder ihm einfach ein offenes Ohr geschenkt haben, was neue Musik anging. Obwohl er immer Teil eines ,,Labels", oder auch einer ,,Crew" sein wollte, konnte er sich musikalisch mit vielen Gruppierungen kaum noch identifizieren, da sein Style nicht mehr dem typischen Hardtekk zuzuordnen ist. Dies bemerkten auch andere Künstler und Veranstalter, wodurch er immer wieder an neuen Orten spielen konnte, wie Saarbrücken, Frankfurt am Main oder Im Central Club in Erfurt. Auch größere Künstler wie DJ Gollum oder Empyre One sind durch seinen Track ,,I Need To Know" auf ihn gestoßen und baten um eine Kollaboration. Parallel dazu spielte er aktiv im Raum Berlin und Umgebung und wird bis heute regelmäßig von der Citybounce Crew gebucht.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="events" className="border-b border-zinc-800">
              <AccordionTrigger className="hover:bg-zinc-900/20 px-4 py-3 transition-all">Veranstaltungen</AccordionTrigger>
              <AccordionContent className="px-4 py-4">
                <div className='flex flex-col gap-6'>
                  <div className="">
                    <h3 className="font-bold text-lg mb-2">Geplante Veranstaltungen für das Jahr 2025</h3>
                    <ol className="space-y-1 list-disc pl-5">
                      <li>Weißer Hase (Berlin) // 20.06.</li>
                      <li>Club Bergwerk (Potsdam) // 04.07.</li>
                      <li>Dreamdale Outdoor Festival (Eschede) // 29.08.-30.08.</li>
                      <li>Scheunen Rave (Herzberg(Elster)) // 13.09.</li>
                      <li>Rave One (Trebbin) // 29.11.</li>
                      <li>Bunteshaus (Celle) // 06.12.</li>
                    </ol>
                  </div>
                  <div className="">
                    <h3 className="font-bold text-lg mb-2">Vergangene Veranstaltungen</h3>
                    <ol className="space-y-1 list-disc pl-5 columns-1 md:columns-2">
                      <li>Central Club (Erfurt)</li>
                      <li>Crazy Friesack (Friesack)</li>
                      <li>DOCKS (Hamburg)</li>
                      <li>Ellen Noir (Magdeburg)</li>
                      <li>Factory (Magdeburg)</li>
                      <li>Frosch der Club (Frankfurt (Oder))</li>
                      <li>Gleis 1 (Genthin)</li>
                      <li>Graf Karl (Kassel)</li>
                      <li>Hafenstube Weißwasser (Weißwasser)</li>
                      <li>Haithabu Bar (Delitzsch)</li>
                      <li>Hardraise Festival 2021 (by Strezzkidz)</li>
                      <li>Haus der Offiziere (Brandenburg)</li>
                      <li>Kamea Club (Frankfurt Oder)</li>
                      <li>Kili (Berlin)</li>
                      <li>Klubhaus Ludwigsfelde</li>
                      <li>Kulti (Trebbin)</li>
                      <li>Rave Rebirth Festival 2023 (by Tunnelfactory)</li>
                      <li>Schorrehalle (Halle)</li>
                      <li>Sky Club (Leipzig)</li>
                      <li>Sky Partyzone (Halle)</li>
                      <li>Stage Club (Saarbrücken)</li>
                      <li>Void (Berlin)</li>
                      <li>Waschhaus (Potsdam)</li>
                      <li>Wasserzentrum (Bitterfeld)</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
} 