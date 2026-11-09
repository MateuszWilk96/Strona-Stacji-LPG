
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../context/SettingsContext";

function VideoCard({ video, playerRef }) {
  const [isPortrait, setIsPortrait] = useState(false);

  return (
    <article
      className={`w-full shrink-0 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl ${
        isPortrait ? "max-w-[280px]" : "max-w-[640px]"
      }`}
      style={{
        flex: isPortrait ? "0 1 280px" : "1 1 360px",
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

  const [isMobile, setIsMobile] = useState(false);
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

  const showNavigation = videos.length > visibleCount;

  return (
    <section
      id="filmy"
      className="container mx-auto px-4 py-14 sm:px-6"
    >
      <div className="rounded-[32px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 px-4 py-10 shadow-2xl sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">
            Twoja Strefa
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            Poznaj nasze ubezpieczenia
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-emerald-100">
            Krótkie materiały o ubezpieczeniach i naszej ofercie.
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1160px] items-center justify-center gap-3">
          {showNavigation && (
            <button
              type="button"
              onClick={() => moveTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Poprzedni film"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              &#8249;
            </button>
          )}

          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-6">
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

          {showNavigation && (
            <button
              type="button"
              onClick={() => moveTo(currentIndex + 1)}
              disabled={currentIndex === maxIndex}
              aria-label="Następny film"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-2xl text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              &#8250;
            </button>
          )}
        </div>

        {showNavigation && (
          <div
            className="mt-8 flex justify-center gap-2"
            aria-label="Pozycja karuzeli"
          >
            {Array.from(
              { length: maxIndex + 1 },
              (_, position) => (
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
                      ? "bg-amber-300"
                      : "bg-emerald-600 hover:bg-emerald-400"
                  }`}
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
