<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormDepartment from 'src/components/forms/FormDepartment.vue';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'src/stores/department_store';
import { Department } from 'src/ts/interfaces/data/Department';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
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
const showAlertDataEnterprise = ref<boolean>(true);

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
  clear();
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
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
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
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <div class="row q-col-gutter-sm">
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
                    name="groups"
                    color="black"
                    size="22px"
                    class="q-mr-sm"
                  />
                  <q-btn
                    size="sm"
                    flat
                    rounded
                    color="black"
                    :disable="loadingDepartment"
                    @click="handleEdit(prop.node)"
                  >
                    {{ prop.node.label }}
                  </q-btn>
                </div>
                <q-separator />
                <div class="row items-center justify-center">
                  <q-btn
                    @click="openFormDepartment(prop.key)"
                    label="Adicionar um sub-departamento"
                    :disable="loadingDepartment"
                    size="sm"
                    rounded
                    flat
                    color="primary"
                    icon="add"
                    unelevated
                  />
                  <q-btn
                    @click="exclude(prop.node.id)"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    rounded
                    color="negative"
                    icon="delete"
                  />
                </div>
              </div>
            </template>
          </q-tree>
          <div
            v-show="treeDepartment.length == 0 && !loadingDepartment"
            class="q-pa-md"
          >
            <q-banner dense inline-actions class="text-white bg-red" rounded>
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
        </div>
        <FormDepartment
          :open="showFormDepartment"
          :key-root="clickRootCreate"
          :department-edit="departmentEdit"
          @update:open="closeFormDepartment"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style>
.teste {
  border: 1px solid black;
}
</style>
