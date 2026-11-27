import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { CookieConsent } from '../CookieConsent';

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.head.querySelectorAll('script').forEach((s) => s.remove());
  });

  it('does not inject analytics scripts when user rejects cookies', () => {
    render(<CookieConsent />);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    const rejectBtn = screen.getByRole('button', { name: 'Reject' });
    fireEvent.click(rejectBtn);

    expect(localStorage.getItem('dream-avenue-cookie-consent')).toBe('rejected');
    expect(document.head.querySelectorAll('script[src*="googletagmanager"]').length).toBe(0);
  });

  it('injects gtag script only once when user accepts cookies', () => {
    render(<CookieConsent />);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    const acceptBtn = screen.getByRole('button', { name: 'Accept All' });
    fireEvent.click(acceptBtn);

    expect(localStorage.getItem('dream-avenue-cookie-consent')).toBe('accepted');
    expect(document.head.querySelectorAll('script[src*="googletagmanager"]').length).toBe(1);
  });
});
