<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { ISubscriptionInfo } from 'src/ts/interfaces/data/SubscriptionInfo';
import { useManageResourceStore } from 'src/stores/manage-resource-store';
import { storeToRefs } from 'pinia';
import { CouponEnterprise } from 'src/ts/interfaces/data/Coupon';
// import TableCouponEnterprise from '../tables/TableCouponEnterprise.vue';
// import DashboardCapacity from './DashboardCapacity.vue';
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

const { getSubscriptionInfo, getCouponsInEnterprise } =
  useManageResourceStore();
const { loadingResource } = storeToRefs(useManageResourceStore());

const tab = ref<'subscription' | 'coupon' | 'capacity'>('subscription');
const dataSubscription = ref<ISubscriptionInfo | null>(null);
const listCouponsEnterprise = reactive<CouponEnterprise[]>([]);

const clear = (): void => {
  tab.value = 'subscription';
  dataSubscription.value = null;
  listCouponsEnterprise.splice(0, listCouponsEnterprise.length);
};
const fetchSubscription = async () => {
  const response = await getSubscriptionInfo();
  if (response?.status === 200) {
    dataSubscription.value = response.data.subscription;
    console.log('dataSubscription.value', dataSubscription.value);
  }
};
const fetchCoupons = async () => {
  const response = await getCouponsInEnterprise();
  if (response?.status === 200) {
    listCouponsEnterprise.splice(
      0,
      listCouponsEnterprise.length,
      ...response.data.coupons
    );
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(tab, async () => {
  if (tab.value === 'subscription') {
    await fetchSubscription();
  } else if (tab.value === 'coupon') {
    await fetchCoupons();
  } else {
    console.log('capacity');
  }
});
watch(
  open,
  async () => {
    if (open.value) {
      clear();
      await fetchSubscription();
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
          <!-- <q-tab name="coupon" no-caps icon="percent" label="Cupons" /> -->
          <!-- <q-tab
            name="capacity"
            no-caps
            icon="donut_large"
            label="Capacidade"
          /> -->
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="subscription" class="q-pa-none">
            <SubscriptionInfo
              :data="dataSubscription"
              :loading="loadingResource"
            />
          </q-tab-panel>
          <!-- <q-tab-panel name="coupon" class="q-pa-none">
            <TableCouponEnterprise
              :data="listCouponsEnterprise"
              :loading="loadingResource"
            />
          </q-tab-panel> -->
          <!-- <q-tab-panel name="capacity" class="q-pa-none">
            <DashboardCapacity />
          </q-tab-panel> -->
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
