import { lobbyCardStyles as s } from './LobbyCard.styles';
import type { LobbyCardProps } from './LobbyCard.types';

export const LobbyCard = ({ title, description, children }: LobbyCardProps) => (
  <div className={s.root}>
    <div className={s.header}>
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
    </div>
    {children}
  </div>
);
