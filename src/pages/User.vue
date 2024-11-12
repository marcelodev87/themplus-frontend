<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import FormUser from 'src/components/forms/FormUser.vue';
import { useUsersStore } from 'src/stores/users-store';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({
  name: 'User',
});

const { getUsers, deleteUserMember } = useUsersStore();
const { loadingUsers, listUser } = storeToRefs(useUsersStore());

const showFormUser = ref<boolean>(false);
const filterUser = ref<string>('');
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
    label: 'Deaprtamento',
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

const openFormUser = (): void => {
  showFormUser.value = true;
};
const closeFormUser = (): void => {
  showFormUser.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-6">
        <TitlePage title="Gerenciamento de usuários" />
      </div>
      <div class="col-6 row items-center justify-end q-gutter-x-sm">
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
    <main class="q-pa-sm">
      <q-table
        :rows="loadingUsers ? [] : listUser"
        :columns="columnsUser"
        :filter="filterUser"
        :loading="loadingUsers"
        style="max-height: 400px"
        flat
        bordered
        dense
        row-key="name"
        no-data-label="Nenhuma conta para mostrar"
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
          <q-tr
            :props="props"
            style="height: 28px"
            :class="props.row.type === 'entrada' ? 'text-green' : 'text-red'"
          >
            <q-td key="name" :props="props" class="text-left">
              {{ props.row.account.name }}
            </q-td>
            <q-td key="account_number" :props="props" class="text-left">
              {{ props.row.account.account_number }}
            </q-td>
            <q-td key="agency_number" :props="props" class="text-left">
              {{ props.row.account.agency_number }}
            </q-td>
            <q-td key="category" :props="props" class="text-left">
              {{ props.row.category.name }}
            </q-td>
            <q-td key="value" :props="props" class="text-left">
              {{ `R$ ${props.row.value}` }}
            </q-td>
            <q-td key="date_movement" :props="props" class="text-left">
              {{ formatDate(props.row.date_movement) }}
            </q-td>
            <q-td key="description" :props="props" class="text-left">
              {{ props.row.description }}
            </q-td>
            <q-td key="receipt" :props="props" class="text-left">
              {{ props.row.receipt }}
            </q-td>
            <q-td key="action" :props="props">
              <q-btn
                @click="handleEdit(props.row)"
                size="sm"
                flat
                round
                color="black"
                icon="edit"
                :disabled="false"
              />
              <q-btn
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
      <FormUser :open="showFormUser" @update:open="closeFormUser" />
    </main>
  </section>
</template>
