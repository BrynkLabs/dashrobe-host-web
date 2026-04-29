import svgPaths from "../../../imports/01Login/svg-ix7tjtcsjs";

interface DashrobeLogoProps {
  className?: string;
}

export function DashrobeLogo({ className = "h-10 w-[68px]" }: DashrobeLogoProps) {
  return (
    <div className={className}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 67.9975 40"
      >
        <g>
          <path d={svgPaths.p38270700} fill="#220E92" />
          <path d={svgPaths.p5b1ab00} fill="#220E92" />
          <path d={svgPaths.p14f48b00} fill="#FFC100" />
          <path d={svgPaths.p6422cf0} fill="#220E92" />
          <path d={svgPaths.p1d900d80} fill="#220E92" />
          <path d={svgPaths.p3873f0c0} fill="#220E92" />
          <path d={svgPaths.pa8f9f00} fill="#220E92" />
          <path d={svgPaths.p34b73900} fill="#FFC100" />
          <path d={svgPaths.p38d2f200} fill="#220E92" />
          <path d={svgPaths.p2901cf00} fill="#220E92" />
        </g>
      </svg>
    </div>
  );
}

export function DashrobeLogoWhite({ className = "h-[70px] w-[119px]" }: DashrobeLogoProps) {
  return (
    <div className={className}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 67.9975 40"
      >
        <g>
          <path d={svgPaths.p38270700} fill="#FFFFFF" />
          <path d={svgPaths.p5b1ab00} fill="#FFFFFF" />
          <path d={svgPaths.p14f48b00} fill="#FFC100" />
          <path d={svgPaths.p6422cf0} fill="#FFFFFF" />
          <path d={svgPaths.p1d900d80} fill="#FFFFFF" />
          <path d={svgPaths.p3873f0c0} fill="#FFFFFF" />
          <path d={svgPaths.pa8f9f00} fill="#FFFFFF" />
          <path d={svgPaths.p34b73900} fill="#FFC100" />
          <path d={svgPaths.p38d2f200} fill="#FFFFFF" />
          <path d={svgPaths.p2901cf00} fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
