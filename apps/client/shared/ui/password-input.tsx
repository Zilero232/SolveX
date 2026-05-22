'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Input } from './input';
import type * as React from 'react';

type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

const passwordInputStyles = {
  root: 'relative',
  input: 'pr-9',
  toggle:
    'absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
  icon: 'size-4',
} as const;

export const PasswordInput = ({ className, disabled, ...props }: PasswordInputProps) => {
  const [isVisible, toggleVisible] = useBoolean(false);

  return (
    <div className={passwordInputStyles.root}>
      <Input
        className={cn(passwordInputStyles.input, className)}
        disabled={disabled}
        type={isVisible ? 'text' : 'password'}
        {...props}
      />

      <button
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className={passwordInputStyles.toggle}
        disabled={disabled}
        onClick={() => toggleVisible()}
        tabIndex={-1}
        type="button"
      >
        {isVisible ? (
          <EyeOff className={passwordInputStyles.icon} />
        ) : (
          <Eye className={passwordInputStyles.icon} />
        )}
      </button>
    </div>
  );
};
