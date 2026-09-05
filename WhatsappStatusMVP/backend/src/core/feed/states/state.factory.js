// core/feed/states/state.factory.js — createState() [State + Factory]
// Given a group's unseen count, returns the State object that encapsulates its
// ordering priority. Ordering logic asks the state, never an if/else chain.
import { UnseenState } from './unseen.state.js';
import { SeenState } from './seen.state.js';

const unseen = new UnseenState();
const seen = new SeenState();

export function createState(unseenCount) {
  return unseenCount > 0 ? unseen : seen;
}
