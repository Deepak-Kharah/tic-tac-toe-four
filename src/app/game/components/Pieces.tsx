import styles from "./TicTacToe.module.css";

export function Cross() {
  return <div className={styles["cross"]}></div>;
}

export function Circle() {
  return <div className={styles["circle"]}></div>;
}
