<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useUsersMembersStore } from 'src/stores/users-store';

defineOptions({
  name: 'FormManageUsers',
});

const props = defineProps<{
  open: boolean;
  id: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getUsersMembersByEnterprise } = useUsersMembersStore();
const { loadingUsersMembers, listUserMemberByEnterprise, settingsCounter } =
  storeToRefs(useUsersMembersStore());

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

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const fetchUsers = async () => {
  await getUsersMembersByEnterprise(props.id ?? '');
};

watch(open, async () => {
  if (open.value) {
    await fetchUsers();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de usuários" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="loadingUsersMembers ? [] : listUserMemberByEnterprise"
          :columns="columnsUser"
          :filter="filterUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          dense
          row-key="name"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de usuários</span>
            <q-space />
            <q-btn
              v-show="settingsCounter?.allow_add_user"
              label="Adicionar usuário"
              icon-right="group_add"
              unelevated
              flat
              no-caps
              class="q-mr-md"
            />
            <q-input
              v-show="listUserMemberByEnterprise.length > 0"
              v-model="filterUser"
              filled
              dense
              label="Pesquisar"
            >
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
                  v-show="settingsCounter?.allow_edit_user"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  v-show="settingsCounter?.allow_delete_user"
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
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingUsersMembers"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
