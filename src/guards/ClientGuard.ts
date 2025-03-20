import { useAuthStore } from 'src/stores/auth-store';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export function isClientGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  const { enterprisePosition } = authStore;
  if (enterprisePosition === 'client') {
    next();
  } else {
    next({ name: 'admin-feed' });
  }
}
