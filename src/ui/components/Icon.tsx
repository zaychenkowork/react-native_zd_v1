import type { SvgProps } from 'react-native-svg';

import { ICONS, type IconName } from '@/ui/assets/icons';

type IconProps = {
  name: IconName;
  size?: number;
} & Omit<SvgProps, 'width' | 'height'>;

export function Icon({ name, size = 20, fill = 'currentColor', ...props }: IconProps) {
  const SvgIcon = ICONS[name];
  if (!SvgIcon) return null;
  return <SvgIcon width={size} height={size} fill={fill} {...props} />;
}
