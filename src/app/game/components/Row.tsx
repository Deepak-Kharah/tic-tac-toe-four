import { Cell } from "../interface/ticTacToe.type";
import { SingleCell } from "./Cell";

export interface RowProps {
  idx: number;
  row: [Cell, Cell, Cell];
  handleClick: (row: number, col: number) => void;
}

export function Row(props: RowProps) {
  const { idx, row } = props;
  return (
    <div className="flex gap-2">
      {row.map((cell, index) => {
        return (
          <SingleCell
            key={index}
            cell={cell}
            row={idx}
            col={index}
            handleClick={props.handleClick}
          />
        );
      })}
    </div>
  );
}
