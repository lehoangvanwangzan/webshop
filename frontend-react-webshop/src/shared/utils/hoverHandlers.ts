import type { MouseEvent } from 'react';
import { COLORS } from '../constants/colors';

export const categoryCardHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
    el.style.borderColor = COLORS.primary;
    el.style.transform = 'translateY(-2px)';
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.boxShadow = 'none';
    el.style.borderColor = '#e5e7eb';
    el.style.transform = 'translateY(0)';
  },
};

export const subCategoryCardHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.borderColor = COLORS.primary;
    el.style.boxShadow = '0 4px 12px rgba(220,38,38,0.12)';
    el.style.transform = 'translateY(-2px)';
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.borderColor = '#f3f4f6';
    el.style.boxShadow = 'none';
    el.style.transform = 'translateY(0)';
  },
};

export const categoryRowHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.background = COLORS.primaryLight;
    el.style.color = COLORS.primary;
    el.style.paddingLeft = '20px';
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.background = '';
    el.style.color = '#374151';
    el.style.paddingLeft = '16px';
  },
};

export const categoryFooterHover = {
  onMouseEnter: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = COLORS.primaryBorder;
  },
  onMouseLeave: (e: MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = COLORS.primaryLight;
  },
};
