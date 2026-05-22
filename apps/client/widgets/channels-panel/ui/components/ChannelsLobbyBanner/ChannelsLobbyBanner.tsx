'use client';

import { AudioLines, Lightbulb, Radio, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sortBy, sumBy, values } from 'remeda';
import { useRooms, useRoomsPresence } from '@/entities/room';
import { CreateRoomDialog } from '@/features/create-room';
import { buildRoomHref } from '@/shared/constants';
import { Button } from '@/shared/ui';
import { channelsLobbyBannerStyles as s } from './ChannelsLobbyBanner.styles';

// Shown in place of the room list while on the lobby — the rooms are already
// laid out on the page itself, so this slot becomes a hub: live stats, a
// one-click jump into the busiest room, and a create-room CTA.
export const ChannelsLobbyBanner = () => {
  const router = useRouter();
  const { rooms } = useRooms();
  const presence = useRoomsPresence();

  const peopleOnline = sumBy(values(presence), (participants) => participants.length);

  // The single busiest room, if anyone is on a call right now.
  const [busiest] = sortBy(
    rooms.filter((room) => (presence[room.id]?.length ?? 0) > 0),
    [(room) => presence[room.id]?.length ?? 0, 'desc'],
  );

  return (
    <div className={s.root}>
      <div className={s.card}>
        <div className={s.iconBox}>
          <AudioLines className={s.icon} />
        </div>

        <div className={s.text}>
          <p className={s.title}>You're in the lobby</p>
          <p className={s.hint}>Pick a room from the page, or start a new one.</p>
        </div>

        <CreateRoomDialog
          trigger={
            <Button className={s.cta} type="button">
              Create a room
            </Button>
          }
        />
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <Users className={s.statIcon} />
          <span className={s.statValue}>{rooms.length}</span>
          <span className={s.statLabel}>{rooms.length === 1 ? 'room' : 'rooms'}</span>
        </div>
        <div className={s.stat}>
          <Radio className={peopleOnline > 0 ? s.statIconLive : s.statIcon} />
          <span className={s.statValue}>{peopleOnline}</span>
          <span className={s.statLabel}>online</span>
        </div>
      </div>

      {busiest && (
        <button
          className={s.quickJoin}
          type="button"
          onClick={() => router.push(buildRoomHref(busiest.id))}
        >
          <span className={s.quickJoinDot} />
          <span className={s.quickJoinText}>
            <span className={s.quickJoinLabel}>Busiest now</span>
            <span className={s.quickJoinName}>{busiest.name}</span>
          </span>
          <span className={s.quickJoinAction}>Join</span>
        </button>
      )}

      <div className={s.tip}>
        <Lightbulb className={s.tipIcon} />
        <span>Private rooms need a password to join.</span>
      </div>
    </div>
  );
};
