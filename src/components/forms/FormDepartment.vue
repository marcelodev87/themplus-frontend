<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataDepartment } from 'src/ts/interfaces/data/Department';

defineOptions({
  name: 'FormDepartment',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selectedBank = ref<string | null>(null);
const dataDepartment = reactive<DataDepartment>({
  name: '',
  parent: '',
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataDepartment.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome do departamento',
    };
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
  Object.assign(dataDepartment, {
    name: '',
    parent: '',
  });
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
        <TitlePage title="Cadastre um departamento" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataDepartment.name"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o nome do departamento"
            dense
            input-class="text-black"
            :readonly="selectedBank !== null"
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="black" size="20px" />
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
