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
  'update:ok': [password: string];
}>();

const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const dataPassword = reactive({
  passwordActual: '' as string,
  passwordConfirm: '' as string,
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataPassword.passwordActual.trim() === '') {
    return { status: false, message: 'Informe sua senha' };
  }

  if (
    dataPassword.passwordActual.trim() !== dataPassword.passwordConfirm.trim()
  ) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};
const save = () => {
  const check = checkData();
  if (check.status) {
    emit('update:ok', dataPassword.passwordActual);
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  Object.assign(dataPassword, {
    passwordActual: '',
    passwordConfirm: '',
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
      <div class="text-subtitle2 text-red">
        Para confirmar as alterações nos dados da organização, por favor, digite
        sua senha e confirme-a logo em seguida. É importante destacar que, uma
        vez alterados, os dados não poderão ser recuperados.
      </div>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <q-form class="q-gutter-y-sm">
        <q-input
          v-model="dataPassword.passwordActual"
          bg-color="white"
          label-color="black"
          filled
          label="Digite sua senha"
          dense
          input-class="text-black"
          type="password"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="dataPassword.passwordConfirm"
          bg-color="white"
          label-color="black"
          filled
          label="Confirme sua senha"
          dense
          input-class="text-black"
          type="password"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="black" size="20px" />
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
