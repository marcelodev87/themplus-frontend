<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataPerfil } from 'src/ts/interfaces/data/User';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'src/stores/department_store';
import DepartmentChoose from '../shared/DepartmentChoose.vue';

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
const { listDepartment, loadingDepartment } = storeToRefs(useDepartmentStore());
const { getDepartments } = useDepartmentStore();

const mode = ref<'data' | 'password'>('data');
const isPwd = ref<boolean>(true);
const isPwd2 = ref<boolean>(true);
const isPwd3 = ref<boolean>(true);
const showDepartmentChoose = ref<boolean>(false);
const dataPerfil = reactive<DataPerfil>({
  name: '',
  email: '',
  passwordActual: '',
  passwordNew: '',
  passwordNewConfirm: '',
  phone: '',
  department: null,
  departmentName: null,
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
    if (dataPerfil.phone.trim() !== '') {
      if (!/^\+?[1-9]\d{1,14}$/.test(dataPerfil.phone.trim())) {
        return { status: false, message: 'Digite um telefone válido' };
      }
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
      await updateUserData(
        dataPerfil.name,
        dataPerfil.email,
        dataPerfil.phone?.trim() !== '' ? dataPerfil.phone : null,
        dataPerfil.department ?? null
      );
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
    phone: '',
    department: null,
    departmentName: null,
  });
  mode.value = 'data';
};
const mountUserEdit = () => {
  Object.assign(dataPerfil, {
    name: user.value?.name,
    email: user.value?.email,
    password: '',
    confirmPassword: '',
    phone: user.value?.phone === null ? '' : user.value?.phone,
    department: user.value?.department_id ?? null,
    departmentName: user.value?.department_id
      ? listDepartment.value.find(
          (item) => item.id === user.value?.department_id
        )?.name
      : null,
  });
};
const openDepartmentChoose = (): void => {
  showDepartmentChoose.value = true;
};
const closeDepartmentChoose = (): void => {
  showDepartmentChoose.value = false;
};
const handleChooseDepartment = (
  tree: { id: string; label: string } | null
): void => {
  dataPerfil.department = tree === null ? null : tree.id;
  dataPerfil.departmentName = tree === null ? null : tree.label;
  closeDepartmentChoose();
};
const fetchDepartments = async () => {
  await getDepartments();
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
watch(open, async () => {
  if (open.value) {
    clear();
    await fetchDepartments();
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
            <q-input
              v-model="dataPerfil.phone"
              bg-color="white"
              label-color="black"
              filled
              label="Telefone do usuário"
              dense
              input-class="text-black"
            >
              <template v-slot:prepend>
                <q-icon name="call" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataPerfil.departmentName"
              bg-color="white"
              label-color="black"
              filled
              type="text"
              label="Escolher departamento"
              readonly
              disabled
              clearable
              dense
            >
              <template v-slot:prepend>
                <q-icon name="groups" color="black" size="20px" />
              </template>
              <template v-slot:append>
                <q-icon
                  name="search"
                  class="cursor-pointer"
                  @click="openDepartmentChoose"
                />
              </template>
            </q-input>
            <DepartmentChoose
              :open="showDepartmentChoose"
              @update:open="closeDepartmentChoose"
              @update:choose-department="handleChooseDepartment"
            />
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
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  @click="isPwd = !isPwd"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="20px"
                />
              </template>
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
              :type="isPwd2 ? 'password' : 'text'"
              :readonly="dataPerfil.passwordActual.trim().length == 0"
            >
              <template v-slot:append>
                <q-icon
                  @click="isPwd2 = !isPwd2"
                  :name="isPwd2 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="20px"
                />
              </template>
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
              :type="isPwd3 ? 'password' : 'text'"
              :readonly="dataPerfil.passwordActual.trim().length == 0"
            >
              <template v-slot:append>
                <q-icon
                  @click="isPwd3 = !isPwd3"
                  :name="isPwd3 ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="20px"
                />
              </template>
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
      <q-inner-loading
        :showing="loadingDepartment"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
