import { useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useSitePage } from "./page-context";
import { WhatsAppButton } from "./WhatsAppButton";

const itemClass =
  "flex min-h-12 items-center rounded-xl px-3 text-[17px] font-medium text-foreground hover:bg-surface-raised";

/** Mobile/tablet menu (< lg): a right-hand sheet. Radix portals it out of .site-v2, so it carries the class itself. */
export const SiteMenu = () => {
  const { copy } = useSitePage();
  const { nav, menu, headerCta } = copy.common;
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface/70 text-foreground hover:bg-surface-raised lg:hidden"
        aria-label={menu.open}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="site-v2 fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="site-v2 fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col border-l border-border bg-surface p-5 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right data-[state=open]:duration-300 data-[state=closed]:duration-200"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {menu.title}
            </Dialog.Title>
            <Dialog.Close className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-surface-raised">
              <X className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Fechar</span>
            </Dialog.Close>
          </div>
          <nav aria-label={nav.label} className="mt-4 flex flex-col gap-1">
            <p className="px-3 pb-1 pt-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-subtle-foreground">
              {nav.products.label}
            </p>
            {nav.products.items.map((item) => (
              <Link key={item.to} to={item.to} onClick={close} className={itemClass}>
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {nav.links.map((item) => (
              <Link key={item.to} to={item.to} onClick={close} className={itemClass}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6">
            <WhatsAppButton placement="menu" variant="bar">
              {headerCta}
            </WhatsAppButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
