// Adapted from Cult UI — https://www.cult-ui.com/r/mock-browser-window.json (MIT)

import type React from "react"
import { cn } from "@/lib/utils"
import { TextureOverlay, type TextureType } from "./texture-overlay"

export interface SidebarItem {
  icon?: React.ReactNode
  label: string
  active?: boolean
  badge?: string | number
}

export interface WindowControlsProps {
  variant?: "macos" | "windows" | "chrome" | "safari"
  headerStyle?: "minimal" | "full"
}

export interface AddressBarProps {
  url?: string
  secure?: boolean
  variant?: "chrome" | "safari"
  className?: string
}

export interface SidebarContentProps {
  items?: SidebarItem[]
  variant?: "navigation" | "bookmarks" | "history" | "extensions"
  className?: string
}

export interface BrowserWindowProps {
  children?: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  showSidebar?: boolean
  sidebarPosition?: "left" | "right" | "top" | "bottom"
  headerStyle?: "minimal" | "full"
  variant?: "chrome" | "safari" | "generic"
  theme?: "light" | "dark" | "auto"
  url?: string
  sidebarItems?: SidebarItem[]
  texture?: TextureType
  textureOpacity?: number
  mask?: boolean
}

export function WindowControls({
  variant = "macos",
  headerStyle = "full",
}: WindowControlsProps) {
  const sizeClasses = "size-2.5"

  if (variant === "macos" || variant === "safari") {
    const dotColors =
      headerStyle === "minimal"
        ? {
            red: "bg-muted border border-border",
            yellow: "bg-muted border border-border",
            green: "bg-muted border border-border",
          }
        : {
            red: "bg-red-500 hover:bg-red-600 border border-black/20",
            yellow: "bg-yellow-500 hover:bg-yellow-600 border border-black/20",
            green: "bg-green-500 hover:bg-green-600 border border-black/20",
          }

    return (
      <div className="flex gap-2" aria-hidden="true">
        <div
          className={cn(
            sizeClasses,
            "rounded-full",
            dotColors.red,
            "group flex cursor-pointer items-center justify-center transition-colors focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none"
          )}
        >
          {headerStyle !== "minimal" && (
            <div className="h-0.5 w-1.5 bg-red-950/60 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
        <div
          className={cn(
            sizeClasses,
            "rounded-full",
            dotColors.yellow,
            "group flex cursor-pointer items-center justify-center transition-colors focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none"
          )}
        >
          {headerStyle !== "minimal" && (
            <div className="h-0.5 w-1.5 bg-yellow-950/60 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
        <div
          className={cn(
            sizeClasses,
            "rounded-full",
            dotColors.green,
            "group flex cursor-pointer items-center justify-center transition-colors focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none"
          )}
        >
          {headerStyle !== "minimal" && (
            <div className="h-1 w-1 border border-green-950/60 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </div>
    )
  }

  if (variant === "windows") {
    return (
      <div className="flex gap-1" aria-hidden="true">
        <div className="bg-muted/50 hover:bg-muted flex h-4 w-6 cursor-pointer items-center justify-center transition-colors">
          <div className="bg-foreground/60 h-0.5 w-2" />
        </div>
        <div className="bg-muted/50 hover:bg-muted flex h-4 w-6 cursor-pointer items-center justify-center transition-colors">
          <div className="border-foreground/60 h-2 w-2 border" />
        </div>
        <div className="flex h-4 w-6 cursor-pointer items-center justify-center bg-red-500/80 transition-colors hover:bg-red-500">
          <div className="h-0.5 w-2 rotate-45 bg-white" />
          <div className="absolute h-0.5 w-2 -rotate-45 bg-white" />
        </div>
      </div>
    )
  }

  if (variant === "chrome") {
    return (
      <div className="flex gap-1.5" aria-hidden="true">
        <div
          className={cn(
            sizeClasses,
            "cursor-pointer rounded-full bg-red-500 transition-colors hover:bg-red-600"
          )}
        />
        <div
          className={cn(
            sizeClasses,
            "cursor-pointer rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
          )}
        />
        <div
          className={cn(
            sizeClasses,
            "cursor-pointer rounded-full bg-green-500 transition-colors hover:bg-green-600"
          )}
        />
      </div>
    )
  }

  return (
    <div className="flex gap-1.5" aria-hidden="true">
      <div className={cn(sizeClasses, "border-border bg-muted/60 rounded-full border")} />
      <div className={cn(sizeClasses, "border-border bg-muted/60 rounded-full border")} />
      <div className={cn(sizeClasses, "border-border bg-muted/60 rounded-full border")} />
    </div>
  )
}

export function AddressBar({
  url = "https://example.com",
  secure = true,
  variant = "chrome",
  className = "",
}: AddressBarProps) {
  const variantStyles = {
    chrome:
      "bg-muted/40 rounded-full border border-border shadow-[0px_1px_2px_0px_hsl(var(--border)/0.1)_inset] backdrop-blur-sm",
    safari:
      "bg-muted/30 rounded-lg border border-border shadow-[0px_1px_2px_0px_hsl(var(--border)/0.1)_inset] backdrop-blur-sm",
  }

  const iconColors = {
    chrome: "text-muted-foreground/60",
    safari: "text-muted-foreground/60",
  }

  return (
    <div className={cn("flex flex-1 justify-center", className)}>
      <div
        className={cn(
          variantStyles[variant],
          "text-muted-foreground flex max-w-md min-w-[200px] items-center gap-2 px-4 py-1.5 text-xs transition-colors"
        )}
      >
        {secure && (
          <div className={cn("size-3 shrink-0", iconColors[variant])} aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="currentColor">
              <title>Secure</title>
              <path d="M6 1a2.5 2.5 0 0 1 2.5 2.5V5h.5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.5V3.5A2.5 2.5 0 0 1 6 1z" />
            </svg>
          </div>
        )}
        <span className="truncate">{url}</span>
      </div>
    </div>
  )
}

export function SidebarContent({
  items = [
    { label: "Dashboard", active: true },
    { label: "Analytics", badge: "3" },
    { label: "Settings" },
    { label: "Profile" },
  ],
  className = "",
}: SidebarContentProps) {
  return (
    <div className={cn("space-y-1 p-3", className)}>
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background outline-none",
            item.active
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
          )}
        >
          {item.icon && (
            <div className="size-4 shrink-0" aria-hidden="true">{item.icon}</div>
          )}
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <div className="bg-primary/10 text-primary min-w-[16px] rounded-full px-1.5 py-0.5 text-center text-xs">
              {item.badge}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export function BrowserWindow({
  children,
  className = "",
  size = "md",
  showSidebar = false,
  sidebarPosition = "left",
  headerStyle = "minimal",
  variant = "generic",
  theme = "auto",
  url,
  sidebarItems,
  texture,
  textureOpacity,
  mask = false,
}: BrowserWindowProps) {
  const sizeClasses = {
    sm: "h-64 max-w-sm",
    md: "h-80 max-w-2xl",
    lg: "h-96 max-w-4xl",
    xl: "h-[32rem] max-w-6xl",
  }

  const sidebarSizes = {
    sm: "w-32",
    md: "w-48",
    lg: "w-56",
    xl: "w-64",
  }

  const themeClasses =
    theme === "dark"
      ? "bg-card text-card-foreground border-border"
      : theme === "light"
        ? "bg-card text-card-foreground border-border"
        : "bg-card text-card-foreground border-border"

  const getHeaderStyles = () => {
    const baseStyles = "h-11 border-b border-border flex items-center px-4"

    if (variant === "chrome") {
      return `${baseStyles} bg-muted/20 overflow-hidden`
    }

    if (variant === "safari") {
      return `${baseStyles} bg-muted/20 overflow-hidden`
    }

    return `${baseStyles} bg-muted/30`
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border shadow-[0px_1px_3px_0px_hsl(var(--border)/0.2),0px_0px_0px_1px_hsl(var(--border)/0.3)]",
        mask &&
          "[mask-image:linear-gradient(to_bottom,black_50%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent)]",
        sizeClasses[size],
        themeClasses,
        "flex flex-col overflow-hidden",
        className
      )}
    >
      {texture && texture !== "none" && (
        <TextureOverlay texture={texture} opacity={textureOpacity} />
      )}

      <div className={getHeaderStyles()}>
        <WindowControls
          variant={variant === "generic" ? "macos" : variant}
          headerStyle={headerStyle}
        />

        {headerStyle === "full" && (
          <AddressBar
            url={url}
            variant={variant === "generic" ? "chrome" : variant}
            className="ml-4"
          />
        )}
      </div>

      {showSidebar && sidebarPosition === "top" && (
        <div className="border-b border-border bg-muted/10 h-16">
          <SidebarContent
            items={sidebarItems}
            variant="navigation"
            className="flex-row"
          />
        </div>
      )}

      <div className="flex h-0 flex-1">
        {/* Left Sidebar */}
        {showSidebar && sidebarPosition === "left" && (
          <div
            className={cn(
              "border-r border-border bg-muted/10 h-full shrink-0",
              sidebarSizes[size]
            )}
          >
            <SidebarContent items={sidebarItems} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="relative h-full min-w-0 flex-1">
          {children || <div className="absolute inset-0">{children}</div>}
        </div>

        {/* Right Sidebar */}
        {showSidebar && sidebarPosition === "right" && (
          <div
            className={cn(
              "border-l border-border bg-muted/10 h-full shrink-0",
              sidebarSizes[size]
            )}
          >
            <SidebarContent items={sidebarItems} />
          </div>
        )}
      </div>

      {/* Bottom Sidebar */}
      {showSidebar && sidebarPosition === "bottom" && (
        <div className="border-t border-border bg-muted/10 h-16">
          <SidebarContent
            items={sidebarItems}
            variant="navigation"
            className="flex-row"
          />
        </div>
      )}
    </div>
  )
}

export default BrowserWindow
