<script setup lang="ts">
import UserOptions from './UserOptions.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
}>();
</script>
<template>
  <nav>
    <q-toolbar class="row items-center justify-between">
      <img src="/images/logo.png" width="120px" />
      <UserOptions
        @update:open-form-perfil="emit('update:openFormPerfil')"
        @update:open-form-enterprise="emit('update:openFormEnterprise')"
      />
    </q-toolbar>
  </nav>
</template>
