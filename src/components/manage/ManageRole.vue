<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useRoleStore } from 'src/stores/role-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import type { Role } from 'src/ts/interfaces/data/Role';
import FormRole from 'src/components/forms/FormRole.vue';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({
  name: 'ManageRole',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getRoles, deleteRole } = useRoleStore();
const { loadingRole, listRole } = storeToRefs(useRoleStore());
const { user } = storeToRefs(useAuthStore());

const showFormRole = ref<boolean>(false);
const filterRole = ref<string>('');
const selectedDataEdit = ref<Role | null>(null);
const columnsRole = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  filterRole.value = '';
  selectedDataEdit.value = null;
};
const fetchRoles = async () => {
  await getRoles();
};
const openFormRole = (): void => {
  showFormRole.value = true;
};
const closeFormRole = (): void => {
  showFormRole.value = false;
  clear();
};
const exclude = async (id: string) => {
  await deleteRole(id);
};
const handleEdit = (role: Role) => {
  selectedDataEdit.value = role;
  openFormRole();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchRoles();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic"
      style="min-width: 900px; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <header
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between no-wrap bg-grey-1'
              : 'column justify-between no-wrap bg-grey-1'
          "
        >
          <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
            <TitlePage title="Gerenciamento de cargos" />
          </div>
        </header>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="loadingRole ? [] : listRole"
          :columns="columnsRole"
          :loading="loadingRole"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum cargo para mostrar"
          virtual-scroll
          :rows-per-page-options="[0]"
          :filter="filterRole"
          >
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <div
              :class="!$q.screen.lt.md ? 'row full-width' : 'column full-width'"
            >
              <span class="text-subtitle2">Lista de cargos</span>
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-input
                  filled
                  v-model="filterRole"
                  dense
                  label="Pesquisar"
                  :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-input
                  filled
                  v-model="filterRole"
                  dense
                  label="Pesquisar"
                  class="full-width q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-expansion-item>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td
                key="name"
                :props="props"
                class="text-left"
                :class="props.row.active === 0 ? 'text-grey-5' : ''"
              >
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="handleEdit(props.row)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="exclude(props.row.id)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="negative"
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
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            @click="openFormRole"
            :loading="loadingRole"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormRole
        :data-edit="selectedDataEdit"
        :open="showFormRole"
        @update:open="closeFormRole"
      />
    </q-card>
  </q-dialog>
</template>
