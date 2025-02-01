import { useUsersMembersStore } from '../stores/users-store';

const { setNotifications } = useUsersMembersStore();

export const updateNotifications = (notifications: number) => {
  setNotifications(notifications);
};
