import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import poster from "../../../assets/wahub/video-poster-720.webp";

/**
 * The real product on video, right after the hero (whose phone is an illustration). No autoplay:
 * the narration is the content. One column on a phone (title, video, caption); from lg the video
 * sits left and title and caption stack beside it. No WhatsApp button beside the video, because
 * the hero's sits right above it: the button shows on an end card once the video finishes, when
 * the viewer has just seen the product working.
 */
export const WahubVideo = ({ copy, cta }: { copy: NonNullable<WahubCopy["video"]>; cta: string }) => {
  const video = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  const onEnded = () => {
    // A fullscreen player would hide the card: come back to the page to show it.
    const v = video.current as (HTMLVideoElement & { webkitExitFullscreen?: () => void }) | null;
    if (document.fullscreenElement) void document.exitFullscreen?.().catch(() => {});
    else v?.webkitExitFullscreen?.();
    setEnded(true);
  };

  const replay = () => {
    const v = video.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    v.focus();
    void v.play()?.catch(() => {});
  };

  return (
    <Section id="video" aria-labelledby="wahub-video-title" className="!pt-0">
      <Reveal>
        <div className="mx-auto grid max-w-[360px] justify-items-center gap-y-8 lg:max-w-4xl lg:grid-cols-[360px_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:justify-items-start lg:gap-x-16 lg:gap-y-5">
          <h2 id="wahub-video-title" className="v2-h2 text-center lg:col-start-2 lg:row-start-2 lg:text-left">
            {copy.title}
          </h2>
          <div className="relative w-full lg:col-start-1 lg:row-span-4 lg:row-start-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 rounded-full opacity-60 blur-3xl"
              style={{ background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.28), transparent)" }}
            />
            <video
              ref={video}
              controls
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={copy.label}
              onEnded={onEnded}
              onPlay={() => setEnded(false)}
              className="relative aspect-[9/16] w-full rounded-[28px] border border-border bg-surface object-cover shadow-[0_24px_60px_-20px_hsl(var(--wahub)/0.45)]"
            >
              <source src="/media/wahub-demo-pt-v1.mp4" type="video/mp4" />
            </video>
            {ended && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-[28px] bg-background/80 px-6 text-center backdrop-blur-md motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
                <p className="text-2xl font-semibold leading-tight tracking-tight text-foreground">{copy.endTitle}</p>
                <WhatsAppButton placement="video" size="lg">
                  {cta}
                </WhatsAppButton>
                <button
                  type="button"
                  onClick={replay}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {copy.replay}
                </button>
              </div>
            )}
          </div>
          <p className="text-center text-sm leading-relaxed text-subtle-foreground lg:col-start-2 lg:row-start-3 lg:text-left">
            {copy.caption}
          </p>
        </div>
      </Reveal>
    </Section>
  );
};
