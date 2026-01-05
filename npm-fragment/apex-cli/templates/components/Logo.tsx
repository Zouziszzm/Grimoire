import { forwardRef } from "react";

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  paths: string[];
}

export const Svg = forwardRef<SVGSVGElement, SvgProps>(
  (
    { paths, width = "100%", height = "100%", className = "", ...props },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 575 250"
        stroke="currentColor"
        width={width}
        height={height}
        fill="currentColor"
        className={`scale-120 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {paths.map((d: string, idx: number) => (
          <path key={idx} d={d} strokeWidth={0} stroke="currentColor" />
        ))}
      </svg>
    );
  }
);

Svg.displayName = "Svg";
