export interface RoomPasswordFormProps {
  displayName: string;
  error: string | undefined;
  isSubmitting: boolean;
  onSubmit: (password: string) => Promise<void>;
}
