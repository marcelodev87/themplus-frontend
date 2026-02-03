<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { useFeedbackStore } from 'src/stores/feedback-store';

defineOptions({
  name: 'FormFeedback',
});

const { loadingFeedback } = storeToRefs(useFeedbackStore());
const { createFeedback } = useFeedbackStore();

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataFeedback = reactive({
  message: '' as string,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataFeedback.message.trim() === '') {
    return {
      status: false,
      message: 'A mensagem deve ser informada',
    };
  }
  return { status: true };
};
const clear = (): void => {
  dataFeedback.message = '';
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createFeedback(dataFeedback.message);
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

watch(open, () => {
  if (open.value) {
    clear();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Envie uma sugestão" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg">
        <div class="row items-start q-gutter-md q-mb-md">
          <div class="feedback-icon">
            <q-icon name="rate_review" color="primary" size="22px" />
          </div>
          <div>
            <div class="text-subtitle2 text-weight-bold text-grey-9">
              Sua opinião é importante
            </div>
            <div class="text-caption text-grey-7">
              Conte para nós sugestões, problemas ou melhorias.
            </div>
          </div>
        </div>
        <q-form>
          <div class="input-wrapper">
            <q-input
              v-model="dataFeedback.message"
              type="textarea"
              filled
              autogrow
              counter
              maxlength="5000"
              bg-color="white"
              label="Digite aqui sua mensagem"
              label-color="black"
              input-class="text-black no-resize"
              class="textarea-soft"
            >
              <template #prepend>
                <q-icon name="description" color="grey-8" size="20px" />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions class="q-pa-lg">
        <div class="row full-width justify-end q-gutter-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            flat
            no-caps
          />
          <q-btn
            @click="save"
            :loading="loadingFeedback"
            color="primary"
            label="Enviar sugestão"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
