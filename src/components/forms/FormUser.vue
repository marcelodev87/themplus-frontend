<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataUserMember, User } from 'src/ts/interfaces/data/User';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';

defineOptions({
  name: 'FormUser',
});

const props = defineProps<{
  open: boolean;
  dataEdit: User | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingUsersMembers } = storeToRefs(useUsersMembersStore());
const { createUserMember, updateUserMember } = useUsersMembersStore();

const dataUser = reactive<DataUserMember>({
  name: '',
  position: 'common_user',
  email: '',
  password: '',
  confirmPassword: '',
});
const optionsUserPositions = reactive([
  {
    label: 'Administrador',
    value: 'admin',
  },
  {
    label: 'Usuário comum',
    value: 'common_user',
  },
]);
const selectedUserPosition = ref<QuasarSelect<string>>({
  label: 'Usuário comum',
  value: 'common_user',
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataUser.name.trim() === '') {
    return { status: false, message: 'Deve ser informado o nome do usuário' };
  }
  if (dataUser.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome de usuário deve ter mais de 2 caracteres',
    };
  }
  if (dataUser.email.trim() === '') {
    return { status: false, message: 'Deve ser informado o e-mail do usuário' };
  }
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      dataUser.email.trim()
    )
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }
  if (props.dataEdit === null) {
    if (dataUser.password.trim() === '') {
      return {
        status: false,
        message: 'Deve ser informado a senha do usuário',
      };
    }
    if (dataUser.password.trim().length < 7) {
      return {
        status: false,
        message: 'A senha deve conter mais de 7 caracteres',
      };
    }
    if (
      dataUser.password.trim() !==
      (dataUser.confirmPassword && dataUser.confirmPassword.trim())
    ) {
      return { status: false, message: 'As senhas não coincidem' };
    }
  }
  return { status: true };
};
const clear = (): void => {
  Object.assign(dataUser, {
    name: '',
    position: 'common_user',
    email: '',
    password: '',
    confirmPassword: '',
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createUserMember(
      dataUser.name,
      dataUser.position,
      dataUser.email,
      dataUser.password
    );
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const update = async () => {
  const check = checkData();
  if (check.status) {
    await updateUserMember(
      props.dataEdit?.id ?? '',
      dataUser.name,
      dataUser.email,
      null,
      dataUser.position,
      null
    );
    clear();
    emit('update:open');
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const checkDataEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataUser, {
      name: props.dataEdit.name,
      email: props.dataEdit.email,
      position: props.dataEdit.position,
    });
    selectedUserPosition.value =
      props.dataEdit !== null && props.dataEdit.position === 'admin'
        ? { label: 'Administrador', value: 'admin' }
        : { label: 'Usuário comum', value: 'common_user' };
  }
};

watch(open, () => {
  if (open.value) {
    clear();
    checkDataEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Cadastre um usuário" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataUser.name"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o nome do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataUser.email"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o e-mail do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            filled
            v-model="selectedUserPosition"
            label="Selecione o cargo"
            :options="optionsUserPositions"
            bg-color="white"
            dense
            options-dense
            map-options
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="supervisor_account" color="black" size="20px" />
            </template>
          </q-select>
          <q-input
            v-show="props.dataEdit === null"
            v-model="dataUser.password"
            bg-color="white"
            label-color="black"
            filled
            label="Digite a senha do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-show="props.dataEdit === null"
            v-model="dataUser.confirmPassword"
            bg-color="white"
            label-color="black"
            filled
            label="Confirme a senha do usuário"
            dense
            input-class="text-black"
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
            v-if="props.dataEdit === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingUsersMembers"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingUsersMembers"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
