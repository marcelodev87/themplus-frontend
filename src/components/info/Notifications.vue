<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'Notifications',
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
        <TitlePage title="Notificações" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-scroll-area style="height: 400px">
          <div class="column q-gutter-y-sm">
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
            <q-banner dense inline-actions class="text-black bg-grey-4" rounded>
              No dia 03/12/2024, a partir das 20h (Horário de Brasília), nosso
              sistema entrará em modo de manutenção, o que poderá resultar em
              indisponibilidade até às 23h59. Pedimos que se programem para
              evitar qualquer transtorno durante esse período. Agradecemos pela
              compreensão.
            </q-banner>
          </div>
        </q-scroll-area>
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
