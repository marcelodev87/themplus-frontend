<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from 'src/stores/subscription-store';
import { ICreditCardData } from 'src/ts/interfaces/data/Subscription';
import { Notify } from 'quasar';
import echo from 'src/plugins/echo';
import { useUsersMembersStore } from 'src/stores/users-store';
import FormCreditCard from '../forms/FormCreditCard.vue';
import QrCodePix from '../general/QrCodePix.vue';

defineOptions({
  name: 'SubscriptionStepper',
});

const props = defineProps<{
  subscriptionId: string | null;
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingSubscription } = storeToRefs(useSubscriptionStore());

const step = ref<number>(1);
const type = ref<'credit' | 'pix' | null>(null);
const dataPaymentCreditCard = reactive({
  subscriptionID: props.subscriptionId,
  creditCard: {
    holderName: '' as string,
    number: '' as string,
    expiryMonth: '' as string,
    expiryYear: '' as string,
    ccv: '' as string,
  },
  creditCardHolderInfo: {
    name: '' as string,
    email: '' as string,
    cpfCnpj: '' as string,
    postalCode: '' as string,
    addressNumber: '' as string,
    addressComplement: '' as string,
    phone: '' as string,
  },
});

const checkData = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (dataPaymentCreditCard.subscriptionID === '') {
    return { status: false, message: 'Deve ser informado o ID da assinatura' };
  }
  if (dataPaymentCreditCard.creditCard.holderName.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome impresso no cartão de crédito',
    };
  }
  if (dataPaymentCreditCard.creditCard.holderName.trim().length < 3) {
    return {
      status: false,
      message: 'O nome impresso no cartão deve ser válido',
    };
  }
  if (dataPaymentCreditCard.creditCard.holderName.trim().length > 30) {
    return {
      status: false,
      message: 'O nome impresso no cartão não pode ultrapassar 30 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCard.number.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número do cartão de crédito',
    };
  }
  if (dataPaymentCreditCard.creditCard.number.trim().length < 16) {
    return { status: false, message: 'Informe um número de cartão válido' };
  }
  if (dataPaymentCreditCard.creditCard.number.trim().length > 16) {
    return {
      status: false,
      message: 'O número do cartão não pode ultrapassar 16 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCard.expiryMonth.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o mês de vencimento do cartão de crédito',
    };
  }
  if (dataPaymentCreditCard.creditCard.expiryMonth.trim().length < 2) {
    return {
      status: false,
      message: 'O mês de vencimento do cartão deve conter 2 dígitos',
    };
  }
  if (dataPaymentCreditCard.creditCard.expiryMonth.trim().length > 2) {
    return {
      status: false,
      message: 'O mês de vencimento do cartão não pode ultrapassar 2 dígitos',
    };
  }
  if (
    Number(dataPaymentCreditCard.creditCard.expiryMonth.trim()) < 1 ||
    Number(dataPaymentCreditCard.creditCard.expiryMonth.trim()) > 12
  ) {
    return {
      status: false,
      message: 'O mês de vencimento do cartão não é válido',
    };
  }
  if (dataPaymentCreditCard.creditCard.expiryYear.trim().length < 4) {
    return {
      status: false,
      message: 'O ano de vencimento do cartão deve conter 4 dígitos',
    };
  }
  if (dataPaymentCreditCard.creditCard.expiryYear.trim().length > 4) {
    return {
      status: false,
      message: 'O ano de vencimento do cartão não pode ultrapassar 4 dígitos',
    };
  }
  if (
    Number(dataPaymentCreditCard.creditCard.expiryYear.trim()) < currentYear
  ) {
    return {
      status: false,
      message: 'O ano de vencimento não pode ser menor que o ano atual',
    };
  }
  if (
    Number(dataPaymentCreditCard.creditCard.expiryYear.trim()) < currentYear ||
    (Number(dataPaymentCreditCard.creditCard.expiryYear.trim()) ===
      currentYear &&
      Number(dataPaymentCreditCard.creditCard.expiryMonth.trim()) <=
        currentMonth)
  ) {
    return { status: false, message: 'O cartão informado está vencido' };
  }

  if (dataPaymentCreditCard.creditCard.ccv.trim() === '') {
    return { status: false, message: 'Deve ser informado o CCV/CVC do cartão' };
  }
  if (
    dataPaymentCreditCard.creditCard.ccv.trim().length < 3 ||
    dataPaymentCreditCard.creditCard.ccv.trim().length > 3
  ) {
    return { status: false, message: 'Informado um CCV/CVC válido' };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome do titular do cartão',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.name.trim().length < 3) {
    return { status: false, message: 'Informe um nome válido' };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.name.trim().length > 100) {
    return {
      status: false,
      message:
        'O nome do titular do cartão não pode ultrapassar 100 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.email.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o email do titular do cartão',
    };
  }
  if (
    !emailRegex.test(dataPaymentCreditCard.creditCardHolderInfo.email.trim())
  ) {
    return { status: false, message: 'O e-mail não é válido' };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.email.trim().length > 100) {
    return {
      status: false,
      message: 'O email impresso no cartão não pode ultrapassar 100 caracteres',
    };
  }
  if (
    (dataPaymentCreditCard.creditCardHolderInfo.cpfCnpj.trim().length < 14 &&
      dataPaymentCreditCard.creditCardHolderInfo.cpfCnpj.trim().length < 11) ||
    dataPaymentCreditCard.creditCardHolderInfo.cpfCnpj.trim().length === 12 ||
    dataPaymentCreditCard.creditCardHolderInfo.cpfCnpj.trim().length === 13 ||
    dataPaymentCreditCard.creditCardHolderInfo.cpfCnpj.trim().length > 14
  ) {
    return { status: false, message: 'Digite um CPF ou CNPJ válido' };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.postalCode.trim() === '') {
    return { status: false, message: 'Deve ser informado o cep' };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.postalCode.trim().length < 8) {
    return {
      status: false,
      message: 'O cep informado não pode ter menos de 8 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.postalCode.trim().length > 8) {
    return {
      status: false,
      message: 'O cep informado não pode ter mais de 8 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.addressNumber.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número de endereço do titular do cartão',
    };
  }
  if (
    dataPaymentCreditCard.creditCardHolderInfo.addressNumber.trim().length > 16
  ) {
    return {
      status: false,
      message:
        'O número de endereço informado não pode ultrapassar 16 caracteres',
    };
  }
  if (
    (dataPaymentCreditCard.creditCardHolderInfo.addressComplement?.trim() ?? '')
      .length > 100
  ) {
    return {
      status: false,
      message: 'O complemento informado não pode ultrapassar 100 caracteres',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.phone.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o número de telefone do titular do cartão',
    };
  }
  if (dataPaymentCreditCard.creditCardHolderInfo.phone.trim().length < 11) {
    return { status: false, message: 'Insira um número de telefone válido' };
  }

  return { status: true };
};
const sendDataCreditCard = async (dataCreditCard: ICreditCardData) => {
  const check = checkData();
  if (check.status) {
    const response =
      await useSubscriptionStore().creditCardPayment(dataCreditCard);
    if (response?.status === 200) {
      step.value = 3;
      await useUsersMembersStore().getProfile();
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const close = () => {
  step.value = 1;
  type.value = null;
  Object.assign(dataPaymentCreditCard, {
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
  });
  emit('update:open');
};
const changeType = (sendType: 'pix' | 'credit') => {
  type.value = sendType;
  step.value = 2;
};
const back = () => {
  type.value = null;
  step.value = 1;
  Object.assign(dataPaymentCreditCard, {
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
  });
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const stepTitle = computed(() => {
  if (type.value === 'credit') return 'Formulário do cartão de crédito';
  if (type.value === 'pix') return 'Escaneie o QRCode ou copie e cole';
  return '';
});

watch(
  () => props.subscriptionId,
  (id) => {
    dataPaymentCreditCard.subscriptionID = id;
  },
  { immediate: true }
);

onMounted(() => {
  echo.channel('payments').listen('.payment.made', async () => {
    useSubscriptionStore().setLoading(false);
    step.value = 3;
    await useUsersMembersStore().getProfile();
  });
});

onUnmounted(() => {
  echo.leaveChannel('payments');
});
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="q-bg-grey-2 form-basic sub-page">
      <q-card-section>
        <q-stepper
          v-model="step"
          color="red-10"
          flat
          animated
          bordered
          alternative-labels
        >
          <q-step
            :name="1"
            title="Informe a forma de pagamento"
            icon="attach_money"
            color="red-10"
            :done="step > 1"
          >
            <div class="row items-center q-gutter-sm">
              <q-separator class="col" />
              <span
                class="text-h5 text-bold text-weight-light"
                style="color: #660000"
              >
                Selecione a forma do pagamento
              </span>
              <q-separator class="col" />
            </div>
            <q-stepper-navigation align="right">
              <div class="row justify-center items-center q-gutter-x-sm">
                <q-btn
                  label="Cartão de crédito"
                  color="primary"
                  unelevated
                  no-caps
                  icon="credit_card"
                  @click="changeType('credit')"
                />
                <q-btn
                  label="Gerar QR Code PIX"
                  color="teal-6"
                  unelevated
                  no-caps
                  icon="qr_code_2"
                  @click="changeType('pix')"
                />
              </div>
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="2"
            :title="stepTitle"
            icon="attach_money"
            color="red-10"
            :done="step > 2"
          >
            <div
              v-show="loadingSubscription"
              class="flex justify-center q-pa-xl q-ma-xl"
            >
              <q-inner-loading
                :showing="loadingSubscription"
                label="Carregando os dados..."
                label-class="black"
                label-style="font-size: 1.1em"
                color="primary"
                size="50px"
              />
            </div>
            <div v-show="!loadingSubscription">
              <div v-if="type === 'credit'">
                <FormCreditCard v-model="dataPaymentCreditCard" />
              </div>
              <div v-else>
                <QrCodePix :subscriptionID="props.subscriptionId" />
              </div>
            </div>
            <q-stepper-navigation align="right">
              <q-btn
                label="Fechar"
                @click="close"
                class="q-mr-sm"
                color="red"
                :loading="loadingSubscription"
                flat
                no-caps
              />
              <q-btn
                label="Voltar"
                @click="back"
                class="q-mr-sm"
                color="primary"
                :loading="loadingSubscription"
                outline
                no-caps
              />
              <q-btn
                v-if="type === 'credit'"
                label="Efetuar pagamento"
                color="green-7"
                @click="sendDataCreditCard(dataPaymentCreditCard)"
                :loading="loadingSubscription"
                unelevated
                no-caps
              />
            </q-stepper-navigation>
          </q-step>
          <q-step
            :name="3"
            title="Pagamento aprovado"
            icon="attach_money"
            color="red-10"
            :done="step > 3"
          >
            <div class="flex justify-center q-mb-md">
              <q-img
                src="/icons/check.png"
                style="height: 100px; width: 100px"
              />
            </div>
            <div class="flex justify-center">
              <span class="text-weight-bolder text-teal-6 text-h4"
                >Assinatura renovada com sucesso!</span
              >
              <span
                class="text-weight-bolder text-teal-6 text-subtitle2 text-center"
                >Seu pagamento foi confirmado e o acesso continua
                liberado!</span
              >
            </div>
            <q-stepper-navigation align="right">
              <q-btn
                label="Fechar"
                @click="close"
                class="q-mr-sm"
                color="red"
                flat
                no-caps
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
