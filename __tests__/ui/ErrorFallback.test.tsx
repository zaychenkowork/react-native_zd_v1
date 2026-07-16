import { fireEvent, render } from '@tests/test-utils';

import { ErrorFallback } from '@/ui/components/ErrorFallback';

describe('ErrorFallback', () => {
  const error = new Error('Something broke');

  it('renders the error message', async () => {
    const { getByText } = await render(<ErrorFallback error={error} />);

    expect(getByText('Something broke')).toBeTruthy();
  });

  it('renders the translated title and header', async () => {
    const { getByRole } = await render(<ErrorFallback error={error} />);

    expect(getByRole('header')).toBeTruthy();
  });

  it('renders the retry button when onRetry is provided', async () => {
    const onRetry = jest.fn();
    const { getByRole } = await render(
      <ErrorFallback error={error} onRetry={onRetry} />,
    );

    expect(getByRole('button')).toBeTruthy();
  });

  it('hides the retry button when onRetry is not provided', async () => {
    const { queryByRole } = await render(<ErrorFallback error={error} />);

    expect(queryByRole('button')).toBeNull();
  });

  it('calls onRetry when the retry button is pressed', async () => {
    const onRetry = jest.fn();
    const { getByRole } = await render(
      <ErrorFallback error={error} onRetry={onRetry} />,
    );

    await fireEvent.press(getByRole('button'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not call onRetry on its own', async () => {
    const onRetry = jest.fn();
    await render(<ErrorFallback error={error} onRetry={onRetry} />);

    expect(onRetry).not.toHaveBeenCalled();
  });

  it('displays different error messages correctly', async () => {
    const customError = new Error('Custom failure reason');
    const { getByText } = await render(<ErrorFallback error={customError} />);

    expect(getByText('Custom failure reason')).toBeTruthy();
  });
});
