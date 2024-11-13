<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormDepartment from 'src/components/forms/FormDepartment.vue';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'src/stores/department_store';
import { Department } from 'src/ts/interfaces/data/Department';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'Department',
});

const { loadingDepartment, treeDepartment } = storeToRefs(useDepartmentStore());
const { getDepartments, deleteDepartment } = useDepartmentStore();

const $q = useQuasar();
const showFormDepartment = ref<boolean>(false);
const selectedObject = ref<string>('');
const searchDepartment = ref<string>('');
const clickRootCreate = ref<string | null>(null);
const departmentEdit = ref<Department | null>(null);

const scrollHeight = computed(() => {
  return 'height: calc(100vh - 150px )';
});

const clear = () => {
  clickRootCreate.value = '';
  selectedObject.value = '';
  departmentEdit.value = null;
  searchDepartment.value = '';
};
const openFormDepartment = (key = null): void => {
  if (key) {
    clickRootCreate.value = key;
  }
  showFormDepartment.value = true;
};
const closeFormDepartment = (): void => {
  showFormDepartment.value = false;
};
const handleEdit = (department: Department) => {
  departmentEdit.value = department;
  openFormDepartment();
};
const exclude = (id: string) => {
  $q.dialog({
    title: 'Confirmação',
    message:
      'Tem certeza de que deseja excluir o departamento? Caso haja subdepartamentos vinculados, eles também serão excluídos.',
    cancel: { label: 'Não', dense: true, align: 'center' },
    ok: {
      label: 'Sim',
      color: 'negative',
      dense: true,
      align: 'center',
    },
    persistent: true,
  }).onOk(async () => {
    await deleteDepartment(id);
  });
};

onMounted(async () => {
  clear();
  await getDepartments();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de departamentos" />
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openFormDepartment()"
          color="blue-8"
          icon-right="groups"
          label="Departamentos"
          unelevated
          no-caps
          class="q-mr-sm"
        />
      </div>
    </header>
    <main class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <q-scroll-area
          ref="scrollAreaRef"
          class="full-width"
          :style="scrollHeight"
        >
          <q-tree
            v-show="treeDepartment.length > 0"
            v-model:selected="selectedObject"
            :nodes="treeDepartment"
            :filter="searchDepartment"
            node-key="id"
            class="full-width text-subtitle1"
          >
            <template v-slot:default-header="prop">
              <div class="row full-width wrap justify-between content-start">
                <div class="row items-center justify-center">
                  <q-icon
                    :name="prop.node.icon"
                    color="primary"
                    size=" 28px"
                    class="q-mr-sm"
                  />
                  <q-btn
                    size="sm"
                    flat
                    rounded
                    color="primary"
                    :disable="loadingDepartment"
                    @click="handleEdit(prop.node)"
                  >
                    {{ prop.node.label }}
                  </q-btn>
                  <q-btn
                    @click="exclude(prop.node.id)"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    rounded
                    color="primary"
                  >
                    {{ prop.node.label }}
                  </q-btn>
                </div>
                <q-separator />
                <div class="row items-center justify-center">
                  <q-btn
                    v-show="prop.node.icon"
                    @click="openFormDepartment(prop.key)"
                    label="Adicionar um sub-departamento"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    rounded
                    color="primary"
                    icon="add"
                  />
                </div>
              </div>
            </template>
          </q-tree>
          <div
            v-show="treeDepartment.length == 0 && !loadingDepartment"
            class="q-pa-md"
          >
            <q-banner dense inline-actions class="text-white bg-red">
              Não há departamentos registrados. Por favor, adicione um novo
              departamento.
            </q-banner>
          </div>
          <q-inner-loading
            :showing="loadingDepartment"
            label="Aguarde..."
            label-class="text-black"
            label-style="font-size: 1.1em"
            color="primary"
            size="50px"
          />
        </q-scroll-area>
      </div>
      <FormDepartment
        :open="showFormDepartment"
        :key-root="clickRootCreate"
        :department-edit="departmentEdit"
        @update:open="closeFormDepartment"
      />
    </main>
  </section>
</template>
