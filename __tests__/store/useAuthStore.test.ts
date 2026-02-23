import { signIn, signOut, useAuthStore, waitForAuthHydration } from '@/store';

beforeEach(() => {
  useAuthStore.setState({ token: null });
});

describe('useAuthStore', () => {
  it('starts with null token', () => {
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('sets the token on signIn', () => {
    useAuthStore.getState().signIn('test-token');

    expect(useAuthStore.getState().token).toBe('test-token');
  });

  it('clears the token on signOut', () => {
    useAuthStore.getState().signIn('test-token');
    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().token).toBeNull();
  });

  it('replaces the token when signIn is called again', () => {
    useAuthStore.getState().signIn('first-token');
    useAuthStore.getState().signIn('second-token');

    expect(useAuthStore.getState().token).toBe('second-token');
  });
});

describe('standalone actions', () => {
  it('signIn sets the token via exported function', () => {
    signIn('standalone-token');

    expect(useAuthStore.getState().token).toBe('standalone-token');
  });

  it('signOut clears the token via exported function', () => {
    signIn('some-token');
    signOut();

    expect(useAuthStore.getState().token).toBeNull();
  });
});

describe('waitForAuthHydration', () => {
  it('resolves immediately when store is already hydrated', async () => {
    await expect(waitForAuthHydration()).resolves.toBeUndefined();
  });
});
