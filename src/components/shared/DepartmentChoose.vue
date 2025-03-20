<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDepartmentStore } from 'src/stores/department_store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'DepartmentChoose',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:chooseDepartment': [{ id: string; label: string } | null];
}>();

const { treeDepartment, loadingDepartment } = storeToRefs(useDepartmentStore());

const filterDepartment = ref<string>('');

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  filterDepartment.value = '';
};
const closeShowModal = (): void => {
  open.value = false;
};
const choseDepartmentRoot = (): void => {
  emit('update:chooseDepartment', null);
};
const selectTree = (tree: { id: string; label: string }): void => {
  emit('update:chooseDepartment', tree);
};

watch(
  open,
  () => {
    if (open.value) {
      clear();
    }
  },
  { immediate: true }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card style="width: 500px; max-width: 98%">
      <q-card-section class="bg-grey-2">
        <div class="text-h6">Escolha o departamento</div>
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div class="q-pa-md" style="min-height: 385px">
          <q-input
            v-model="filterDepartment"
            outlined
            dense
            label="Pesquisar departamento"
            :disable="loadingDepartment"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-tree
            dense
            :nodes="loadingDepartment ? [] : treeDepartment"
            node-key="id"
            :filter="filterDepartment"
            class="q-py-md"
          >
            <template v-slot:default-header="prop">
              <div class="fit">
                <q-icon name="groups" color="black" size="22px" />
                <q-btn
                  size="sm"
                  color="black"
                  flat
                  rounded
                  :disable="loadingDepartment"
                  @click="selectTree(prop.node)"
                  >{{ prop.node.label }}</q-btn
                >
              </div>
            </template>
          </q-tree>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="text-primary bg-grey-2">
        <q-btn
          @click="closeShowModal"
          color="red"
          label="Fechar"
          size="md"
          flat
          unelevated
          no-caps
        />
        <q-btn
          color="primary"
          label="Departamento raiz"
          size="md"
          unelevated
          no-caps
          @click="choseDepartmentRoot"
          :loading="loadingDepartment"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
