import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'primary' | 'secondary';
  isOutlined?: boolean;
};

export function Button(props: ButtonProps) {
  const { color = 'primary', isOutlined = false } = props;
  const secondary = color === 'secondary';
  return (
    <button
      className={`button ${secondary && ' secondary '} ${
        isOutlined && ' outlined '
      }`}
      {...props}></button>
  );
}
