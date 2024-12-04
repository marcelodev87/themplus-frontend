<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed } from 'vue';

defineOptions({
  name: 'ConfirmAction',
});

const props = defineProps<{
  open: boolean;
  title: string;
  message: string;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:ok': [void];
}>();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const confirm = () => {
  emit('update:ok');
};
const close = () => {
  emit('update:open');
};
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage :title="props.title" />
      </q-card-section>
      <q-card-section>
        <div class="text-subtitle2 text-red">
          {{ props.message }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="close"
            color="red"
            label="Voltar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            @click="confirm"
            color="primary"
            label="Confirmar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
