<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useAlertStore } from 'src/stores/alert-store';
import { Alert } from 'src/ts/interfaces/data/Alert';

defineOptions({
  name: 'FormAlert',
});

const { loadingAlert } = storeToRefs(useAlertStore());
const { createAlert, updateAlert } = useAlertStore();

const props = defineProps<{
  open: boolean;
  dataEdit: Alert | null;
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

const checkData = (): { status: boolean; message?: string } => {
  if (dataAlert.description.trim() === '') {
    return {
      status: false,
      message: 'A descrição da alerta deve ser informada',
    };
  }
  return { status: true };
};
const clear = (): void => {
  dataAlert.description = '';
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createAlert(dataAlert.description);
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    await updateAlert(props.dataEdit?.id ?? '', dataAlert.description);
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const checkDataEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataAlert, {
      description: props.dataEdit.description,
    });
  }
};

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null
              ? 'Registre uma alerta'
              : 'Atualize uma alerta'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form>
          <q-input
            v-model="dataAlert.description"
            style="height: 150px; max-height: 130px"
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
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            v-if="props.dataEdit === null"
            @click="save"
            :loading="loadingAlert"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            :loading="loadingAlert"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
