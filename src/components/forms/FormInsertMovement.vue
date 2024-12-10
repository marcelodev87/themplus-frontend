<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'FormInsertMovement',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { exportMovementInsertExample } = useMovementStore();
const { loadingMovement } = storeToRefs(useMovementStore());

const dataInsert = reactive({
  file: null as File | null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataInsert.file === null) {
    return {
      status: false,
      message: 'Selecione uma planilha',
    };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataInsert, {
    file: null,
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    // Criar função para criar
    clear();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const exportInsert = async () => {
  await exportMovementInsertExample();
};

watch(open, async () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Inserção de movimentações em lote" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-file
            v-model="dataInsert.file"
            filled
            bg-color="white"
            label-color="black"
            label="Adicione um documento"
            dense
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="black" size="20px" />
            </template>
          </q-file>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="exportInsert"
            color="black"
            icon-right="download"
            label="Exemplo"
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            icon-right="save"
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
