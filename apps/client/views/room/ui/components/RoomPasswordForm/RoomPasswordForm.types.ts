export type RoomPasswordFormProps = {
  displayName: string;
  error: string | undefined;
  isSubmitting: boolean;
  onSubmit: (password: string) => void;
};
