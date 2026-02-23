jest.mock('expo-secure-store', () => {
  // Pre-seed a deterministic key so getOrCreateMmkvKey() returns it
  // immediately without calling crypto.getRandomValues in tests.
  const mockStore = new Map<string, string>([
    ['mmkv_encryption_key', 'test-encryption-key-32-bytes!!!!'],
  ]);

  return {
    getItemAsync: jest.fn((key: string) =>
      Promise.resolve(mockStore.get(key) ?? null),
    ),
    setItemAsync: jest.fn((key: string, value: string) => {
      mockStore.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key: string) => {
      mockStore.delete(key);
      return Promise.resolve();
    }),
  };
});
