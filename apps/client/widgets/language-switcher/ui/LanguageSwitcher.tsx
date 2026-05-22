'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/entities/locale';
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

// SVG flag per locale — real flags render identically on every OS, unlike
// emoji flags, which Windows does not display at all.
const LOCALE_FLAGS: Record<Locale, ComponentType<SVGProps<SVGSVGElement>>> = {
  en: FlagGbIcon,
  ru: FlagRuIcon,
};

// A compact language picker: the current locale's flag opens a dropdown to
// switch UI language. The choice is persisted (see useLocale), so the whole
// app re-renders in the new language instantly.
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
