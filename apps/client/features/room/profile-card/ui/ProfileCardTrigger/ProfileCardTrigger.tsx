'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui';
import { ProfileCard } from '../ProfileCard';
import type { ProfileCardTriggerProps } from './ProfileCardTrigger.types';

export const ProfileCardTrigger = ({ identity, name, children }: ProfileCardTriggerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-4" sideOffset={8}>
        <ProfileCard identity={identity} name={name} />
      </PopoverContent>
    </Popover>
  );
};
