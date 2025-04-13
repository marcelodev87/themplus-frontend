<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TableCouponEnterprise from '../tables/TableCouponEnterprise.vue';
import TableHistorySubscription from '../tables/TableHistorySubscription.vue';
import DashboardCapacity from './DashboardCapacity.vue';
import SubscriptionInfo from './SubscriptionInfo.vue';

defineOptions({
  name: 'ManageSubscription',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const tab = ref<'subscription' | 'coupon' | 'history' | 'capacity'>(
  'subscription'
);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const requestInformations = async () => {
  if (tab.value === 'subscription') {
    console.log('subscription');
  } else if (tab.value === 'coupon') {
    console.log('coupon');
  } else if (tab.value === 'history') {
    console.log('history');
  } else {
    console.log('capacity');
  }
};
const clear = (): void => {
  tab.value = 'subscription';
};

watch(
  open,
  async () => {
    if (open.value) {
      clear();
      await requestInformations();
    }
  },
  { immediate: true }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de assinatura" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          inline-label
        >
          <q-tab name="subscription" no-caps icon="paid" label="Assinatura" />
          <q-tab name="coupon" no-caps icon="percent" label="Cupons" />
          <q-tab name="history" no-caps icon="history" label="Histórico" />
          <q-tab
            name="capacity"
            no-caps
            icon="donut_large"
            label="Capacidade"
          />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="subscription" class="q-pa-none">
            <SubscriptionInfo />
          </q-tab-panel>
          <q-tab-panel name="coupon" class="q-pa-none">
            <TableCouponEnterprise />
          </q-tab-panel>
          <q-tab-panel name="history" class="q-pa-none">
            <TableHistorySubscription />
          </q-tab-panel>
          <q-tab-panel name="capacity" class="q-pa-none">
            <DashboardCapacity />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="emit('update:open')"
            color="red"
            label="Fechar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
