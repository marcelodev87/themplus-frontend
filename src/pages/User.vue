<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { useUsersMembersStore } from 'src/stores/users-store';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { reactive, ref, onMounted, watch, computed } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { User } from 'src/ts/interfaces/data/User';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'User',
});

const { getUsersMembers, deleteUserMember, exportUser, updateActiveUser } =
  useUsersMembersStore();
const { loadingUsersMembers, listUserMember, filledData } = storeToRefs(
  useUsersMembersStore()
);
const { user } = storeToRefs(useAuthStore());

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(10);
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
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
  },
  {
    name: 'department',
    label: 'Departamento',
    field: 'departments.name',
    align: 'left',
  },
  {
    name: 'active',
    label: 'Ativo',
    field: 'active',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const resetPage = (): void => {
  currentPage.value = 1;
};
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
const setActive = async (active: number, userId: string) => {
  await updateActiveUser(active, userId);
};
const filteredUser = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };
  resetPage();
  const searchTerm = normalize(filterUser.value);
  return listUserMember.value.filter((item) => {
    return item.name && normalize(item.name).includes(searchTerm);
  });
});

const listUserMemberCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredUser.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredUser.value.length / rowsPerPage.value);
});

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
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div
        v-if="!$q.screen.lt.sm"
        class="col-6 row items-center justify-end q-gutter-x-sm"
      >
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
          icon-right="add"
          label="Usuários"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
      <div v-else class="row justify-end q-mr-sm q-mb-sm">
        <q-btn-dropdown
          class="text-white"
          color="primary"
          ref="dropdown"
          label="Ações"
          unelevated
          no-caps
        >
          <q-list>
            <q-item @click="openFormUser" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="add" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Usuários</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="exportData">
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="download" />
                </q-avatar>
              </q-item-section>
              <q-item-section>Exportar</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          :rows="loadingUsersMembers ? [] : listUserMemberCurrent"
          :columns="columnsUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
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
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.email }}</span>
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.phone ?? 'Não definido'
                }}</span>
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.position === 'admin'
                    ? 'Administrador'
                    : 'Usuário comum'
                }}</span>
              </q-td>
              <q-td key="department" :props="props" class="text-left">
                <span class="text-subtitle2">
                  {{
                    props.row.department_id
                      ? props.row.department.name
                      : `Não definido`
                  }}
                </span>
              </q-td>
              <q-td key="active" :props="props" class="text-left">
                <q-icon
                  :name="props.row.active ? 'person_check' : 'person_cancel'"
                  :color="props.row.active ? 'green' : 'red'"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  v-show="
                    user &&
                    user.id !== props.row.id &&
                    (user?.enterprise_id === user?.view_enterprise_id
                      ? true
                      : false)
                  "
                  @click="
                    setActive(props.row.active === 1 ? 0 : 1, props.row.id)
                  "
                  size="sm"
                  flat
                  round
                  :color="props.row.active ? 'red' : 'green'"
                  :icon="props.row.active ? 'block' : 'check'"
                >
                  <q-tooltip>
                    {{ props.row.active ? 'Inativar' : 'Ativar' }}
                  </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="user && user.id !== props.row.id"
                  @click="handleEdit(props.row)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  v-show="
                    user &&
                    user.id !== props.row.id &&
                    (user?.enterprise_id === user?.view_enterprise_id
                      ? true
                      : false)
                  "
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
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredUser.length"
            />
          </template>
        </q-table>
        <FormUser
          :open="showFormUser"
          :data-edit="selectedDataEdit"
          mode="actual"
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
