import { ButtonHTMLAttributes } from "react";

import "../styles/button.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "secondary";
};

export function Button(props: ButtonProps) {
  const { color = "primary" } = props;
  const secondary = color === "secondary";
  return (
    <button
      className={`button ${secondary && "secondary"}`}
      {...props}
    ></button>
  );
}
