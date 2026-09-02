import type { IconType } from "react-icons";
import {
  LuArrowDown,
  LuArrowUp,
  LuBell,
  LuBriefcaseBusiness,
  LuCalendarDays,
  LuChevronRight,
  LuCircleCheck,
  LuCircleHelp,
  LuClock3,
  LuEllipsis,
  LuEye,
  LuEyeOff,
  LuFileText,
  LuLayoutDashboard,
  LuLogOut,
  LuMail,
  LuMenu,
  LuMoon,
  LuPlus,
  LuSettings,
  LuShieldCheck,
  LuSparkles,
  LuSun,
  LuWalletCards,
  LuX,
} from "react-icons/lu";
import type { IconName } from "@/app/lib/mock-data";

const icons: Record<IconName, IconType> = {
  dashboard: LuLayoutDashboard,
  calendar: LuCalendarDays,
  file: LuFileText,
  settings: LuSettings,
  logout: LuLogOut,
  menu: LuMenu,
  close: LuX,
  bell: LuBell,
  chevronRight: LuChevronRight,
  clock: LuClock3,
  check: LuCircleCheck,
  wallet: LuWalletCards,
  arrowUp: LuArrowUp,
  arrowDown: LuArrowDown,
  briefcase: LuBriefcaseBusiness,
  mail: LuMail,
  shield: LuShieldCheck,
  plus: LuPlus,
  more: LuEllipsis,
  help: LuCircleHelp,
  sparkles: LuSparkles,
  eye: LuEye,
  eyeOff: LuEyeOff,
  sun: LuSun,
  moon: LuMoon,
};

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
  className,
}: IconProps) {
  const Component = icons[name];
  return (
    <Component
      aria-hidden="true"
      className={className}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
