import { useAuthStore } from 'src/stores/auth-store';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function isAdminGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const { user } = authStore;
  if (user?.position === 'admin') {
    next();
  } else {
    next({ name: 'admin-feed' });
  }
}
