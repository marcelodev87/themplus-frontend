<script setup lang="ts">
import UserOptions from './UserOptions.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
  'update:openEmailInfo': [void];
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
          @click="emit('update:openEmailInfo')"
          flat
          color="black"
          icon-right="chat"
          rounded
        >
          <q-tooltip> Entrar em contato </q-tooltip>
        </q-btn>
        <q-btn flat color="black" icon-right="fa-solid fa-headset" rounded>
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
