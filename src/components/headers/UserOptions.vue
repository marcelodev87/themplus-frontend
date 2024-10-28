<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'UserOptions',
});

const { setToken, setUser } = useAuthStore();

const emit = defineEmits<{
  'update:openFormPerfil': [void];
}>();

const router = useRouter();
const dropdown = ref(null);

const openPerfil = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dropdown.value as any).hide();
  emit('update:openFormPerfil');
};
const logout = (): void => {
  setToken(null);
  setUser(null);
  router.push({ name: 'auth' });
};
</script>

<template>
  <q-btn-dropdown
  rounded
  flat
  class="q-pa-none q-px-md q-mr-sm text-black"
  label="Carlos Davi"
  ref="dropdown"
>
  <template v-slot:label>
    <div class="row items-center no-wrap q-pa-none">
      <q-avatar class="q-ml-sm">
        <q-img size="sm" src="/images/user.png" />
      </q-avatar>
    </div>
  </template>
  <q-list>
    <q-item clickable v-ripple @click="openPerfil">
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="account_circle" />
        </q-avatar>
      </q-item-section>
      <q-item-section>Perfil</q-item-section>
    </q-item>
    <q-item clickable v-ripple @click="logout">
      <q-item-section avatar>
        <q-avatar>
          <q-icon name="logout" />
        </q-avatar>
      </q-item-section>
      <q-item-section>Sair</q-item-section>
    </q-item>
  </q-list>
</q-btn-dropdown>
</template>
