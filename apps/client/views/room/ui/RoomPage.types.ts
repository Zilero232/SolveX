export type RoomState =
  | {
      kind: 'active';
      displayName: string;
      onConnectFailure: () => void;
      onLeave: () => void;
      roomId: string;
      token: string;
      url: string;
    }
  | { kind: 'connecting'; displayName: string }
  | { kind: 'loading' }
  | { kind: 'no-id' }
  | { kind: 'not-found' }
  | {
      kind: 'password';
      displayName: string;
      error: string | undefined;
      isSubmitting: boolean;
      onSubmit: (password: string) => Promise<void>;
      roomId: string;
    };
