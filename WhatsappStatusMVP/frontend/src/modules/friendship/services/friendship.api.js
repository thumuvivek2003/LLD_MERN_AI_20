// modules/friendship/services/friendship.api.js
import { http } from '../../../core/api/axios.js';

export const friendshipApi = {
  getFriends: () => http.get('/friends'),
};
