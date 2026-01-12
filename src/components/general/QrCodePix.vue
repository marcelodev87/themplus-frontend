<script setup lang="ts">
import { watch, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { Notify } from 'quasar';

defineOptions({
  name: 'QrCodePix',
});

const props = defineProps<{
  subscriptionID: string | null;
}>();

const { loadingSubscription } = storeToRefs(useSubscriptionStore());

const pixData = reactive({
  encodedImage: '',
  payload: '',
});

const getQRCode = async (subscriptionID: string) => {
  const response = await useSubscriptionStore().generateQrCode(subscriptionID);

  if (response?.data.pix) {
    pixData.encodedImage = response.data.pix.encodedImage;
    pixData.payload = response.data.pix.payload;
  }
};
const getQrCodeImage = (base64: string): string => {
  if (base64.startsWith('data:image')) {
    return base64;
  }

  return `data:image/png;base64,${base64}`;
};
const copyPayload = async () => {
  try {
    await navigator.clipboard.writeText(pixData.payload);
    Notify.create({
      message: 'Chave copiada',
      type: 'positive',
    });
  } catch (e) {
    console.error('Erro ao copiar:', e);
    Notify.create({
      message: 'Erro ao copiar chave',
      type: 'negative',
    });
  }
};

watch(
  () => props.subscriptionID,
  async (newSubscriptionID) => {
    if (newSubscriptionID) {
      await getQRCode(newSubscriptionID);
    }
  },
  { immediate: true }
);
</script>

<template>
  <section>
    <div>
      <div
        class="flex column justify-center items-center q-gutter-y-sm"
        v-show="!loadingSubscription"
      >
        <span class="text-grey text-weight-regular text-body1"
          >Escaneie o QRCode ou pague na chave copia e cola.</span
        >
        <img
          :src="getQrCodeImage(pixData.encodedImage)"
          alt="QR Code"
          style="height: 220px"
          draggable="false"
        />
        <span class="text-grey text-center text-weight-regular text-body1"
          >Chave copia e cola: {{ pixData.payload }}</span
        >
        <q-btn
          label="Copiar chave"
          color="primary"
          @click="copyPayload()"
          no-caps
          outline
        />
      </div>
    </div>
  </section>
</template>
