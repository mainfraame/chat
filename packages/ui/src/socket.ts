import { connect } from 'socket.io-client';

export const socket = connect({
  autoConnect: false,
  transports: ['websocket'],
  withCredentials: true
});
