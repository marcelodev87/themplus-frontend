<script setup lang="ts">
import { computed } from 'vue';
import { ICounterSubscriptionUsage } from 'src/ts/interfaces/data/Subscription';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'DashboardCapacity',
});

const props = defineProps<{
  usage: ICounterSubscriptionUsage | null;
  loading: boolean;
}>();

const limitLabel = computed(() => {
  if (!props.usage || props.usage.limit === null) return 'Ilimitado';
  return String(props.usage.limit);
});

const progress = computed(() => {
  if (!props.usage || !props.usage.limit) return 0;
  return Math.min(props.usage.used / props.usage.limit, 1);
});

const progressColor = computed(() => {
  if (!props.usage) return 'grey';
  if (props.usage.is_over_limit) return 'negative';
  if (props.usage.limit && props.usage.used >= props.usage.limit)
    return 'orange';
  return 'primary';
});
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Painel de capacidade" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm" v-show="!loading">
      <div class="row items-center justify-between">
        <span class="text-black">Licenças Básicas concedidas</span>
        <span class="text-bold text-black"
          >{{ usage?.used ?? 0 }} / {{ limitLabel }}</span
        >
      </div>
      <q-linear-progress
        v-if="usage?.limit"
        :value="progress"
        :color="progressColor"
        track-color="grey-4"
        size="14px"
        rounded
      />
      <q-banner
        v-if="usage?.is_over_limit"
        dense
        inline-actions
        class="text-white bg-negative q-mt-sm rounded-borders"
      >
        Você está com {{ usage.excess }} licença(s) acima do limite do seu
        plano. Desvincule empresas da assinatura Básica na lista abaixo para
        regularizar.
      </q-banner>
      <q-banner
        v-else-if="!usage?.is_active"
        dense
        inline-actions
        class="text-black bg-grey-3 q-mt-sm rounded-borders"
      >
        Você ainda não possui um plano de contador ativo. Contrate um plano para
        poder conceder assinaturas Básicas aos seus clientes.
      </q-banner>
    </q-card-section>
    <q-inner-loading
      :showing="loading"
      label="Carregando os dados..."
      label-class="black"
      label-style="font-size: 1.1em"
      color="primary"
      size="50px"
    />
  </q-card>
</template>
