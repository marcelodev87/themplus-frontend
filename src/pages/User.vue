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

    <q-scroll-area class="main-scroll" style="height: calc(100vh - 110px)">
      <main class="q-pa-md">
        <div class="row items-center q-mb-md">
          <q-space />
          <q-input
            v-model="filterUser"
            dense
            outlined
            placeholder="Pesquisar por nome ou e-mail..."
            class="bg-white rounded-borders"
            style="min-width: 300px"
          >
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div v-if="$q.screen.lt.md" class="row q-col-gutter-md">
          <div
            v-for="member in listUserMemberCurrent"
            :key="member.id"
            class="col-12 col-sm-6"
          >
            <q-card flat bordered class="user-card transition-row">
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-avatar size="50px" color="grey-2" text-color="primary">
                    {{ member.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-subtitle1">{{
                    member.name
                  }}</q-item-label>
                  <q-item-label caption class="row items-center">
                    <q-icon name="mail" size="xs" class="q-mr-xs" />
                    {{ member.email }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-badge
                    :color="member.active ? 'green-1' : 'red-1'"
                    :text-color="member.active ? 'green-9' : 'red-9'"
                    class="text-weight-bold"
                  >
                    {{ member.active ? 'Ativo' : 'Inativo' }}
                  </q-badge>
                </q-item-section>
              </q-item>

              <q-separator inset />

              <q-card-section class="q-py-sm">
                <div class="row justify-between text-caption text-grey-7">
                  <span
                    ><q-icon name="work" class="q-mr-xs" />{{
                      member.position === 'admin' ? 'Administrador' : 'Membro'
                    }}</span
                  >
                  <span
                    ><q-icon name="account_tree" class="q-mr-xs" />{{
                      member.department?.name || 'Geral'
                    }}</span
                  >
                </div>
              </q-card-section>

              <q-card-actions align="right" class="bg-grey-1">
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="edit"
                  @click="handleEdit(member)"
                  color="grey-8"
                />
                <q-btn
                  flat
                  round
                  size="sm"
                  :icon="member.active ? 'block' : 'check_circle'"
                  :color="member.active ? 'negative' : 'positive'"
                  @click="setActive(member.active === 1 ? 0 : 1, member.id)"
                />
                <q-btn
                  flat
                  round
                  size="sm"
                  icon="delete_outline"
                  color="negative"
                  @click="exclude(member.id)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <q-table
          v-else
          :rows="loadingUsersMembers ? [] : listUserMemberCurrent"
          :columns="columnsUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          row-key="index"
          hide-pagination
          :rows-per-page-options="[0]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2 text-grey-8">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bold uppercase"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="!props.row.active ? 'bg-grey-1 opacity-60' : ''"
            >
              <q-td key="name" :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar
                    size="32px"
                    color="blue-1"
                    text-color="blue-8"
                    class="q-mr-sm text-weight-bold"
                  >
                    {{ props.row.name.charAt(0).toUpperCase() }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-6">
                      {{ props.row.email }}
                    </div>
                  </div>
                </div>
              </q-td>

              <q-td key="phone" :props="props">
                <span class="text-grey-8">{{ props.row.phone || '---' }}</span>
              </q-td>

              <q-td key="position" :props="props">
                <q-chip
                  dense
                  :color="
                    props.row.position === 'admin' ? 'purple-1' : 'blue-grey-1'
                  "
                  :text-color="
                    props.row.position === 'admin' ? 'purple-9' : 'blue-grey-9'
                  "
                  class="text-weight-bold"
                >
                  {{
                    props.row.position === 'admin' ? 'Administrador' : 'Comum'
                  }}
                </q-chip>
              </q-td>

              <q-td key="department" :props="props">
                <div class="row items-center">
                  <q-icon
                    name="business"
                    color="grey-5"
                    size="xs"
                    class="q-mr-xs"
                  />
                  {{ props.row.department?.name || 'Não definido' }}
                </div>
              </q-td>

              <q-td key="active" :props="props">
                <q-badge rounded :color="props.row.active ? 'green' : 'red'" />
                <span class="q-ml-xs text-caption">{{
                  props.row.active ? 'Ativo' : 'Inativo'
                }}</span>
              </q-td>

              <q-td
                key="action"
                :props="props"
                class="q-gutter-x-xs text-right"
              >
                <template v-if="user && user.id !== props.row.id">
                  <q-btn
                    flat
                    round
                    size="sm"
                    :icon="props.row.active ? 'block' : 'done'"
                    :color="props.row.active ? 'negative' : 'positive'"
                    @click="
                      setActive(props.row.active === 1 ? 0 : 1, props.row.id)
                    "
                  >
                    <q-tooltip>{{
                      props.row.active ? 'Inativar' : 'Ativar'
                    }}</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="edit"
                    color="grey-9"
                    @click="handleEdit(props.row)"
                  />
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="delete"
                    color="negative"
                    @click="exclude(props.row.id)"
                  />
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row justify-center q-mt-lg">
          <Paginate
            v-model="currentPage"
            :max="maxPages"
            :length="filteredUser.length"
          />
        </div>

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
