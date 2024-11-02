<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataPerfil } from 'src/ts/interfaces/data/User';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'FormPerfil',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingAuth, user } = storeToRefs(useAuthStore());
const { updateUserData, updateUserPassword } = useAuthStore();

const mode = ref<'data' | 'password'>('data');
const dataPerfil = reactive<DataPerfil>({
  name: '',
  email: '',
  passwordActual: '',
  passwordNew: '',
  passwordNewConfirm: '',
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (mode.value === 'data') {
    if (dataPerfil.name.trim() === '') {
      return { status: false, message: 'Deve ser informado o nome do usuário' };
    }
    if (dataPerfil.name.trim().length < 2) {
      return {
        status: false,
        message: 'Nome de usuário deve ter mais de 2 caracteres',
      };
    }
    if (dataPerfil.email.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado o e-mail do usuário',
      };
    }
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        dataPerfil.email.trim()
      )
    ) {
      return { status: false, message: 'Informe um e-mail válido' };
    }
  } else if (dataPerfil.passwordActual.trim().length > 0) {
    if (dataPerfil.passwordActual.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a senha do usuário',
      };
    }
    if (dataPerfil.passwordActual.trim().length < 7) {
      return {
        status: false,
        message: 'A senha deve conter mais de 7 caracteres',
      };
    }
    if (dataPerfil.passwordNew.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a nova senha do usuário',
      };
    }
    if (dataPerfil.passwordActual.trim().length < 7) {
      return {
        status: false,
        message: 'A nova senha deve conter mais de 7 caracteres',
      };
    }
    if (
      dataPerfil.passwordNew.trim() !== dataPerfil.passwordNewConfirm.trim()
    ) {
      return { status: false, message: 'As novas senhas não coincidem' };
    }
  }
  return { status: true };
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    if (mode.value === 'data') {
      await updateUserData(dataPerfil.name, dataPerfil.email);
    } else {
      await updateUserPassword(
        dataPerfil.passwordActual,
        dataPerfil.passwordNew
      );
    }
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const clear = (): void => {
  Object.assign(dataPerfil, {
    name: '',
    email: '',
    passwordActual: '',
    passwordNew: '',
    passwordNewConfirm: '',
  });
  mode.value = 'data';
};
const mountUserEdit = () => {
  Object.assign(dataPerfil, {
    name: user.value?.name,
    email: user.value?.email,
    password: '',
    confirmPassword: '',
  });
};

watch(
  () => dataPerfil.passwordActual,
  (password) => {
    if (password.trim().length === 0) {
      dataPerfil.passwordNew = '';
      dataPerfil.passwordNewConfirm = '';
    }
  }
);
watch(open, () => {
  if (open.value) {
    clear();
    mountUserEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados do perfil" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form>
          <div v-if="mode === 'data'" class="q-gutter-y-sm">
            <q-input
              v-model="dataPerfil.name"
              bg-color="white"
              label-color="black"
              filled
              label="Nome do usuário"
              dense
              input-class="text-black"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataPerfil.email"
              bg-color="white"
              label-color="black"
              filled
              label="E-mail do usuário"
              dense
              input-class="text-black"
            >
              <template v-slot:prepend>
                <q-icon name="mail" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <div v-else class="q-gutter-y-sm">
            <q-input
              v-model="dataPerfil.passwordActual"
              bg-color="white"
              label-color="black"
              filled
              label="Digite a senha do atual"
              dense
              input-class="text-black"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataPerfil.passwordNew"
              bg-color="white"
              label-color="black"
              filled
              label="Digite a nova senha"
              dense
              input-class="text-black"
              :readonly="dataPerfil.passwordActual.trim().length == 0"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataPerfil.passwordNewConfirm"
              bg-color="white"
              label-color="black"
              filled
              label="Confirme a nova senha"
              dense
              input-class="text-black"
              :readonly="dataPerfil.passwordActual.trim().length == 0"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="black" size="20px" />
              </template>
            </q-input>
          </div>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            :disable="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="mode = 'password'"
            v-show="mode === 'data'"
            color="grey-8"
            label="Alterar senha"
            size="md"
            :loading="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="mode = 'data'"
            v-show="mode === 'password'"
            color="grey-8"
            label="Voltar"
            size="md"
            :loading="false"
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            :loading="loadingAuth"
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
