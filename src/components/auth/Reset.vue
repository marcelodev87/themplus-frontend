<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';
import { RenderAuth } from 'src/ts/types/FormMode';

defineOptions({
  name: 'ResetPassword',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const emailRegex = ref<RegExp>(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
);
const dataReset = reactive({
  email: '' as string,
});

const checkDataReset = () => {
  if (dataReset.email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  } if (!emailRegex.value.test(dataReset.email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  return { status: true };
};

const clear = (): void => {
  Object.assign(dataReset, {
    email: '',
  });
};
const changeRender = (render: RenderAuth): void => {
  emit('update:changeRender', render);
};
const sendEmailReset = async () => {
  const verifyData = checkDataReset();
  if (!verifyData.status) {
    Notify.create({
      message: verifyData.message,
      type: 'negative',
    });
  } else {
    Notify.create({
      message: 'Enviado e-mail para redefinição de senha',
      type: 'positive',
    });
    emit('update:changeRender', 'login');
  }
};

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form class="form-auth rounded-borders bg-grey-3">
    <div class="row justify-center items-center q-pa-md">
      <q-img
        src="/images/logo.png"
        spinner-color="white"
        width="250px"
      />
    </div>
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <q-input
        v-model="dataReset.email"
        bg-color="white"
        label-color="black"
        standout
        label="Digite seu e-mail"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <div class="q-pb-sm q-px-md row justify-end items-center q-gutter-x-sm">
      <q-btn
        @click="changeRender('register')"
        color="black"
        label="Cadastrar"
        size="md"
        :disable="false"
        no-caps
        flat
      />
      <q-btn
        @click="changeRender('login')"
        color="black"
        label="Entrar"
        size="md"
        :disable="false"
        no-caps
        flat
      />
      <q-btn
        @click="sendEmailReset"
        color="red-6"
        label="Enviar e-mail de redefinição"
        size="md"
        :loading="false"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>
