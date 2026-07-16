import { fireEvent, render, waitFor } from '@tests/test-utils';

import { useAuthStore } from '@/store';

import { SignInScreen } from '@/features/auth';

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null });
});

describe('SignInScreen', () => {
  it('renders the header and sign-in button', async () => {
    const { getByRole } = await render(<SignInScreen />);

    expect(getByRole('header')).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signIn' })).toBeTruthy();
  });

  it('calls signIn with tokens when the button is pressed', async () => {
    const { getByRole } = await render(<SignInScreen />);

    await fireEvent.press(getByRole('button', { name: 'auth.signIn' }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-access-token');
      expect(useAuthStore.getState().refreshToken).toBe('mock-refresh-token');
    });
  });

  it('starts with no tokens in the store', async () => {
    await render(<SignInScreen />);

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().refreshToken).toBeNull();
  });
});
