import clsx from 'clsx';
import { ELEVATOR_STATE, ELEVATOR_STATE_LABEL } from '../../constants/elevatorState.js';

const TONES = {
  IDLE: 'bg-slate-700/60 text-slate-300',
  MOVING_UP: 'bg-emerald-500/20 text-emerald-300',
  MOVING_DOWN: 'bg-rose-500/20 text-rose-300',
  OPENING: 'bg-amber-500/20 text-amber-300',
  CLOSING: 'bg-indigo-500/20 text-indigo-300',
};

export default function ElevatorStateBadge({ state = ELEVATOR_STATE.IDLE }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide', TONES[state] || TONES.IDLE)}>
      {ELEVATOR_STATE_LABEL[state] || state}
    </span>
  );
}
