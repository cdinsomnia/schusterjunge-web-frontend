import { FaSpotify } from "react-icons/fa";

interface TrackChipProps {
  trackName: string;
  spotifyUrl: string;
}

export function TrackChip({ trackName, spotifyUrl }: TrackChipProps) {
  return (
    <a
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm text-white/80 hover:text-white hover:border-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
    >
      <FaSpotify className="text-green-500 text-base" />
      <span className="whitespace-nowrap">{trackName}</span>
    </a>
  );
} 