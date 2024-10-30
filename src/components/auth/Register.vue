<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { Notify } from 'quasar';
import { DataRegister } from 'src/ts/interfaces/data/User';
import { RenderAuth } from 'src/ts/types/FormMode';
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth-store';
import TitleAuth from '../shared/TitleAuth.vue';

defineOptions({
  name: 'Register',
});

const emit = defineEmits<{
  'update:changeRender': [RenderAuth];
}>();

const { loadingAuth } = storeToRefs(useAuthStore());
const { doRegister } = useAuthStore();

const dataRegister = reactive<DataRegister>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  nameEnterprise: '',
});

const clear = (): void => {
  Object.assign(dataRegister, {
    name: '',
    email: '',
    nameEnterprise: '',
    password: '',
    confirmPassword: '',
  });
};
const changeRender = (render: RenderAuth): void => {
  emit('update:changeRender', render);
};
const checkData = (): { status: boolean; message?: string } => {
  if (dataRegister.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome de usuário' };
  }
  if (dataRegister.name.trim().length < 3) {
    return {
      status: false,
      message: 'O nome de usuário deve conter pelo menos 3 caracteres',
    };
  }
  if (dataRegister.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail' };
  }
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      dataRegister.email.trim()
    )
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (dataRegister.nameEnterprise.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome de sua organização',
    };
  }
  if (dataRegister.nameEnterprise.trim().length < 3) {
    return {
      status: false,
      message: 'O nome da organização deve conter pelo menos 3 caracteres',
    };
  }
  if (dataRegister.password.trim() === '') {
    return { status: false, message: 'Deve ser informado uma senha' };
  }
  if (dataRegister.password.trim().length < 8) {
    return {
      status: false,
      message: 'A senha deve conter pelo menos 8 caracteres',
    };
  }
  if (dataRegister.confirmPassword.trim() !== dataRegister.password.trim()) {
    return { status: false, message: 'As senhas devem ser iguais' };
  }
  return { status: true };
};
const register = async () => {
  const check = checkData();
  if (check.status) {
    await doRegister(
      dataRegister.name,
      dataRegister.email,
      dataRegister.password,
      dataRegister.nameEnterprise
    );
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
  <q-form class="form-auth rounded-borders bg-grey-3">
    <div class="row justify-center items-center q-pa-md">
      <q-img src="/images/logo.png" spinner-color="white" width="250px" />
    </div>
    <div class="q-px-md">
      <TitleAuth title="Faça seu cadastro" />
    </div>
    <div class="q-pb-sm q-px-md q-gutter-y-sm">
      <q-input
        v-model="dataRegister.name"
        bg-color="white"
        label-color="black"
        filled
        label="Digite seu nome de usuário"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="person" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.email"
        bg-color="white"
        label-color="black"
        filled
        label="Digite seu e-mail"
        autocomplete="new-email"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="email" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.nameEnterprise"
        bg-color="white"
        label-color="black"
        filled
        label="Digite o nome de sua organização"
        dense
        input-class="text-black"
      >
        <template v-slot:prepend>
          <q-icon name="corporate_fare" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.password"
        bg-color="white"
        label-color="black"
        filled
        label="Digite sua senha"
        autocomplete="new-password"
        dense
        input-class="text-black"
        type="password"
      >
        <template v-slot:prepend>
          <q-icon name="key" color="black" size="20px" />
        </template>
      </q-input>
      <q-input
        v-model="dataRegister.confirmPassword"
        bg-color="white"
        label-color="black"
        filled
        label="Confirme sua senha"
        autocomplete="new-password"
        dense
        input-class="text-black"
        type="password"
      >
        <template v-slot:prepend>
          <q-icon name="key" color="black" size="20px" />
        </template>
      </q-input>
    </div>
    <div class="q-pb-sm q-px-md row justify-end items-center q-gutter-x-sm">
      <q-btn
        color="black"
        label="Esqueceu senha"
        size="md"
        flat
        @click="changeRender('reset')"
        no-caps
      />
      <q-btn
        @click="changeRender('login')"
        color="black"
        label="Entrar"
        size="md"
        unelevated
        no-caps
        flat
      />
      <q-btn
        @click="register"
        color="red-6"
        label="Cadastrar"
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>
