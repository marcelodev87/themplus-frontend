import { useAuthStore } from 'src/stores/auth-store';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function isClientGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const { enterprisePosition, user } = authStore;
  if (
    enterprisePosition === 'client' ||
    (enterprisePosition === 'counter' &&
      user?.view_enterprise_id !== user?.enterprise_id)
  ) {
    next();
  } else {
    next({ name: 'admin-feed' });
  }
}
