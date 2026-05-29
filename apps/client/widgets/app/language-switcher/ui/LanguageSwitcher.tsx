'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/entities/app/locale';
import { LOCALES, type Locale } from '@/shared/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FlagGbIcon,
  FlagRuIcon,
} from '@/shared/ui';
import { languageSwitcherStyles as s } from './LanguageSwitcher.styles';
import type { ComponentType, SVGProps } from 'react';

const LOCALE_FLAGS: Record<Locale, ComponentType<SVGProps<SVGSVGElement>>> = {
  en: FlagGbIcon,
  ru: FlagRuIcon,
};

export const LanguageSwitcher = () => {
  const t = useTranslations('language');
  const { locale, setLocale } = useLocale();

  const ActiveFlag = LOCALE_FLAGS[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={t('label')} className={s.trigger} type="button">
        <ActiveFlag className={s.triggerFlag} />
        <ChevronDown className={s.triggerChevron} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={s.content}>
        <DropdownMenuLabel>{t('label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as Locale)}
        >
          {LOCALES.map((code) => {
            const Flag = LOCALE_FLAGS[code];

            return (
              <DropdownMenuRadioItem key={code} value={code}>
                <Flag className={s.itemFlag} />
                <span className={s.itemLabel}>{t(code)}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
