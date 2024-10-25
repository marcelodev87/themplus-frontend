<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'UserOptions',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
}>();

const dropdown = ref(null);

const openPerfil = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dropdown.value as any).hide();
  emit('update:openFormPerfil');
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
    <q-item clickable v-ripple>
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
