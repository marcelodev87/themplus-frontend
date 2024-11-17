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
      <div>
        <img src="/images/logo.png" width="120px" />
      </div>
      <div>
        <q-btn
          :loading="false"
          flat
          color="black"
          icon-right="fa-regular fa-comment-dots"
          unelevated
          no-caps
          rounded
        >
          <q-tooltip> Enviar sugestão ou feedback </q-tooltip>
        </q-btn>
        <UserOptions
          @update:open-form-perfil="emit('update:openFormPerfil')"
          @update:open-form-enterprise="emit('update:openFormEnterprise')"
        />
      </div>
    </q-toolbar>
  </nav>
</template>
