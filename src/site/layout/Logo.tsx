import logo from "../assets/amiticia-logo.svg";

/** The AmiticIA wordmark. 132 px wide max (fits the 360 px header). */
export const Logo = ({ className }: { className?: string }) => (
  <img src={logo} alt="" width={132} height={29} decoding="async" className={className ?? "h-[29px] w-[132px]"} />
);
