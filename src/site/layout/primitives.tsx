import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

export const Container = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn("v2-container", className)}>{children}</div>
);

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}

export const Section = ({ id, className, containerClassName, children, ...rest }: SectionProps) => (
  <section id={id} className={cn("v2-section relative", id && "v2-anchor", className)} {...rest}>
    <Container className={containerClassName}>{children}</Container>
  </section>
);

interface EyebrowProps {
  children: ReactNode;
  /** CSS colour for the dot; defaults to the brand gradient. */
  dot?: string;
  className?: string;
}

export const Eyebrow = ({ children, dot, className }: EyebrowProps) => (
  <p className={cn("v2-eyebrow", className)} style={dot ? ({ "--eyebrow-dot": dot } as CSSProperties) : undefined}>
    {children}
  </p>
);

interface RevealProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** Extra delay in ms once in view, for staggering siblings. */
  delay?: number;
}

/**
 * Below-the-fold reveal (DESIGN.md rule 4). Server HTML carries data-reveal; site.css hides it
 * only under html.js and forces it visible after 2.5 s until the app mounts. Here, blocks
 * already on or above the screen at mount are revealed before paint; the rest when they scroll in.
 */
export const Reveal = ({ as: Tag = "div", className, children, delay }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.setAttribute("data-revealed", "");
    if (typeof IntersectionObserver === "undefined" || el.getBoundingClientRect().top < window.innerHeight) {
      show();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
};
