import classNames from "classnames";
import { Cell } from "../interface/ticTacToe.type";
import { winnerSignal } from "../signal";
import { Circle, Cross } from "./Pieces";
import styles from "./TicTacToe.module.css";

interface CellProps {
  cell: Cell;
  row: number;
  col: number;
  handleClick: (row: number, col: number) => void;
}

export function SingleCell(props: CellProps) {
  const { cell } = props;
  return (
    <button
      className={classNames(
        styles.cell,
        "gap-3 size-20 transition flex items-center justify-center",
        { [styles["winning-cell"]]: cell.winningCell },
        { [styles["filled-cell"]]: !!cell.value },
        { [styles["will-disappear-cell"]]: cell.willDisappear }
      )}
      disabled={!!cell.value || !!winnerSignal.value}
      onClick={() => props.handleClick(props.row, props.col)}
    >
      {cell.value === "X" ? <Cross /> : cell.value === "O" ? <Circle /> : null}
    </button>
  );
}
