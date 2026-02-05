<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { onMounted, reactive, ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useFeedStore } from 'src/stores/feed-store';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { subscriptions } from 'src/utils/subscriptions';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import ManageSubscription from 'src/components/general/ManageSubscription.vue';
import SubscriptionStepper from 'src/components/stepper/SubscriptionStepper.vue';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { useAuthStore } from 'src/stores/auth-store';

defineOptions({ name: 'Subscriptions' });

const { filledData } = storeToRefs(useFeedStore());
const { getFeed } = useFeedStore();

const { listSubscription, loadingTableSubscription, freeSubscriptionLoading } =
  storeToRefs(useSubscriptionStore());

const { user } = storeToRefs(useAuthStore());

const planLabels: Record<string, string> = {
  free: 'Grátis',
  basic: 'Básico',
  advanced: 'Avançado',
  etika: 'Cliente Etika Contabilidade',
};

const getPlanLabel = (name?: string) =>
  name ? (planLabels[name] ?? name) : '';

const currentPlanLabel = computed(() => {
  const name = user.value?.enterprise?.subscription.name;
  return getPlanLabel(name);
});

const subscriptionInfo = computed(() => {
  const expired = user.value?.enterprise?.expired_date;
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

const columnsSubscriptions = reactive<QuasarTable[]>([
  { name: 'name', label: 'Assinatura', field: 'name', align: 'center' },
  {
    name: 'movement',
    label: 'Movimentações e Agendamentos',
    field: 'movement',
    align: 'center',
  },
  {
    name: 'members',
    label: 'Gestão de membros',
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
  { name: 'price', label: 'Valor', field: 'price', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]);

const subscriptionsTable = computed(() => {
  if (!listSubscription.value?.length) return [];

  return listSubscription.value
    .filter((item) => item.name !== 'etika')
    .map((sub) => {
      const mock = subscriptions.find((s) => s.name === sub.name);

      return {
        id: sub.id,
        name: sub.name,
        movement: mock?.movement ?? '-',
        members: mock?.members ?? false,
        financial: mock?.financial ?? false,
        assistent: mock?.assistent ?? false,
        price: sub.price ?? '0.00',
      };
    })
    .sort((a, b) => Number(a.price) - Number(b.price));
});

const subscriptionID = ref<string | null>(null);
const showSubscriptionStepper = ref(false);
const showManageSubscription = ref(false);
const showAlertDataEnterprise = ref(false);
const showConfirmAction = ref(false);

const fetchFeed = async () => {
  await getFeed();
};
const fetchSubscriptions = async () => {
  await useSubscriptionStore().getSubscriptions();
};

const openManageSubscription = () => {
  showManageSubscription.value = true;
};
const closeManageSubscription = () => {
  showManageSubscription.value = false;
};

const openConfirmAction = () => {
  showConfirmAction.value = true;
};

const openSubscriptionStepper = (open: boolean, id: string) => {
  const freeSubscription = listSubscription.value.find(
    (subs) => subs.id === id && subs.name === 'free'
  );

  if (freeSubscription) {
    subscriptionID.value = id;
    openConfirmAction();
  } else {
    subscriptionID.value = id;
    showSubscriptionStepper.value = open;
  }
};

const closeSubscriptionStepper = () => {
  showSubscriptionStepper.value = false;
};

const closeAlertDataEnterprise = async () => {
  showAlertDataEnterprise.value = false;
  await fetchFeed();
};

watch(
  filledData,
  () => {
    if (!filledData.value) showAlertDataEnterprise.value = true;
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchFeed();
  await fetchSubscriptions();
});
</script>

<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div>
        <TitlePage title="Painel de assinaturas" />

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

      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openManageSubscription"
          icon-right="payments"
          label="Painel de Assinatura"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>

    <main>
      <q-scroll-area class="main-scroll q-pa-sm">
        <section class="q-mt-md">
          <q-table
            :rows="subscriptionsTable"
            :columns="columnsSubscriptions"
            :loading="loadingTableSubscription"
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
                  <span style="font-size: 13px">{{ col.label }}</span>
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
                  {{ getPlanLabel(props.row.name) }}
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
                <q-td
                  key="price"
                  :props="props"
                  class="text-center"
                  style="font-size: 14px"
                >
                  <span v-if="props.row.name === 'free'">-</span>
                  <span v-if="props.row.name === 'advanced'">Em breve</span>
                  <span
                    v-if="
                      props.row.name !== 'advanced' && props.row.name !== 'free'
                    "
                    >{{ formatCurrencyBRL(props.row.price) }}</span
                  >
                </q-td>
                <q-td key="actions" :props="props" class="text-center">
                  <q-btn
                    v-if="props.row.name === 'basic'"
                    rounded
                    flat
                    icon="attach_money"
                    color="green"
                    @click="openSubscriptionStepper(true, props.row.id)"
                    :loading="
                      props.row.name === 'free'
                        ? freeSubscriptionLoading
                        : false
                    "
                  >
                    <q-tooltip> Realizar pagamento </q-tooltip>
                  </q-btn>
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
      <ManageSubscription
        :open="showManageSubscription"
        @update:open="closeManageSubscription"
      />
      <SubscriptionStepper
        :open="showSubscriptionStepper"
        :subscriptionId="subscriptionID"
        @update:open="closeSubscriptionStepper"
      />
      <!-- <ConfirmAction
        :open="showConfirmAction"
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
        label-action="Atualizar"
        title="Confirmação de atualização de assinatura"
        message="Deseja realmente atualizar sua assinatura para a assinatura gratuita? Caso atualize e queira mudar de assinatura, terá que pagar as outras demais"
      /> -->
    </main>
  </section>
</template>
