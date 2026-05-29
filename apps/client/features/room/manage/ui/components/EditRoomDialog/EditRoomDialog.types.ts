import type { Room } from '@chatovo/schemas';

export type EditRoomDialogProps = {
  room: Room;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type EditRoomFormProps = {
  room: Room;
  onUpdated?: () => void;
};
