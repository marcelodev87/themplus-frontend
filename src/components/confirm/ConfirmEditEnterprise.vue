<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'ConfirmEditEnterprise',
});

const emit = defineEmits<{
  'update:open': [void];
  'update:ok': [void];
}>();

const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const dataConfirm = reactive({
  text: '' as string,
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataConfirm.text.trim().toLowerCase() !== 'confirmar') {
    return { status: false, message: 'Digite CONFIRMAR para prosseguir' };
  }

  return { status: true };
};
const save = () => {
  const check = checkData();
  if (check.status) {
    emit('update:ok');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  Object.assign(dataConfirm, {
    text: '',
  });
};
const close = () => {
  emit('update:open');
};

onMounted(() => {
  clear();
});
</script>
<template>
  <q-card class="bg-grey-2 form-basic">
    <q-card-section class="q-pa-none">
      <TitlePage title="Confirmação de alteração de dados da organização" />
    </q-card-section>
    <q-card-section>
      <div class="text-subtitle2">
        Para confirmar as alterações nos dados da organização, por favor, digite
        <span class="text-subtitle2 text-red">CONFIRMAR</span> no campo de
        texto. É importante destacar que, uma vez alterados, os dados não
        poderão ser recuperados.
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="dataConfirm.text"
          bg-color="white"
          label-color="black"
          filled
          label="Digite 'CONFIMAR'"
          dense
          input-class="text-black"
        >
          <template v-slot:prepend>
            <q-icon name="check_circle" color="black" size="20px" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>
    <q-card-actions align="right">
      <div class="row justify-end items-center q-gutter-x-sm">
        <q-btn
          @click="close"
          color="red"
          label="Voltar"
          size="md"
          flat
          unelevated
          no-caps
        />
        <q-btn
          @click="save"
          :loading="loadingEnterprise"
          color="primary"
          label="Salvar"
          size="md"
          unelevated
          no-caps
        />
      </div>
    </q-card-actions>
  </q-card>
</template>
