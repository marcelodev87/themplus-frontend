<script setup lang="ts">
import { computed } from 'vue';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'EmailInfo',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const openURL = (url: string) => {
  window.open(url, '_blank');
};
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Entre em contato" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <div class="row items-start q-gutter-md">
          <div class="contact-icon">
            <q-icon name="support_agent" color="primary" size="22px" />
          </div>

          <div class="col">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-sm">
              Atendimento via WhatsApp
            </div>

            <div class="text-body2 text-grey-8 line-height-relaxed">
              Teve algum problema? Nosso WhatsApp está pronto para te ajudar.
              Envie suas dúvidas, prints e informações para:
            </div>

            <div class="phone-box q-mt-md">
              <q-icon name="phone" size="16px" color="primary" />
              <span class="text-weight-bold text-grey-10">
                (21) 97920-0654
              </span>
            </div>

            <div class="text-caption text-grey-7 q-mt-sm">
              Atendimento rápido e eficiente.
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-pa-lg">
        <div class="row justify-end full-width q-gutter-sm">
          <q-btn
            color="red"
            label="Fechar"
            flat
            no-caps
            @click="open = false"
          />
          <q-btn
            color="primary"
            label="Abrir WhatsApp"
            icon="open_in_new"
            no-caps
            unelevated
            @click="openURL('https://wa.me/5521979200654')"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.contact-icon {
  background: white;
  border-radius: 12px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.phone-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e0e0e0;
  padding: 8px 12px;
  border-radius: 10px;
}

.line-height-relaxed {
  line-height: 1.5;
}
</style>
