import classNames from "classnames";
import styles from "./TicTacToe.module.css";

export function Cross() {
  return <div className={classNames(styles["cross"])}></div>;
}

export function Circle() {
  return <div className={classNames(styles["circle"])}></div>;
}
