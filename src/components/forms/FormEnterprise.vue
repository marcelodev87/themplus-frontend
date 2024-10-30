<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { DataEnterprise } from 'src/ts/interfaces/data/Enterprise';
import { searchCep } from 'src/services/cep-service';
import ConfirmEditEnterprise from '../confirm/ConfirmEditEnterprise.vue';

defineOptions({
  name: 'FormEnterprise',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selectedIdentifier = ref<string>('CPF');
const showConfirmEditEnterprise = ref<boolean>(false);
const cep = ref<string>('');
const loading = ref<boolean>(false);
const dataEnterprise = reactive<DataEnterprise>({
  name: '',
  email: '',
  cnpj: '',
  cpf: '',
  state: '',
  city: '',
  address: '',
  phone: '',
  numberAddress: '',
  complement: '',
  neighborhood: '',
  cep: '',
});
const optionsIdentifier = reactive<string[]>(['CNPJ', 'CPF']);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataEnterprise.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da organização',
    };
  }
  if (dataEnterprise.name.trim().length < 2) {
    return {
      status: false,
      message: 'Nome da organização deve ter mais de 2 caracteres',
    };
  }
  if (
    dataEnterprise.email.trim() !== '' &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      dataEnterprise.email.trim()
    )
  ) {
    return { status: false, message: 'Informe um e-mail válido' };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataEnterprise, {
    name: '',
    cnpj: '',
    cpf: '',
    state: '',
    city: '',
    address: '',
    email: '',
    phone: '',
    numberAddress: '',
    complement: '',
    neighborhood: '',
    cep: '',
  });
  cep.value = '';
};
const openConfirmEditEnterprise = (): void => {
  const check = checkData();
  if (check.status) {
    showConfirmEditEnterprise.value = true;
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const closeConfirmEditEnterprise = (): void => {
  showConfirmEditEnterprise.value = false;
};

watch(
  cep,
  async () => {
    if (cep.value.trim().length > 7) {
      loading.value = true;
      const response = await searchCep(cep.value);
      console.log('response ', response);
      loading.value = false;
    }
  },
  { immediate: true }
);

watch(open, () => {
  if (open.value) {
    clear();
    closeConfirmEditEnterprise();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card v-if="!showConfirmEditEnterprise" class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Dados da organização" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataEnterprise.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da organização"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.email"
            bg-color="white"
            label-color="black"
            filled
            label="E-mail da organização"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="mail" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.phone"
            bg-color="white"
            label-color="black"
            filled
            label="Telefone da organização"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="call" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-select
              v-model="selectedIdentifier"
              :options="optionsIdentifier"
              label="Selecione o documento"
              filled
              dense
              options-dense
              bg-color="white"
              label-color="black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="info" color="black" size="20px" />
              </template>
            </q-select>
            <q-input
              v-if="selectedIdentifier === 'CNPJ'"
              v-model="dataEnterprise.cnpj"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CNPJ"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-else
              v-model="dataEnterprise.cpf"
              bg-color="white"
              label-color="black"
              filled
              label="Digite o CPF"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="cep"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o CEP"
            dense
            input-class="text-black"
            :debounce="500"
            :loading="loading"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.state"
              bg-color="white"
              label-color="black"
              filled
              label="UF"
              dense
              input-class="text-black"
              class="input-divider"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="map" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEnterprise.city"
              bg-color="white"
              label-color="black"
              filled
              label="Cidade"
              dense
              input-class="text-black"
              class="input-divider"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="pin_drop" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <q-input
            v-model="dataEnterprise.neighborhood"
            bg-color="white"
            label-color="black"
            filled
            label="Bairro"
            dense
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataEnterprise.address"
            bg-color="white"
            label-color="black"
            filled
            label="Logradouro"
            dense
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="pin_drop" color="black" size="20px" />
            </template>
          </q-input>
          <div class="row justify-between">
            <q-input
              v-model="dataEnterprise.numberAddress"
              bg-color="white"
              label-color="black"
              filled
              label="Número"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
            <q-input
              v-model="dataEnterprise.complement"
              bg-color="white"
              label-color="black"
              filled
              label="Complemento"
              dense
              input-class="text-black"
              class="input-divider"
            >
              <template v-slot:prepend>
                <q-icon name="numbers" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <!-- <q-input
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
          </q-input> -->
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
            @click="openConfirmEditEnterprise"
            color="primary"
            label="Salvar"
            size="md"
            :loading="false"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
    <div v-else>
      <ConfirmEditEnterprise @update:open="closeConfirmEditEnterprise" />
    </div>
  </q-dialog>
</template>
