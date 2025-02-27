<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormDepartment from 'src/components/forms/FormDepartment.vue';
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'src/stores/department_store';
import { Department } from 'src/ts/interfaces/data/Department';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth-store';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';

defineOptions({
  name: 'Department',
});

const { loadingDepartment, treeDepartment, filledData } =
  storeToRefs(useDepartmentStore());
const { getDepartments, deleteDepartment } = useDepartmentStore();
const { user } = storeToRefs(useAuthStore());

const $q = useQuasar();
const showFormDepartment = ref<boolean>(false);
const selectedObject = ref<string>('');
const searchDepartment = ref<string>('');
const clickRootCreate = ref<string | null>(null);
const departmentEdit = ref<Department | null>(null);
const showAlertDataEnterprise = ref<boolean>(false);
const showConfirmAction = ref<boolean>(false);
const dataExcludeId = ref<string | null>(null);

const clear = () => {
  clickRootCreate.value = '';
  selectedObject.value = '';
  departmentEdit.value = null;
  searchDepartment.value = '';
  dataExcludeId.value = null;
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
  if (user.value?.enterprise_id === user.value?.view_enterprise_id) {
    departmentEdit.value = department;
    openFormDepartment();
  }
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async () => {
  showConfirmAction.value = false;
  await deleteDepartment(dataExcludeId.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (id: string): void => {
  dataExcludeId.value = id;
  showConfirmAction.value = true;
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  clear();
  await getDepartments();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de departamentos" />
      </div>
      <div
        class="col-7 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          v-show="user?.enterprise_id === user?.view_enterprise_id"
          @click="openFormDepartment()"
          icon-right="add"
          label="Departamentos"
          unelevated
          no-caps
          class="q-mr-sm bg-contabilidade"
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
                    v-show="user?.enterprise_id === user?.view_enterprise_id"
                    @click="openFormDepartment(prop.key)"
                    :label="
                      !$q.screen.lt.sm ? 'Adicionar um sub-departamento' : ''
                    "
                    :disable="loadingDepartment"
                    size="sm"
                    rounded
                    flat
                    icon="add"
                    unelevated
                  />
                  <q-btn
                    v-show="user?.enterprise_id === user?.view_enterprise_id"
                    @click="openConfirmAction(prop.node.id)"
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
            class="q-pa-md full-width"
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
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de exclusão de departamento"
          message="Caso haja subdepartamentos vinculados, eles também serão excluídos. Caso tenha certeza de que deseja excluir o departamento, clique em 'Continuar'."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
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
