'use client';

import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AUTH_EQ_BARS, AUTH_FEATURES } from '../../../config';
import { authBrandPanelStyles as s } from './AuthBrandPanel.styles';

export const AuthBrandPanel = () => {
  const t = useTranslations('auth');

  return (
    <aside className={s.root}>
      <div className={s.orb} />

      <div className={s.top}>
        <span className={s.mark}>
          <Sparkles className="size-5" />
        </span>
        <span className={s.wordmark}>{t('appName')}</span>
      </div>

      <div className={s.center}>
        <h2 className={s.tagline}>{t('tagline')}</h2>

        <div className={s.features}>
          {AUTH_FEATURES.map(({ key, Icon }, index) => (
            <div
              key={key}
              className={s.feature}
              style={{ animationDelay: `${150 + index * 120}ms` }}
            >
              <span className={s.featureIcon}>
                <Icon className="size-4" />
              </span>
              <div className={s.featureBody}>
                <p className={s.featureTitle}>{t(`features.${key}.title`)}</p>
                <p className={s.featureDesc}>{t(`features.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.equalizer} aria-hidden>
        {AUTH_EQ_BARS.map((bar) => (
          <span
            key={bar.id}
            className={s.eqBar}
            style={{ height: bar.height, animationDelay: bar.delay }}
          />
        ))}
      </div>
    </aside>
  );
};
