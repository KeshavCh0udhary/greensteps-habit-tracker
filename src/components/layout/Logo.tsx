
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

const Logo = ({ className, size = "md", withText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative group", sizeClasses[size])}>
        <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse-gentle opacity-30" />
        <div className="relative flex items-center justify-center w-full h-full bg-green-500 rounded-full text-white">
          <svg
            className="w-4/6 h-4/6 animate-leaf-sway"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 3V5C21 14 14 21 5 21H3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 13C16.6 13 11 7.4 11 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {withText && (
        <div className="font-bold text-xl tracking-tight">
          <span className="text-green-600 dark:text-green-400">Green</span>
          <span className="text-foreground">Steps</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
