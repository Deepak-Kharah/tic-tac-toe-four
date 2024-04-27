import { signal } from "@preact/signals";

export const winnerSignal = signal<"X" | "O" | null>(null);
