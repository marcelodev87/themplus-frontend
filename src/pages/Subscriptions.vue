<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFeedStore } from 'src/stores/feed-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { subscriptions } from 'src/utils/subscriptions';

defineOptions({
  name: 'Subscriptions',
});

const { filledData } = storeToRefs(useFeedStore());
const { getFeed } = useFeedStore();

const showAlertDataEnterprise = ref<boolean>(false);
const columnsSubscriptions = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Assinatura',
    field: 'name',
    align: 'center',
  },
  {
    name: 'movement',
    label: 'Movimentações financeiras',
    field: 'movement',
    align: 'center',
  },
  {
    name: 'members',
    label: 'Gerenciamento de membros',
    field: 'members',
    align: 'center',
  },
  {
    name: 'financial',
    label: 'Painel de contabilidade',
    field: 'financial',
    align: 'center',
  },
  {
    name: 'assistent',
    label: 'Assistente de whatsapp',
    field: 'assistent',
    align: 'center',
  },
]);

const fetchFeed = async () => {
  await getFeed();
};
const closeAlertDataEnterprise = async (): Promise<void> => {
  showAlertDataEnterprise.value = false;
  await fetchFeed();
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
  await fetchFeed();
});
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div>
        <TitlePage title="Painel de assinaturas" />
      </div>
    </header>
    <main>
      <q-scroll-area class="main-scroll q-pa-sm">
        <section class="q-mt-md">
          <q-table
            :rows="subscriptions"
            :columns="columnsSubscriptions"
            flat
            bordered
            row-key="index"
            no-data-label="Nenhum assinatura para mostrar"
            virtual-scroll
            hide-pagination
            :rows-per-page-options="[10]"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-2">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  <span style="font-size: 16px">{{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td
                  key="name"
                  :props="props"
                  class="text-center text-bold"
                  style="font-size: 14px"
                >
                  {{ props.row.name }}
                </q-td>
                <q-td
                  key="movement"
                  :props="props"
                  class="text-center"
                  style="font-size: 14px"
                >
                  {{ props.row.movement }}
                </q-td>
                <q-td key="members" :props="props" class="text-center">
                  <q-icon
                    :name="props.row.members ? 'check_circle' : 'close'"
                    size="16px"
                    :color="props.row.members ? 'green' : 'red'"
                  />
                </q-td>
                <q-td key="financial" :props="props" class="text-center">
                  <q-icon
                    :name="props.row.financial ? 'check_circle' : 'close'"
                    size="16px"
                    :color="props.row.financial ? 'green' : 'red'"
                  />
                </q-td>
                <q-td key="assistent" :props="props" class="text-center">
                  <q-icon
                    :name="props.row.assistent ? 'check_circle' : 'close'"
                    size="16px"
                    :color="props.row.assistent ? 'green' : 'red'"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </section>
      </q-scroll-area>
      <AlertDataEnterprise
        :open="showAlertDataEnterprise"
        @update:open="closeAlertDataEnterprise"
      />
    </main>
  </section>
</template>
