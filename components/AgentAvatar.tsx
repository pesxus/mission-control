interface AgentAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const COLOR_PALETTE = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
] as const;

const SIZE_CLASSES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
} as const;

export function AgentAvatar({ name, size = "md", className = "" }: AgentAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const color = COLOR_PALETTE[hash % COLOR_PALETTE.length];
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color} ${sizeClass} ${className}`}
      title={name}
      aria-label={`Avatar of ${name}`}
    >
      {initial}
    </div>
  );
}
