import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface FadeInProps {
  children: ReactNode;
  direction?: FadeDirection;
  delay?: number;
  duration?: number;
  className?: string;
  viewportOnce?: boolean;
}

const getDirectionOffset = (direction: FadeDirection) => {
  switch (direction) {
    case 'up':
      return { y: 24, x: 0 };
    case 'down':
      return { y: -24, x: 0 };
    case 'left':
      return { x: 24, y: 0 };
    case 'right':
      return { x: -24, y: 0 };
    case 'none':
    default:
      return { x: 0, y: 0 };
  }
};

export default function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
  viewportOnce = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = getDirectionOffset(direction);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: viewportOnce, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // subtle custom cubic-bezier
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}