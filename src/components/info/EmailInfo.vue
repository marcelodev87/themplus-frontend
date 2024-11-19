<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'EmailInfo',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Entre em contato" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
          Por favor, entre em contato conosco através do
          <span class="text-bold">email@teste.com</span> ou nos mande mensagem
          através do whatsapp de número
          <span class="text-bold">(85)98175-9726</span>. Envie suas dúvidas,
          capturas de tela e qualquer outra informação que possa nos ajudar a
          fornecer a melhor resposta possível. Estamos aqui para ajudar e
          garantimos um retorno rápido e eficiente.
        </q-banner>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            :disable="false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
