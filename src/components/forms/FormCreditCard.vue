<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { computed, reactive, watch, ref } from 'vue';
import { searchCep } from 'src/services/cep-service';
import { ICreditCardData } from 'src/ts/interfaces/data/Subscription';

defineOptions({
  name: 'FormCreditCard',
});

const loading = ref<boolean>(false);
const allowSearchCep = ref<boolean>(false);
const model = defineModel<ICreditCardData>({
  default: () => ({
    creditCard: {
      holderName: '',
      number: '',
      expiryMonth: '',
      expiryYear: '',
      ccv: '',
    },
    creditCardHolderInfo: {
      name: '',
      email: '',
      cpfCnpj: '',
      postalCode: '',
      addressNumber: '',
      addressComplement: '',
      phone: '',
    },
  }),
});
const readonlyData = reactive({
  neighborhood: '',
  state: '',
  city: '',
  address: '',
});

const formattedPhone = computed({
  get() {
    const phone = (model.value.creditCardHolderInfo.phone || '').replace(
      /\D/g,
      ''
    );

    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = (value || '').replace(/\D/g, '');

    if (digits.length > 11) {
      return;
    }

    model.value.creditCardHolderInfo.phone = digits;
  },
});
watch(
  () => model.value.creditCardHolderInfo.postalCode,
  async () => {
    model.value.creditCardHolderInfo.postalCode =
      model.value.creditCardHolderInfo.postalCode.replace(/\D/g, '');
    if (allowSearchCep.value) {
      if (model.value.creditCardHolderInfo.postalCode.trim().length === 8) {
        loading.value = true;
        const response = await searchCep(
          model.value.creditCardHolderInfo.postalCode
        );
        if (response.status === 200) {
          readonlyData.neighborhood = response.data.bairro;
          readonlyData.state = response.data.estado;
          readonlyData.city = response.data.localidade;
          readonlyData.address = response.data.logradouro;
        }
      } else {
        readonlyData.neighborhood = '';
        readonlyData.state = '';
        readonlyData.city = '';
        readonlyData.address = '';
      }
    } else {
      allowSearchCep.value = true;
    }
    loading.value = false;
  }
);
</script>

<template>
  <section>
    <q-form class="q-gutter-y-xs column flex justify-center">
      <div>
        <TitlePage
          title="Informações do cartão de crédito"
          icon="credit_card"
        />
      </div>
      <q-input
        label="Nome"
        v-model="model.creditCard.holderName"
        class="bg-white"
        label-color="black"
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-icon name="fa-solid fa-id-badge" color="black" />
        </template>
      </q-input>
      <q-input
        label="Número do cartão"
        v-model="model.creditCard.number"
        class="bg-white"
        label-color="black"
        outlined
        dense
        maxlength="16"
      >
        <template v-slot:prepend>
          <q-icon name="pin" color="black" />
        </template>
      </q-input>
      <div class="row q-gutter-x-sm">
        <q-input
          label="Mês de vencimento"
          maxlength="2"
          mask="##"
          v-model="model.creditCard.expiryMonth"
          class="bg-white input-3-divider"
          label-color="black"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="calendar_month" color="black" />
          </template>
        </q-input>
        <q-input
          label="Ano de vencimento"
          maxlength="4"
          mask="####"
          v-model="model.creditCard.expiryYear"
          class="bg-white input-3-divider"
          label-color="black"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="calendar_month" color="black" />
          </template>
        </q-input>
        <q-input
          label="CCV/CVC"
          maxlength="3"
          mask="###"
          v-model="model.creditCard.ccv"
          class="bg-white input-3-divider"
          label-color="black"
          outlined
          dense
        />
      </div>
      <div class="q-mt-md">
        <TitlePage
          title="Informações do titular do cartão de crédito"
          icon="person"
        />
      </div>
      <q-input
        label="Nome"
        v-model="model.creditCardHolderInfo.name"
        class="bg-white"
        label-color="black"
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-icon name="badge" color="black" />
        </template>
      </q-input>
      <q-input
        label="Email"
        v-model="model.creditCardHolderInfo.email"
        class="bg-white"
        label-color="black"
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-icon name="badge" color="black" />
        </template>
      </q-input>
      <div class="row justify-between">
        <q-input
          label="CPF/CNPJ"
          maxlength="14"
          mask="##############"
          v-model="model.creditCardHolderInfo.cpfCnpj"
          class="bg-white input-divider"
          label-color="black"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="assignment_ind" color="black" />
          </template>
        </q-input>
        <q-input
          label="CEP"
          maxlength="8"
          mask="########"
          v-model="model.creditCardHolderInfo.postalCode"
          class="bg-white input-divider"
          label-color="black"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="location_on" color="black" />
          </template>
        </q-input>
      </div>
      <div class="row justify-between">
        <q-input
          v-model="readonlyData.state"
          bg-color="white"
          label-color="black"
          outlined
          label="UF"
          dense
          input-class="text-black"
          class="input-divider"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="map" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="readonlyData.city"
          bg-color="white"
          label-color="black"
          outlined
          label="Cidade"
          dense
          input-class="text-black"
          class="input-divider"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
        </q-input>
      </div>
      <div class="row justify-between">
        <q-input
          v-model="readonlyData.neighborhood"
          bg-color="white"
          label-color="black"
          outlined
          label="Bairro"
          dense
          input-class="text-black"
          class="input-divider"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
        </q-input>
        <q-input
          v-model="readonlyData.address"
          bg-color="white"
          label-color="black"
          outlined
          label="Logradouro"
          dense
          input-class="text-black"
          class="input-divider"
          disable
        >
          <template v-slot:prepend>
            <q-icon name="pin_drop" color="black" size="20px" />
          </template>
        </q-input>
      </div>
      <div class="row justify-between">
        <q-input
          label="Número do endereço"
          v-model="model.creditCardHolderInfo.addressNumber"
          class="bg-white input-divider"
          label-color="black"
          maxlength="15"
          mask="###############"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="tag" color="black" />
          </template>
        </q-input>
        <q-input
          label="Complemento do endereço"
          v-model="model.creditCardHolderInfo.addressComplement"
          class="bg-white input-divider"
          label-color="black"
          outlined
          dense
        >
          <template v-slot:prepend>
            <q-icon name="tag" color="black" />
          </template>
        </q-input>
      </div>
      <q-input
        label="Telefone(com DDD)"
        v-model="formattedPhone"
        class="bg-white"
        label-color="black"
        outlined
        dense
      >
        <template v-slot:prepend>
          <q-icon name="phone_enabled" color="black" />
        </template>
      </q-input>
    </q-form>
  </section>
</template>
