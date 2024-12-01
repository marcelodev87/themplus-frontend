<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { useUsersMembersStore } from 'src/stores/users-store';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { reactive, ref, onMounted, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { User } from 'src/ts/interfaces/data/User';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';

defineOptions({
  name: 'User',
});

const { getUsersMembers, deleteUserMember, exportUser } =
  useUsersMembersStore();
const { loadingUsersMembers, listUserMember, filledData } = storeToRefs(
  useUsersMembersStore()
);
const { user } = storeToRefs(useAuthStore());

const showFormUser = ref<boolean>(false);
const loadingExport = ref<boolean>(false);
const showAlertDataEnterprise = ref<boolean>(false);
const filterUser = ref<string>('');
const selectedDataEdit = ref<User | null>(null);
const columnsUser = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
    sortable: true,
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
    sortable: true,
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'departments.name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  selectedDataEdit.value = null;
  filterUser.value = '';
};
const openFormUser = (): void => {
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  showFormUser.value = false;
  clear();
};
const handleEdit = (data: User) => {
  selectedDataEdit.value = data;
  openFormUser();
};
const exclude = async (id: string): Promise<void> => {
  await deleteUserMember(id);
};
const exportData = async (): Promise<void> => {
  loadingExport.value = true;
  await exportUser();
  loadingExport.value = false;
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
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
  await getUsersMembers();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div class="col-6 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="exportData"
          :loading="loadingExport"
          flat
          color="black"
          icon-right="download"
          label="Exportar"
          unelevated
          no-caps
        />
        <q-btn
          @click="openFormUser"
          color="blue-8"
          icon-right="group_add"
          label="Usuários"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main class="q-pa-sm q-mb-md">
        <q-table
          :rows="loadingUsersMembers ? [] : listUserMember"
          :columns="columnsUser"
          :filter="filterUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de usuários</span>
            <q-space />
            <q-input filled v-model="filterUser" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.email }}
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                {{ props.row.phone ?? 'Não definido' }}
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                {{
                  props.row.position === 'admin'
                    ? 'Administrador'
                    : 'Usuário comum'
                }}
              </q-td>
              <q-td key="department" :props="props" class="text-left">
                {{
                  props.row.department_id
                    ? props.row.department.name
                    : `Não definido`
                }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="user && user.id !== props.row.id"
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                  :disabled="false"
                />
                <q-btn
                  v-show="user && user.id !== props.row.id"
                  @click="exclude(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <FormUser
          :open="showFormUser"
          :data-edit="selectedDataEdit"
          @update:open="closeFormUser"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
