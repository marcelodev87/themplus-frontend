<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useUsersMembersStore } from 'src/stores/users-store';
import { DataUserByCounter } from 'src/ts/interfaces/data/User';
import { Notify } from 'quasar';

defineOptions({
  name: 'FormManageUsers',
});

const props = defineProps<{
  open: boolean;
  id: string | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const {
  getUsersMembersByEnterprise,
  deleteUserMemberByEnterprise,
  createUserMemberByCounter,
  findUser,
  updateUserMemberByCounter,
} = useUsersMembersStore();
const { loadingUsersMembers, listUserMemberByEnterprise, settingsCounter } =
  storeToRefs(useUsersMembersStore());

const dataUser = reactive<DataUserByCounter>({
  name: '',
  position: 'admin',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const mode = ref<'list' | 'form'>('list');
const dataEditId = ref<string | null>(null);
const filterUser = ref<string>('');
const columnsUser = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'position',
    label: 'Cargo',
    field: 'position',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

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
  if (dataUser.phone && dataUser.phone.trim() !== '') {
    if (!/^\+?[1-9]\d{1,14}$/.test(dataUser.phone!.trim())) {
      return { status: false, message: 'Digite um telefone válido' };
    }
  }
  if (dataEditId.value === null) {
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
  mode.value = 'list';
  filterUser.value = '';
  dataEditId.value = null;
  Object.assign(dataUser, {
    name: '',
    position: 'admin',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
};
const fetchUsers = async () => {
  await getUsersMembersByEnterprise(props.id ?? '');
};
const exclude = async (userId: string) => {
  await deleteUserMemberByEnterprise(userId);
};
const changeMode = (view: 'list' | 'form', data: string | null) => {
  dataEditId.value = data;
  mode.value = view;
  if (view === 'list') {
    clear();
  }
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    await createUserMemberByCounter(
      dataUser.name,
      dataUser.email,
      dataUser.password,
      dataUser.phone?.trim() !== '' ? dataUser.phone : null,
      props.id ?? ''
    );

    clear();
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
    await updateUserMemberByCounter(
      dataEditId.value ?? '',
      dataUser.name,
      dataUser.email,
      dataUser.phone?.trim() !== '' ? dataUser.phone : null
    );

    clear();
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};

watch(dataEditId, async () => {
  if (dataEditId.value) {
    const response = await findUser(dataEditId.value);
    if (response?.status === 200) {
      Object.assign(dataUser, {
        name: response.data.user.name,
        position: 'admin',
        email: response.data.user.email,
        phone: response.data.user.phone,
      });
    } else {
      mode.value = 'list';
      clear();
    }
  }
});
watch(open, async () => {
  if (open.value) {
    clear();
    await fetchUsers();
  }
});
</script>
<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="bg-grey-2"
      :style="
        mode === 'form' ? 'width: 600px; max-width:98vw' : 'min-width: 98vw'
      "
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Gerenciamento de usuários" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          v-if="mode === 'list'"
          :rows="loadingUsersMembers ? [] : listUserMemberByEnterprise"
          :columns="columnsUser"
          :filter="filterUser"
          :loading="loadingUsersMembers"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum usuário para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
        >
          <template v-slot:top>
            <div :class="!$q.screen.lt.md ? '' : 'column full-width'">
              <span class="text-subtitle2">Lista de usuários</span>
              <q-space />
              <div :class="!$q.screen.lt.md ? '' : 'column q-mt-sm '">
                <q-btn
                  @click="changeMode('form', null)"
                  v-show="settingsCounter?.allow_add_user"
                  label="Adicionar usuário"
                  icon-right="group_add"
                  unelevated
                  flat
                  no-caps
                  :class="!$q.screen.lt.md ? 'q-mr-md' : 'q-mt-sm '"
                />
                <q-input
                  v-show="listUserMemberByEnterprise.length > 0"
                  v-model="filterUser"
                  filled
                  dense
                  label="Pesquisar"
                  :class="!$q.screen.lt.md ? '' : 'q-mt-sm'"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                {{ props.row.email }}
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                {{ props.row.phone ?? 'Não definido' }}
              </q-td>
              <q-td key="position" :props="props" class="text-left">
                {{
                  props.row.position === 'admin'
                    ? 'Administrador'
                    : 'Usuário comum'
                }}
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="changeMode('form', props.row.id)"
                  v-show="settingsCounter?.allow_edit_user"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="exclude(props.row.id)"
                  v-show="
                    settingsCounter?.allow_delete_user &&
                    listUserMemberByEnterprise.length > 1
                  "
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <q-form v-else class="q-gutter-y-sm">
          <q-banner dense inline-actions class="text-white bg-red" rounded>
            Todos os usuários cadastrados por meio desse formulário, serão
            inseridos como administradores.
          </q-banner>
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
          <q-input
            v-model="dataUser.phone"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o telefone do usuário"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="call" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-show="dataEditId === null"
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
            v-show="dataEditId === null"
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
            @click="open = false"
            unelevated
            no-caps
            :flat="mode !== 'list'"
          />
          <q-btn
            v-show="mode === 'form'"
            color="red"
            label="Voltar"
            size="md"
            @click="changeMode('list', null)"
            unelevated
            no-caps
          />
          <q-btn
            v-if="dataEditId === null"
            @click="save"
            v-show="mode === 'form'"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            v-show="mode === 'form'"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingUsersMembers"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
