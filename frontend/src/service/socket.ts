import { SOCKET_URL } from '@/config/config';
import { Cookies } from 'react-cookie';
import { io } from 'socket.io-client';

export const socket = io(SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${new Cookies().get('token')}`,
  },
});

