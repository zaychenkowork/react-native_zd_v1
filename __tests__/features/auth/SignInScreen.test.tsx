import { fireEvent, render } from '@tests/test-utils';

import { useAuthStore } from '@/store';

import { SignInScreen } from '@/features/auth/screens/SignInScreen/SignInScreen';

beforeEach(() => {
  useAuthStore.setState({ token: null });
});

describe('SignInScreen', () => {
  it('renders the header and sign-in button', () => {
    const { getByRole } = render(<SignInScreen />);

    expect(getByRole('header')).toBeTruthy();
    expect(getByRole('button', { name: 'auth.signIn' })).toBeTruthy();
  });

  it('calls signIn with a token when the button is pressed', () => {
    const { getByRole } = render(<SignInScreen />);

    fireEvent.press(getByRole('button', { name: 'auth.signIn' }));

    expect(useAuthStore.getState().token).toBe('mock-token');
  });

  it('starts with no token in the store', () => {
    render(<SignInScreen />);

    expect(useAuthStore.getState().token).toBeNull();
  });
});
