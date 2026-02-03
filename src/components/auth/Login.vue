<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Notify } from 'quasar';
import { DataLogin } from 'src/ts/interfaces/data/User';
import { RenderAuth } from 'src/ts/types/FormMode';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';

defineOptions({
  name: 'Login',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());
const { doLogin } = useAuthStore();

const isPwd = ref<boolean>(true);
const dataLogin = reactive<DataLogin>({
  email: '',
  password: '',
});

const clear = (): void => {
  Object.assign(dataLogin, {
    email: '',
    password: '',
  });
};
const changeRender = (render: RenderAuth): void => {
  emit('update:changeRender', render);
};
const checkData = (): { status: boolean; message?: string } => {
  if (dataLogin.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      dataLogin.email.trim()
    )
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (dataLogin.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  return { status: true };
};
const login = async () => {
  const check = checkData();
  if (check.status) {
    await doLogin(dataLogin.email, dataLogin.password);
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

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
      <q-img src="/images/logo.png" width="220px" />
    </div>

    <div class="text-center q-mb-lg">
      <TitleAuth title="Bem-vindo de volta" />
      <div class="text-grey-7">Faça login para acessar sua conta</div>
    </div>

    <div class="q-gutter-y-md">
      <q-input
        v-model="dataLogin.email"
        outlined
        dense
        label="E-mail"
        autocomplete="email"
      >
        <template v-slot:prepend>
          <q-icon name="mail_outline" color="grey-7" />
        </template>
      </q-input>

      <q-input
        v-model="dataLogin.password"
        outlined
        dense
        label="Senha"
        :type="isPwd ? 'password' : 'text'"
      >
        <template v-slot:prepend>
          <q-icon name="lock_open" color="grey-7" />
        </template>
        <template v-slot:append>
          <q-icon
            @click="isPwd = !isPwd"
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
          />
        </template>
      </q-input>
    </div>

    <div class="row justify-end q-mt-xs">
      <q-btn
        flat
        no-caps
        color="grey-7"
        label="Esqueceu a senha?"
        size="md"
        @click="changeRender('reset')"
      />
    </div>

    <div class="q-mt-sm">
      <q-btn
        @click="login"
        color="red-6"
        label="Entrar"
        class="full-width"
        dense
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>

    <div class="column items-center justify-center q-mt-md">
      <span class="text-grey-7 q-mr-xs">Não tem uma conta?</span>
      <q-btn
        flat
        no-caps
        color="red-6"
        label="Cadastre-se"
        dense
        @click="changeRender('register')"
      />
    </div>
  </q-form>
</template>
