'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
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

type CreateRoomDialogProps = {
  // Custom trigger element; falls back to a default "Create room" button.
  trigger?: ReactNode;
};

export const CreateRoomDialog = ({ trigger }: CreateRoomDialogProps) => {
  const [isOpen, toggleOpen] = useBoolean(false);

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button">
            <Plus />
            Create room
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a room</DialogTitle>
          <DialogDescription>Creates a new voice room and takes you in.</DialogDescription>
        </DialogHeader>

        <CreateRoomForm onCreated={() => toggleOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
