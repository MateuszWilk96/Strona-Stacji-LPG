
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

  if (videos.length === 0) return null;

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

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {videos.map((video, index) => (
          <article
            key={`${video.url}-${index}`}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow"
          >
            <video
              controls
              preload="none"
              playsInline
              className="max-h-[560px] w-full bg-slate-950 object-contain"
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
        ))}
      </div>
    </section>
  );
}
