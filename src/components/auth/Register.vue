<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
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

const isPwd = ref<boolean>(true);
const dataRegister = reactive<DataRegister>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  nameEnterprise: '',
  position: 'Cliente',
});

const clear = (): void => {
  Object.assign(dataRegister, {
    name: '',
    email: '',
    nameEnterprise: '',
    password: '',
    confirmPassword: '',
    position: 'Cliente',
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
      dataRegister.nameEnterprise,
      dataRegister.position === 'Cliente' ? 'client' : 'counter'
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
  <q-form
    class="form-auth q-pa-lg shadow-2 rounded-borders bg-white"
    style="max-width: 450px; width: 100%"
  >
    <div class="row justify-center q-mb-md">
      <q-img src="/images/logo.png" width="200px" />
    </div>

    <div class="text-center q-mb-lg">
      <TitleAuth title="Crie sua conta" />
      <div class="text-grey-7 text-caption">
        Preencha os dados abaixo para começar
      </div>
    </div>

    <div class="q-gutter-y-sm">
      <q-select
        v-model="dataRegister.position"
        :options="['Cliente', 'Contador']"
        label="Eu sou..."
        outlined
        dense
        color="red-6"
        emit-value
        map-options
      >
        <template v-slot:prepend>
          <q-icon name="verified_user" color="grey-7" size="20px" />
        </template>
      </q-select>

      <q-input
        v-model="dataRegister.name"
        outlined
        label="Nome de usuário"
        dense
        color="red-6"
      >
        <template v-slot:prepend>
          <q-icon name="person_outline" color="grey-7" size="20px" />
        </template>
      </q-input>

      <q-input
        v-model="dataRegister.email"
        outlined
        label="E-mail"
        type="email"
        dense
        color="red-6"
      >
        <template v-slot:prepend>
          <q-icon name="mail_outline" color="grey-7" size="20px" />
        </template>
      </q-input>

      <q-input
        v-model="dataRegister.nameEnterprise"
        outlined
        label="Nome da organização"
        dense
        color="red-6"
      >
        <template v-slot:prepend>
          <q-icon name="business" color="grey-7" size="20px" />
        </template>
      </q-input>

      <div class="row q-col-gutter-x-sm">
        <div class="col-12 col-sm-6">
          <q-input
            v-model="dataRegister.password"
            outlined
            label="Senha"
            dense
            color="red-6"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="lock_open" color="grey-7" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6">
          <q-input
            v-model="dataRegister.confirmPassword"
            outlined
            label="Confirmar"
            dense
            color="red-6"
            :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon name="lock_clock" color="grey-7" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                @click="isPwd = !isPwd"
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                size="20px"
              />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <div class="q-mt-sm">
      <q-btn
        @click="register"
        color="red-6"
        label="Finalizar Cadastro"
        class="full-width"
        dense
        size="md"
        :loading="loadingAuth"
        unelevated
        no-caps
      />
    </div>
    <div class="column items-center justify-center q-mt-md q-gutter-x-sm">
      <span class="text-grey-7">Já tem conta?</span>
      <q-btn
        @click="changeRender('login')"
        color="red-6"
        label="Fazer Login"
        flat
        dense
        no-caps
      />
    </div>
  </q-form>
</template>

<style scoped>
/* Melhora a borda arredondada global dos inputs no componente */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}
</style>
