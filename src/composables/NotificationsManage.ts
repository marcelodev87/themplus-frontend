import { useUsersMembersStore } from '../stores/users-store';

export const updateNotifications = (notifications: number) => {
  const { setNotifications } = useUsersMembersStore();
  setNotifications(notifications);
};
