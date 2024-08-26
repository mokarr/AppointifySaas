import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/locales/en.json';

import { CenteredFooter } from './CenteredFooter';

describe('CenteredFooter', () => {
  describe('Render method', () => {
    it('should have copyright information', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CenteredFooter logo={null} name="" iconList={null} legalLinks={null}>
            Random children
          </CenteredFooter>
        </NextIntlClientProvider>,
      );

      const copyright = screen.getByText(/Copyright/);
      // const copyright = screen.getByText(/© Copyright/); Deleted copyright sign because terser errors on non ASCCII Characters

      expect(copyright).toBeInTheDocument();
    });
  });
});
