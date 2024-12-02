<script setup lang="ts">
import { ref } from 'vue';
import UserOptions from './UserOptions.vue';
import FormFeedback from '../forms/FormFeedback.vue';

defineOptions({
  name: 'Navbar',
});

const emit = defineEmits<{
  'update:openFormPerfil': [void];
  'update:openFormEnterprise': [void];
  'update:openEmailInfo': [void];
}>();

const showFormFedback = ref<boolean>(false);

const openFormFeedback = (): void => {
  showFormFedback.value = true;
};
const closeFormFeedback = (): void => {
  showFormFedback.value = false;
};
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
        <q-btn
          @click="openFormFeedback"
          flat
          color="black"
          icon-right="fa-solid fa-headset"
          rounded
        >
          <q-tooltip> Enviar sugestão ou dúvida </q-tooltip>
        </q-btn>
        <UserOptions
          @update:open-form-perfil="emit('update:openFormPerfil')"
          @update:open-form-enterprise="emit('update:openFormEnterprise')"
        />
      </div>
    </q-toolbar>
    <FormFeedback :open="showFormFedback" @update:open="closeFormFeedback" />
  </nav>
</template>
