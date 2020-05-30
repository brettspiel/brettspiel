import React from "react";
import c from "classnames";
import styles from "./styles.module.css";

type Props = {} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const TransparentInput = React.forwardRef<any, Props>(
  ({ className, ...restProps }, ref) => (
    <input ref={ref} className={c(styles.input, className)} {...restProps} />
  )
);
