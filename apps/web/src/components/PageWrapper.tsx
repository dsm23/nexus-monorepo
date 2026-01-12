import { createContext, useContext } from "react";
import type { CSSProperties, FunctionComponent, ReactNode } from "react";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

interface AnimationContextType {
  getItemStyle: (index: number) => CSSProperties;
  getItemClassName: (baseClasses?: string) => string;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({
  children,
  className = "",
}) => {
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation({
    staggerDelay: 50,
    duration: 600,
  });

  return (
    <AnimationContext.Provider value={{ getItemStyle, getItemClassName }}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </AnimationContext.Provider>
  );
};

interface PageSectionProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export const PageSection: FunctionComponent<PageSectionProps> = ({
  children,
  index,
  className = "",
}) => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error("PageSection must be used within a PageWrapper");
  }

  const { getItemStyle, getItemClassName } = context;

  return (
    <div style={getItemStyle(index)} className={getItemClassName(className)}>
      {children}
    </div>
  );
};
