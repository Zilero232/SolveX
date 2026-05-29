'use client';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCurrentUser } from '@/entities/auth/user';
import { cn } from '@/shared/lib/cn';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { DeleteRoomDialog, EditRoomDialog } from './components';
import { manageRoomMenuStyles as s } from './ManageRoomMenu.styles';
import type { ManageRoomMenuProps } from './ManageRoomMenu.types';

export const ManageRoomMenu = ({ room, className }: ManageRoomMenuProps) => {
  const t = useTranslations('manageRoom.menu');

  const { user } = useCurrentUser();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === room.ownerId;

  if (!isOwner) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={t('open')}
            className={cn(s.trigger, className)}
            size="icon"
            variant="ghost"
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            {t('edit')}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 />
            {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditRoomDialog open={editOpen} room={room} onOpenChange={setEditOpen} />
      <DeleteRoomDialog open={deleteOpen} room={room} onOpenChange={setDeleteOpen} />
    </>
  );
};
