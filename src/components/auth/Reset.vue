<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { Notify } from 'quasar';
import { RenderAuth } from 'src/ts/types/FormMode';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';

defineOptions({
  name: 'ResetPassword',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());
const { doReset, doVerify, setNewPassword } = useAuthStore();

const emailRegex = ref<RegExp>(
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
);
const dataReset = reactive({
  email: '' as string,
  code: '' as string,
  password: '' as string,
  passwordConfirm: '' as string,
});
const modeView = ref<'setEmail' | 'setCode' | 'setPassword'>('setEmail');
const isPwd = ref<boolean>(true);

const checkDataReset = () => {
  if (dataReset.email.trim() === '') {
    return { status: false, message: 'Campo de e-mail não pode ser vazio' };
  }
  if (!emailRegex.value.test(dataReset.email)) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  return { status: true };
};
const checkPassword = () => {
  if (dataReset.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  if (dataReset.password.trim().length < 8) {
    return {
      status: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    };
  }
  if (dataReset.password.trim() !== dataReset.passwordConfirm.trim()) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};

const clear = (): void => {
  Object.assign(dataReset, {
    email: '',
    code: '',
    password: '',
    passwordConfirm: '',
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
    const response = await doReset(dataReset.email);
    if (response?.status === 200) {
      modeView.value = 'setCode';
    }
  }
};
const verifyCode = async () => {
  const response = await doVerify(dataReset.code, dataReset.email);
  if (response?.status === 200 && response.data.valid) {
    modeView.value = 'setPassword';
  }
};
const newPassword = async () => {
  const check = checkPassword();
  if (check.status) {
    const response = await setNewPassword(dataReset.password, dataReset.email);
    if (response?.status === 200) {
      emit('update:changeRender', 'login');
      clear();
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

watch(
  modeView,
  (mode) => {
    if (mode === 'setEmail') {
      clear();
    }
  },
  { immediate: true }
);

onMounted(() => {
  clear();
});
</script>

<template>
  <q-form
    class="form-auth q-pa-lg shadow-2 rounded-borders bg-white"
    style="max-width: 400px; width: 100%"
  >
    <div class="row justify-center q-mb-md">
      <q-img src="/images/logo.png" width="180px" />
    </div>

    <div class="text-center q-mb-lg">
      <TitleAuth title="Recuperar Senha" />
      <div class="text-grey-7" v-if="modeView === 'setEmail'">
        Enviaremos um código para o seu e-mail
      </div>
    </div>

    <div class="q-gutter-y-md q-mb-lg">
      <q-input
        v-if="modeView === 'setEmail'"
        v-model="dataReset.email"
        dense
        outlined
        label="Seu e-mail"
      >
        <template v-slot:prepend><q-icon name="mail_outline" /></template>
      </q-input>

      <q-input
        v-else-if="modeView === 'setCode'"
        v-model="dataReset.code"
        dense
        outlined
        label="Código"
      >
        <template v-slot:prepend><q-icon name="pin" /></template>
      </q-input>

      <template v-else>
        <q-input
          v-model="dataReset.password"
          outlined
          dense
          label="Nova Senha"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:prepend><q-icon name="lock_outline" /></template>
          <template v-slot:append>
            <q-icon
              @click="isPwd = !isPwd"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="20px"
            />
          </template>
        </q-input>
        <q-input
          v-model="dataReset.passwordConfirm"
          outlined
          dense
          label="Confirmar Nova Senha"
          :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:prepend><q-icon name="lock_outline" /></template>
          <template v-slot:append>
            <q-icon
              @click="isPwd = !isPwd"
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              size="20px"
            />
          </template>
        </q-input>
      </template>
    </div>

    <q-btn
      v-if="modeView === 'setEmail'"
      @click="sendEmailReset"
      color="red-6"
      label="Enviar Código"
      class="full-width"
      unelevated
      no-caps
    />
    <q-btn
      v-show="modeView === 'setCode'"
      @click="verifyCode"
      color="red-6"
      label="Verificar"
      size="md"
      class="full-width"
      :loading="loadingAuth"
      unelevated
      no-caps
    />
    <q-btn
      v-show="modeView === 'setPassword'"
      @click="newPassword"
      color="red-6"
      label="Salvar"
      size="md"
      class="full-width"
      :loading="loadingAuth"
      unelevated
      no-caps
    />
    <div class="row justify-center q-mt-md">
      <q-btn
        flat
        no-caps
        color="grey-7"
        label="Voltar para o login"
        icon="arrow_back"
        @click="changeRender('login')"
      />
    </div>
  </q-form>
</template>
