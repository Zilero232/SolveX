'use client';

import { useReactions } from '../../model/contexts';
import { reactionsOverlayStyles as s } from './ReactionsOverlay.styles';

export const ReactionsOverlay = () => {
  const { reactions } = useReactions();

  return (
    <div aria-hidden className={s.root}>
      {reactions.map((reaction) => (
        <span key={reaction.id} className={s.item} style={{ marginRight: `${reaction.offset}px` }}>
          {reaction.emoji}
        </span>
      ))}
    </div>
  );
};
