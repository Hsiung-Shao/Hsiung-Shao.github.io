import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ExileMockup from '../src/components/react/poe/ExileMockup';
import MarketMockup from '../src/components/react/poe/MarketMockup';
import PobMockup from '../src/components/react/poe/PobMockup';

describe('/poe 示意元件', () => {
  it('MarketMockup 切到 English 後顯示英文詞綴且中文消失', async () => {
    const user = userEvent.setup();
    render(<MarketMockup />);

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByText(/\+92 to maximum Life/)).toBeInTheDocument();
    expect(screen.queryByText(/\+92 最大生命/)).not.toBeInTheDocument();
  });

  it('MarketMockup 關閉詞綴雙語後英文副行消失', async () => {
    const user = userEvent.setup();
    render(<MarketMockup />);

    expect(screen.getByText(/\+92 to maximum Life/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /詞綴雙語顯示/ }));

    expect(screen.queryByText(/\+92 to maximum Life/)).not.toBeInTheDocument();
  });

  it('PobMockup 點 English 後該按鈕為按下狀態、繁中取消', async () => {
    const user = userEvent.setup();
    render(<PobMockup />);

    await user.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '繁中' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('ExileMockup 預設 PoE2 顯示靈魂之井,切到 PoE1 後消失', async () => {
    const user = userEvent.setup();
    render(<ExileMockup />);

    expect(screen.getAllByText(/靈魂之井/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'PoE1' }));

    expect(screen.queryByText(/靈魂之井/)).not.toBeInTheDocument();
  });
});
