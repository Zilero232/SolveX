'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui';
import { CreateRoomForm } from './CreateRoomForm';
import type { ReactNode } from 'react';

type CreateRoomDialogProps = {
  // Custom trigger element; falls back to a default "Create room" button.
  trigger?: ReactNode;
};

export const CreateRoomDialog = ({ trigger }: CreateRoomDialogProps) => {
  const t = useTranslations('createRoom');
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus />
            {t('trigger')}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <CreateRoomForm onCreated={() => toggleOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
