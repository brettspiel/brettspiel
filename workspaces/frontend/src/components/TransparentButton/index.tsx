import React from "react";
import c from "classnames";
import styles from "./styles.module.css";

export type Props = {} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const TransparentButton: React.FunctionComponent<Props> = ({
  className,
  ...restProps
}) => <button className={c(styles.button, className)} {...restProps} />;
