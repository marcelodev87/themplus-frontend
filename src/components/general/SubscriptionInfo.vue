<script setup lang="ts">
import { ISubscriptionInfo } from 'src/ts/interfaces/data/SubscriptionInfo';
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'SubscriptionInfo',
});

const props = defineProps<{
  data: ISubscriptionInfo | null;
  loading: boolean;
}>();

const subscription = computed(() => {
  if (props.data?.subscription === 'free') {
    return 'gratuíta';
  }
  if (props.data?.subscription === 'basic') {
    return 'básica';
  }
  if (props.data?.subscription === 'advanced') {
    return 'avançada';
  }
  return 'personalizada';
});
</script>

<template>
  <q-card class="bg-grey-2 full-width">
    <q-card-section class="q-pa-none">
      <TitlePage title="Gerenciamento de assinatura" />
    </q-card-section>
    <q-card-section class="q-pa-sm q-gutter-y-sm">
      <q-banner
        dense
        inline-actions
        class="text-black bg-grey-3 q-pa-md rounded-borders"
        v-show="!props.loading"
      >
        A assinatura de sua organização é
        <span class="text-primary text-bold">{{ subscription }}</span
        >. O custo da mesma é
        <span class="text-primary text-bold">
          R$
          {{
            (props.data?.value ?? 0).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          }}
        </span>
        mensalmente.
      </q-banner>
    </q-card-section>
    <q-inner-loading
      :showing="props.loading"
      label="Carregando os dados..."
      label-class="black"
      label-style="font-size: 1.1em"
      color="primary"
      size="50px"
    />
  </q-card>
</template>
