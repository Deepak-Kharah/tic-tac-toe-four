import { SingleCell } from "./Cell";

export interface RowProps {
  row: number;
}

export function Row(props: RowProps) {
  const { row } = props;
  return (
    <div className="flex gap-2">
      {Array.from({ length: 3 }).map((_, col) => {
        return <SingleCell key={col} row={row} col={col} />;
      })}
    </div>
  );
}
