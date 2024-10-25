<script setup lang="ts">
import {
  computed, reactive, watch,
} from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'FormAlert',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataAlert = reactive({
  description: '' as string,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): {status: boolean, message?: string} => {
  if (dataAlert.description.trim() === '') {
    return { status: false, message: 'A descrição da alerta deve ser informada' };
  }
  return { status: true };
};
const save = () => {
  const check = checkData();
  if (check.status) {
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  dataAlert.description = '';
};

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cadastro de categorias de movimentações"/>
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form>
          <q-input
                v-model="dataAlert.description"
                style="height: 150px; max-height: 130px;"
                bg-color="white"
                label-color="black"
                filled
                label="Digite uma descrição para alerta"
                dense
                input-class="text-black no-resize"
                type="textarea"
                class="no-resize"
            >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
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
            :disable="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
