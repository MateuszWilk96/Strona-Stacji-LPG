
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function InsuranceVideos() {
  const { settings } = useSettings();

  const videos = Array.isArray(settings?.insuranceVideos)
    ? settings.insuranceVideos.filter(
        (video) =>
          video?.enabled !== false &&
          typeof video?.url === "string" &&
          /^https:\/\/res\.cloudinary\.com\//i.test(video.url)
      )
    : [];

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
  );

  const [index, setIndex] = useState(0);
  const playersRef = useRef([]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");

    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const visibleCount = isMobile ? 1 : 2;
  const maxIndex = Math.max(0, videos.length - visibleCount);
  const currentIndex = Math.min(index, maxIndex);

  const moveTo = (nextIndex) => {
    playersRef.current.forEach((player) => {
      if (player && !player.paused) {
        player.pause();
      }
    });

    setIndex(Math.max(0, Math.min(nextIndex, maxIndex)));
  };

  if (videos.length === 0) return null;

  const visibleVideos = videos.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  return (
    <section
      id="filmy"
      className="container mx-auto px-6 py-12"
    >
      <h2 className="text-center text-3xl font-bold text-emerald-900">
        Poznaj nasze ubezpieczenia
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        Krótkie materiały o ubezpieczeniach i naszej ofercie.
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => moveTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Poprzedni film"
          className="shrink-0 rounded-full bg-emerald-800 px-3 py-2 text-2xl text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          &#8249;
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-start justify-center gap-6">
          {visibleVideos.map((video, offset) => (
            <VideoCard
              key={`${video.url}-${currentIndex + offset}`}
              video={video}
              playerRef={(element) => {
                playersRef.current[offset] = element;
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => moveTo(currentIndex + 1)}
          disabled={currentIndex === maxIndex}
          aria-label="Następny film"
          className="shrink-0 rounded-full bg-emerald-800 px-3 py-2 text-2xl text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          &#8250;
        </button>
      </div>

      {maxIndex > 0 && (
        <div
          className="mt-6 flex justify-center gap-2"
          aria-label="Pozycja karuzeli"
        >
          {Array.from({ length: maxIndex + 1 }, (_, position) => (
            <button
              key={position}
              type="button"
              onClick={() => moveTo(position)}
              aria-label={`Przejdź do pozycji ${position + 1}`}
              aria-current={
                position === currentIndex ? "true" : undefined
              }
              className={`h-3 w-3 rounded-full transition ${
                position === currentIndex
                  ? "bg-emerald-800"
                  : "bg-emerald-200 hover:bg-emerald-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function VideoCard({ video, playerRef }) {
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <article
      className={`w-full overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow ${
        isPortrait
          ? "max-w-[280px]"
          : "max-w-[640px]"
      }`}
      style={{
        flex: isPortrait
          ? "0 1 280px"
          : "1 1 360px",
      }}
    >
      <video
        ref={playerRef}
        controls
        preload="metadata"
        playsInline
        onLoadedMetadata={(event) => {
          const player = event.currentTarget;

          setIsPortrait(
            player.videoWidth > 0 &&
            player.videoHeight > player.videoWidth
          );
        }}
        className="block h-auto w-full bg-slate-950"
        src={video.url}
      >
        Twoja przeglądarka nie obsługuje odtwarzania filmów.
      </video>

      <div className="p-5">
        <h3 className="text-lg font-bold text-emerald-900">
          {video.title || "Film o ubezpieczeniach"}
        </h3>

        {video.description && (
          <p className="mt-2 text-sm text-slate-600">
            {video.description}
          </p>
        )}
      </div>
    </article>
  );
}
