import { useSocketEvent } from '../../hooks/useSocket.js';

export default function SocketListener({ event, onEvent }) {
  useSocketEvent(event, onEvent);
  return null;
}
