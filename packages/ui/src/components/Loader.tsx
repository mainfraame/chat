import { createSvgIcon, SvgIconProps } from '@mui/material';

import { FC } from 'react';

export const Loader: FC<SvgIconProps> = createSvgIcon(
  <>
    <g transform='translate(25 50)'>
      <circle cx='0' cy='0' fill='inherit' r='6'>
        <animateTransform
          attributeName='transform'
          begin='-0.3333333333333333s'
          calcMode='spline'
          dur='1s'
          keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
          keyTimes='0;0.5;1'
          repeatCount='indefinite'
          type='scale'
          values='0;1;0'
        />
      </circle>
    </g>
    <g transform='translate(50 50)'>
      <circle cx='0' cy='0' fill='inherit' r='6'>
        <animateTransform
          attributeName='transform'
          begin='-0.16666666666666666s'
          calcMode='spline'
          dur='1s'
          keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
          keyTimes='0;0.5;1'
          repeatCount='indefinite'
          type='scale'
          values='0;1;0'
        />
      </circle>
    </g>
    <g transform='translate(75 50)'>
      <circle cx='0' cy='0' fill='inherit' r='6'>
        <animateTransform
          attributeName='transform'
          begin='0s'
          calcMode='spline'
          dur='1s'
          keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
          keyTimes='0;0.5;1'
          repeatCount='indefinite'
          type='scale'
          values='0;1;0'
        />
      </circle>
    </g>
  </>,
  'Loader'
);

Loader.defaultProps = {
  viewBox: '0 0 100 100'
};
