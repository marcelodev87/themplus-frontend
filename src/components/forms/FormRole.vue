<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { Role } from 'src/ts/interfaces/data/Role';
import { useRoleStore } from 'src/stores/role-store';

defineOptions({
  name: 'FormRole',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Role | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createRole, updateRole } = useRoleStore();
const { loadingRole } = storeToRefs(useRoleStore());

const dataRole = reactive({
  name: '',
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataRole.name.trim() === '') {
    return {
      status: false,
      message: 'O campo de cargo não pode ser vazio',
    };
  }
  return { status: true };
};
const clear = (): void => {
  dataRole.name = '';
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createRole({
      name: dataRole.name,
    });
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
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
    const response = await updateRole({
      id: props.dataEdit?.id,
      name: dataRole.name,
    });
    if (response?.status === 200) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const submit = async () => {
  if (props.dataEdit === null) {
    await save();
  } else {
    await update();
  }
};
const checkEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataRole, {
      name: props.dataEdit.name,
    });
  }
};

watch(open, () => {
  if (open.value) {
    clear();
    checkEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null ? 'Registre um cargo' : 'Atualize um cargo'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataRole.name"
            bg-color="white"
            label-color="black"
            filled
            label="Crie um cargo"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
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
            unelevated
            no-caps
          />
          <q-btn
            @click="submit"
            :loading="loadingRole"
            color="primary"
            :label="props.dataEdit !== null ? 'Atualizar' : 'Salvar'"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingRole"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
