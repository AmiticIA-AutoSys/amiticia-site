import type { WahubCopy } from "../../../copy/types";
import { Reveal, Section } from "../../../layout/primitives";
import { WhatsAppButton } from "../../../layout/WhatsAppButton";
import poster from "../../../assets/wahub/video-poster-720.webp";

/**
 * The real product on video, right after the hero (whose phone is an illustration). No autoplay:
 * the narration is the content. One column on a phone (title, video, caption, button); from lg the
 * video sits left and title, caption and button stack beside it.
 */
export const WahubVideo = ({ copy, cta }: { copy: NonNullable<WahubCopy["video"]>; cta: string }) => (
  <Section id="video" aria-labelledby="wahub-video-title" className="!pt-0">
    <Reveal>
      <div className="mx-auto grid max-w-[360px] justify-items-center gap-y-8 lg:max-w-4xl lg:grid-cols-[360px_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:justify-items-start lg:gap-x-16 lg:gap-y-5">
        <h2 id="wahub-video-title" className="v2-h2 text-center lg:col-start-2 lg:row-start-2 lg:text-left">
          {copy.title}
        </h2>
        <div className="relative w-full lg:col-start-1 lg:row-span-5 lg:row-start-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-8 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--wahub) / 0.28), transparent)" }}
          />
          <video
            controls
            playsInline
            preload="metadata"
            poster={poster}
            aria-label={copy.label}
            className="relative aspect-[9/16] w-full rounded-[28px] border border-border bg-surface object-cover shadow-[0_24px_60px_-20px_hsl(var(--wahub)/0.45)]"
          >
            <source src="/media/wahub-demo-pt-v1.mp4" type="video/mp4" />
          </video>
        </div>
        <p className="text-center text-sm leading-relaxed text-subtle-foreground lg:col-start-2 lg:row-start-3 lg:text-left">
          {copy.caption}
        </p>
        <WhatsAppButton placement="cta" size="lg" className="lg:col-start-2 lg:row-start-4 lg:mt-3 lg:self-start">
          {cta}
        </WhatsAppButton>
      </div>
    </Reveal>
  </Section>
);
