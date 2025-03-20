<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-restricted-syntax -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataDepartment, Department } from 'src/ts/interfaces/data/Department';
import { useDepartmentStore } from 'src/stores/department_store';
import { storeToRefs } from 'pinia';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

defineOptions({
  name: 'FormDepartment',
});

const props = defineProps<{
  open: boolean;
  keyRoot: string | null;
  departmentEdit: Department | { id: string; label: string } | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createDepartment, updateDepartment } = useDepartmentStore();
const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore());

const selectedBank = ref<string | null>(null);
const showDepartmentChoose = ref<boolean>(false);
const dataDepartment = reactive<DataDepartment>({
  name: '',
  parent: null,
  parentName: null,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataDepartment.name.trim() === '' || dataDepartment.name === undefined) {
    return {
      status: false,
      message: 'Deve ser informado o nome do departamento',
    };
  }
  return { status: true };
};
const clear = (): void => {
  Object.assign(dataDepartment, {
    name: '',
    parent: null,
    parentName: null,
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createDepartment(
      dataDepartment.name,
      dataDepartment.parent ?? null
    );

    if (response?.status === 201) {
      emit('update:open');
      clear();
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const update = async (): Promise<void> => {
  const response = await updateDepartment(
    props.departmentEdit?.id ?? '',
    dataDepartment.name,
    dataDepartment.parent ?? null
  );

  if (response?.status === 200) {
    emit('update:open');
    clear();
  }
};
const findItemById = (
  array: any[],
  id: string,
  parent: any = null
): { item: any | null; parent: any | null } => {
  for (const item of array) {
    if (item.id === id) {
      return { item, parent };
    }
    if (item.children) {
      const found = findItemById(item.children, id, item);
      if (found.item) {
        return found;
      }
    }
  }
  return { item: null, parent: null };
};
const checkEditDepartment = () => {
  if (props.departmentEdit != null) {
    const { item, parent } = findItemById(
      treeDepartment.value,
      props.departmentEdit.id ?? ''
    );

    Object.assign(dataDepartment, {
      name: item.label,
      parent: parent ? parent.id : null,
      parentName: parent ? parent.label : null,
    });
  }
};
const checkCreateWithDepartment = () => {
  if (props.keyRoot != null) {
    const item = findItemById(treeDepartment.value, props.keyRoot);
    if (item && item.item) {
      dataDepartment.parent = item.item.id;
      dataDepartment.parentName = item.item.label;
    }
  }
};
const openDepartmentChoose = (): void => {
  showDepartmentChoose.value = true;
};
const closeDepartmentChoose = (): void => {
  showDepartmentChoose.value = false;
};
const handleChooseDepartment = (
  tree: { id: string; label: string } | null
): void => {
  dataDepartment.parent = tree === null ? null : tree.id;
  dataDepartment.parentName = tree === null ? null : tree.label;
  closeDepartmentChoose();
};

watch(
  open,
  () => {
    if (open.value) {
      clear();
      checkCreateWithDepartment();
      checkEditDepartment();
    }
  },
  { immediate: true, deep: true }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.departmentEdit === null
              ? 'Cadastre um departamento'
              : 'Atualize um departamento'
          "
        />
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
          <q-input
            v-model="dataDepartment.parentName"
            bg-color="white"
            label-color="black"
            filled
            type="text"
            label="Escolher hierarquia"
            readonly
            disable
            clearable
          >
            <template v-slot:append>
              <q-icon
                name="search"
                class="cursor-pointer"
                @click="openDepartmentChoose"
              />
            </template>
          </q-input>
          <DepartmentChoose
            :open="showDepartmentChoose"
            @update:open="closeDepartmentChoose"
            @update:choose-department="handleChooseDepartment"
          />
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
            v-if="props.departmentEdit === null"
            @click="save"
            :loading="loadingDepartment"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            :loading="loadingDepartment"
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
