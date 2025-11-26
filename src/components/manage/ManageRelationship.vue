<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useRelationshipStore } from 'src/stores/relationship-store';
import { Relationship } from 'src/ts/interfaces/data/Relationship';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import FormRelationship from '../forms/FormRelationship.vue';

defineOptions({
  name: 'ManageRole',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { getRelationships, deleteRelationship } = useRelationshipStore();
const { loadingRelationship, listRelationship } = storeToRefs(
  useRelationshipStore()
);
const { user } = storeToRefs(useAuthStore());

const showConfirmAction = ref<boolean>(false);
const showFormRelationship = ref<boolean>(false);
const selectedData = ref<string | null>(null);
const filterRelationship = ref<string>('');
const selectedDataEdit = ref<Relationship | null>(null);
const columnsRelationship = reactive<QuasarTable[]>([
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
  filterRelationship.value = '';
  selectedDataEdit.value = null;
  selectedData.value = '';
};
const fetchRelationships = async () => {
  await getRelationships();
};
const openFormRelationship = (): void => {
  showFormRelationship.value = true;
};
const closeFormRelationship = (): void => {
  showFormRelationship.value = false;
  clear();
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await exclude(selectedData.value ?? '');
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  selectedData.value = null;
};
const openConfirmAction = async (id: string): Promise<void> => {
  selectedData.value = id;
  showConfirmAction.value = true;
};
const exclude = async (id: string) => {
  await deleteRelationship(id);
};
const handleEdit = (relationship: Relationship) => {
  selectedDataEdit.value = relationship;
  openFormRelationship();
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchRelationships();
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
            <TitlePage title="Gerenciamento de relações" />
          </div>
        </header>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="loadingRelationship ? [] : listRelationship"
          :columns="columnsRelationship"
          :loading="loadingRelationship"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma relação para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
          :filter="filterRelationship"
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
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-input
                  filled
                  v-model="filterRelationship"
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
                  v-model="filterRelationship"
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
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    props.row.default === 0
                  "
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row.id)"
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    props.row.default === 0
                  "
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
            @click="openFormRelationship"
            :loading="loadingRelationship"
            color="primary"
            label="Adicionar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <FormRelationship
        :data-edit="selectedDataEdit"
        :open="showFormRelationship"
        @update:open="closeFormRelationship"
      />
      <ConfirmAction
        :open="showConfirmAction"
        label-action="Continuar"
        title="Confirmação de exclusão"
        message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
      />
    </q-card>
  </q-dialog>
</template>
