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
    await createFeedback(dataFeedback.message);
    clear();
    emit('update:open');
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
        <TitlePage title="Envie uma sugestão ou uma dúvida" />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form>
          <q-input
            v-model="dataFeedback.message"
            style="height: 150px; max-height: 130px"
            bg-color="white"
            label-color="black"
            filled
            label="Digite aqui sua mensagem"
            dense
            input-class="text-black no-resize"
            type="textarea"
            class="no-resize"
          >
            <template v-slot:prepend>
              <q-icon name="description" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            @click="save"
            :loading="loadingFeedback"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
