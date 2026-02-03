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
  <section class="department-management">
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
      <main class="q-pa-md">
        <div
          v-if="treeDepartment.length === 0 && !loadingDepartment"
          class="column items-center justify-center q-pa-xl text-grey-6"
        >
          <q-icon name="account_tree" size="64px" color="grey-4" />
          <div class="text-h6 q-mt-md">Nenhum departamento encontrado</div>
          <div class="text-caption">
            Comece criando um departamento principal.
          </div>
        </div>

        <div class="row">
          <q-tree
            v-show="treeDepartment.length > 0"
            v-model:selected="selectedObject"
            :nodes="treeDepartment"
            :filter="searchDepartment"
            node-key="id"
            class="full-width custom-department-tree"
            default-expand-all
          >
            <template v-slot:default-header="prop">
              <div
                class="tree-node-container row items-center full-width q-pa-xs rounded-borders"
              >
                <div class="row items-center col">
                  <q-icon
                    :name="prop.node.children?.length ? 'domain' : 'badge'"
                    :color="prop.node.children?.length ? 'primary' : 'grey-7'"
                    size="20px"
                    class="q-mr-sm"
                  />
                  <div
                    class="text-subtitle2 text-weight-bold cursor-pointer hover-edit"
                    @click="handleEdit(prop.node)"
                  >
                    {{ prop.node.label }}
                    <q-tooltip shadow-2>Clique para editar</q-tooltip>
                  </div>
                </div>

                <div class="row items-center q-gutter-x-xs action-buttons">
                  <q-btn
                    v-if="user?.enterprise_id === user?.view_enterprise_id"
                    @click.stop="openFormDepartment(prop.key)"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    round
                    color="primary"
                    icon="add_circle_outline"
                  >
                    <q-tooltip>Adicionar Sub-departamento</q-tooltip>
                  </q-btn>

                  <q-btn
                    v-if="user?.enterprise_id === user?.view_enterprise_id"
                    @click.stop="openConfirmAction(prop.node.id)"
                    :disable="loadingDepartment"
                    size="sm"
                    flat
                    round
                    color="negative"
                    icon="delete_outline"
                  >
                    <q-tooltip>Excluir Departamento</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>
          </q-tree>
        </div>

        <q-inner-loading
          :showing="loadingDepartment"
          label="Aguarde..."
          label-class="text-black"
          label-style="font-size: 1.1em"
          color="primary"
          size="50px"
        />

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
          title="Excluir Departamento"
          message="Atenção: Subdepartamentos vinculados também serão removidos. Esta ação não pode ser desfeita."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>

<style scoped>
.department-management {
  background-color: #fafafa;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}

.custom-department-tree :deep(.q-tree__node-header) {
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.custom-department-tree :deep(.q-tree__node-header:hover) {
  background-color: #f0f4ff;
}

.tree-node-container {
  border: 1px solid transparent;
}

.hover-edit:hover {
  text-decoration: underline;
  color: var(--q-primary);
}

.action-buttons {
  opacity: 0.7;
  transition: opacity 0.3s;
}

.tree-node-container:hover .action-buttons {
  opacity: 1;
}

.custom-department-tree :deep(.q-tree__node:after) {
  border-left: 1px dashed #bdbdbd;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
