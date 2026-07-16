import type { ComponentType } from 'react';

export const init = jest.fn();
export const captureException = jest.fn();
export const captureMessage = jest.fn();
export const addBreadcrumb = jest.fn();
export const setUser = jest.fn();
export const wrap = <P extends object>(Component: ComponentType<P>) =>
  Component;
