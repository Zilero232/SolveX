import type { checkSizes } from './UserName.styles';

export type UserNameProps = {
  name: string;
  verified?: boolean;
  profileUrl?: string | null;
  size?: keyof typeof checkSizes;
  className?: string;
};
