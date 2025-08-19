import React from 'react';
import styles from './Button.module.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        className={styles.button}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export default Button;
