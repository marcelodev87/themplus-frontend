<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { PreRegistration } from 'src/ts/interfaces/data/Member';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'RelationshipDetails',
});

const props = defineProps<{
  open: boolean;
  data: PreRegistration | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const columnsRelationshipDetails = reactive<QuasarTable[]>([
  {
    name: 'member',
    label: 'Membro',
    field: 'member',
    align: 'left',
    sortable: true,
  },
  {
    name: 'kinship',
    label: 'Parentesco',
    field: 'kinship',
    align: 'left',
    sortable: true,
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-sm">
        <TitlePage
          :title="`Parentescos do membro (${props.data?.name ?? ''})`"
        />
        <q-table
          :rows="props.data?.relationships ?? []"
          :columns="columnsRelationshipDetails"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma relação para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="member" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.member }}</span>
              </q-td>
              <q-td key="kinship" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.kinship }}</span>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-card-actions align="right" class="q-py-sm q-px-none">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
