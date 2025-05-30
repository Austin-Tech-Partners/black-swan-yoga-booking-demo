import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

const Card = ({
  children,
  variant = 'default',
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-lg bg-white',
        {
          'border border-gray-200': variant === 'default',
          'shadow-lg': variant === 'elevated',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 