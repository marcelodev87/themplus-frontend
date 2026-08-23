<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import TitlePage from 'src/components/shared/TitlePage.vue';
import DashboardCapacity from 'src/components/general/DashboardCapacity.vue';
import SubscriptionStepper from 'src/components/stepper/SubscriptionStepper.vue';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { useCounterLicenseStore } from 'src/stores/counter-license-store';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';

defineOptions({ name: 'SubscriptionCounter' });

const { listSubscription, loadingTableSubscription } = storeToRefs(
  useSubscriptionStore()
);
const { usage, listCounterLicense, loadingCounterLicense } = storeToRefs(
  useCounterLicenseStore()
);

const planLabels: Record<string, string> = {
  C5: 'C5 - 5 licenças',
  C10: 'C10 - 10 licenças',
  CIlimited: 'C20 - 20 licenças',
};
const getPlanLabel = (name?: string) =>
  name ? (planLabels[name] ?? name) : '';

const planOrder: Record<string, number> = {
  C5: 0,
  C10: 1,
  CIlimited: 2,
};
const orderedSubscriptions = computed(() =>
  [...listSubscription.value].sort(
    (a, b) =>
      (planOrder[a.name] ?? Number.MAX_SAFE_INTEGER) -
      (planOrder[b.name] ?? Number.MAX_SAFE_INTEGER)
  )
);

const subscriptionID = ref<string | null>(null);
const showSubscriptionStepper = ref(false);
const revokingId = ref<string | null>(null);

const subscriptionInfo = computed(() => {
  const expired = usage.value?.expired_date;
  if (!expired) return null;

  const expireDate = new Date(expired.replace(' ', 'T'));
  const now = new Date();

  const diffMs = expireDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    expireDate,
    diffDays,
    isExpired: diffDays <= 0,
    isNearExpire: diffDays <= 7 && diffDays > 0,
  };
});

const expireFormatted = computed(() => {
  if (!subscriptionInfo.value) return '';
  return subscriptionInfo.value.expireDate.toLocaleDateString('pt-BR');
});

const statusColor = computed(() => {
  if (!subscriptionInfo.value) return 'grey';
  if (subscriptionInfo.value.isExpired) return 'negative';
  if (subscriptionInfo.value.isNearExpire) return 'orange';
  return 'positive';
});

const currentPlanLabel = computed(() =>
  usage.value?.plan ? getPlanLabel(usage.value.plan.name) : 'Nenhum plano ativo'
);

const columnsSubscriptions = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Plano',
    field: 'name',
    align: 'center',
    sortable: true,
  },
  {
    name: 'client_limit',
    label: 'Licenças',
    field: 'client_limit',
    align: 'center',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Valor mensal',
    field: 'price',
    align: 'center',
    sortable: true,
  },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]);
const columnsLicenses = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Cliente',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'granted_at',
    label: 'Concedido em',
    field: 'granted_at',
    align: 'left',
    sortable: true,
  },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]);

const licensesTable = computed(() =>
  listCounterLicense.value.map((license) => ({
    id: license.id,
    clientId: license.client_enterprise_id,
    name: license.client_enterprise?.name ?? '-',
    granted_at: license.granted_at
      ? new Date(license.granted_at.replace(' ', 'T')).toLocaleDateString(
          'pt-BR'
        )
      : '-',
  }))
);

const fetchSubscriptions = async () => {
  await useSubscriptionStore().getSubscriptions('counter');
};
const fetchUsage = async () => {
  await useCounterLicenseStore().getCounterLicenseUsage();
};

const openSubscriptionStepper = (id: string) => {
  subscriptionID.value = id;
  showSubscriptionStepper.value = true;
};
const closeSubscriptionStepper = async () => {
  showSubscriptionStepper.value = false;
  await fetchUsage();
};

const revokeLicense = async (clientEnterpriseId: string) => {
  revokingId.value = clientEnterpriseId;
  await useCounterLicenseStore().revokeCounterLicense(clientEnterpriseId);
  revokingId.value = null;
};

onMounted(async () => {
  await fetchSubscriptions();
  await fetchUsage();
});
</script>

<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div>
        <TitlePage title="Assinatura do Contador" />

        <div class="row q-gutter-sm q-mt-xs">
          <q-chip color="primary" text-color="white" dense class="q-ml-md">
            Plano atual: {{ currentPlanLabel }}
          </q-chip>
          <q-chip
            v-if="subscriptionInfo"
            :color="statusColor"
            text-color="white"
            dense
          >
            <template v-if="subscriptionInfo.isExpired">
              Vencido em {{ expireFormatted }}
            </template>
            <template v-else>
              Vence em {{ expireFormatted }} — faltam
              {{ subscriptionInfo.diffDays }} dias
            </template>
          </q-chip>
        </div>
      </div>
    </header>

    <main>
      <q-scroll-area class="main-scroll q-pa-sm">
        <section class="q-mt-md">
          <DashboardCapacity :usage="usage" :loading="loadingCounterLicense" />
        </section>

        <section class="q-mt-md">
          <TitlePage title="Planos disponíveis" />
          <q-table
            :rows="orderedSubscriptions"
            :columns="columnsSubscriptions"
            :loading="loadingTableSubscription"
            flat
            bordered
            row-key="id"
            no-data-label="Nenhum plano para mostrar"
            hide-pagination
            :rows-per-page-options="[10]"
          >
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-center text-bold">
                  {{ getPlanLabel(props.row.name) }}
                </q-td>
                <q-td key="client_limit" :props="props" class="text-center">
                  {{
                    props.row.client_limit
                      ? props.row.client_limit
                      : 'Ilimitado'
                  }}
                </q-td>
                <q-td key="price" :props="props" class="text-center">
                  {{ formatCurrencyBRL(props.row.price) }}
                </q-td>
                <q-td key="actions" :props="props" class="text-center">
                  <q-btn
                    rounded
                    icon-right="attach_money"
                    label="Contratar"
                    color="green"
                    size="sm"
                    unelevated
                    @click="openSubscriptionStepper(props.row.id)"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </section>

        <section class="q-mt-md q-mb-md">
          <TitlePage title="Clientes com assinatura Básica concedida" />
          <q-table
            :rows="licensesTable"
            :columns="columnsLicenses"
            :loading="loadingCounterLicense"
            flat
            bordered
            row-key="id"
            no-data-label="Nenhuma licença concedida"
            hide-pagination
            :rows-per-page-options="[10]"
          >
            <template v-slot:body="props">
              <q-tr :props="props" style="height: 28px">
                <q-td key="name" :props="props" class="text-left">
                  {{ props.row.name }}
                </q-td>
                <q-td key="granted_at" :props="props" class="text-left">
                  {{ props.row.granted_at }}
                </q-td>
                <q-td key="actions" :props="props" class="text-center">
                  <q-btn
                    flat
                    round
                    size="sm"
                    icon="link_off"
                    color="negative"
                    :loading="revokingId === props.row.clientId"
                    @click="revokeLicense(props.row.clientId)"
                  >
                    <q-tooltip>Remover assinatura Básica</q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </section>
      </q-scroll-area>

      <SubscriptionStepper
        :open="showSubscriptionStepper"
        :subscriptionId="subscriptionID"
        @update:open="closeSubscriptionStepper"
      />
    </main>
  </section>
</template>
