<script setup lang="ts">
import {
  checkActivePreRegistration,
  createPreRegistrationService,
} from 'src/services/member-service';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import TitleAuth from 'src/components/shared/TitleAuth.vue';
import { Notify } from 'quasar';

defineOptions({
  name: 'PreRegistration',
});

const route = useRoute();

const loading = ref<boolean>(false);
const activeFormPreRegistration = ref<boolean>(false);
const memberName = ref<string>('');
const kinship = ref<string>('');
const data = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  description: '',
  relations: [] as { member: string; kinship: string }[],
});
const columnsPreRegistration = reactive<QuasarTable[]>([
  {
    name: 'member',
    label: 'Membro',
    field: 'member',
    align: 'left',
    sortable: true,
  },
  {
    name: 'relationship',
    label: 'Parentesco',
    field: 'relationship',
    align: 'left',
    sortable: true,
  },
]);

const checkActive = async () => {
  const enterpriseId = Array.isArray(route.query.enterprise_id)
    ? route.query.enterprise_id[0]
    : route.query.enterprise_id;

  if (!enterpriseId) return;

  const response = await checkActivePreRegistration(enterpriseId);
  if (response.status === 200) {
    activeFormPreRegistration.value = response.data.active;
  }
};
const addRelation = () => {
  if (memberName.value.trim() === '' || kinship.value.trim() === '') {
    return;
  }
  data.value.relations.push({
    member: memberName.value,
    kinship: kinship.value,
  });
  memberName.value = '';
  kinship.value = '';
};
const send = async () => {
  try {
    const enterpriseId =
      typeof route.query.enterprise_id === 'string'
        ? route.query.enterprise_id
        : Array.isArray(route.query.enterprise_id)
        ? route.query.enterprise_id[0]
        : '';

    const response = await createPreRegistrationService({
      enterprise_id: enterpriseId ?? '',
      name: data.value.name,
      email: data.value.email,
      phone: data.value.phone,
      role: data.value.role,
      description:
        data.value.description.trim() === '' ? null : data.value.description,
      relationship:
        data.value.relations.length > 0 ? data.value.relations : null,
    });

    if(response.status === 200) {
      data.value.name = '';
      data.value.email = '';
      data.value.phone = '';
      data.value.role = '';
      data.value.description = '';
      data.value.relations = [];
      memberName.value = '';
      kinship.value = '';

      Notify.create({
        type: 'positive',
        message: 'Pré-registro enviado com sucesso',
      })

    }


  } catch (error: any) {
    Notify.create({
      type: 'negative',
      message:
        error?.response?.data?.message ||
        'Erro ao enviar o pré-registro',
    });
  }
};


const formattedPhone = computed({
  get() {
    const phone = data.value.phone.replace(/\D/g, '');
    if (phone.length === 10) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
    }
    if (phone.length === 11) {
      return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
    }
    return phone;
  },
  set(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) {
      return;
    }
    data.value.phone = digits;
  },
});
const allowAdd = computed(() => {
  return memberName.value.trim() !== '' && kinship.value.trim() !== '';
});
const allowSend = computed(() => {
  return (
    data.value.name.trim() !== '' &&
    data.value.email.trim() !== '' &&
    data.value.phone.trim() !== ''
  );
});

onMounted(async () => {
  loading.value = true;
  await checkActive();
  loading.value = false;
});
</script>
<template>
  <section
    class="container-view row justify-center items-center background-auth"
  >
    <q-form
      v-if="!loading && activeFormPreRegistration"
      class="form-auth rounded-borders bg-grey-3 overflow-hidden"
      style="width: 100%; max-width: 500px"
    >
      <div class="column items-center q-pa-md">
        <q-img src="/images/logo.png" spinner-color="white" width="300px" />
        <div class="full-width q-mt-sm">
          <TitleAuth title="Ingresse como membro" />
        </div>
      </div>

      <div class="scroll q-px-md q-gutter-y-sm" style="max-height: 60vh">
        <q-input
          v-model="data.name"
          bg-color="white"
          label-color="black"
          filled
          label="Digite seu nome"
          autocomplete="new-name"
          dense
          input-class="text-black"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="black" size="20px" />
          </template>
        </q-input>

        <q-input
          v-model="data.email"
          bg-color="white"
          label-color="black"
          filled
          label="Digite seu e-mail"
          autocomplete="new-email"
          dense
          input-class="text-black"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="black" size="20px" />
          </template>
        </q-input>

        <q-input
          v-model="formattedPhone"
          bg-color="white"
          label-color="black"
          filled
          label="Telefone da organização"
          dense
          input-class="text-black"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="call" color="black" size="20px" />
          </template>
        </q-input>

        <q-input
          v-model="data.role"
          bg-color="white"
          label-color="black"
          filled
          label="Digite seu cargo"
          autocomplete="new-role"
          dense
          input-class="text-black"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="arrow_right" color="black" size="20px" />
          </template>
        </q-input>

        <q-input
          v-model="data.description"
          bg-color="white"
          label-color="black"
          filled
          label="Digite uma descrição"
          dense
          input-class="text-black no-resize"
          type="textarea"
          rows="3"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="description" color="black" size="20px" />
          </template>
        </q-input>

        <div class="row q-col-gutter-x-sm">
          <div class="col-6">
            <q-input
              v-model="memberName"
              bg-color="white"
              label-color="black"
              outlined
              label="Membro"
              dense
              input-class="text-black"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="black" size="20px" />
              </template>
            </q-input>
          </div>
          <div class="col-6">
            <q-input
              v-model="kinship"
              bg-color="white"
              label-color="black"
              outlined
              label="Parentesco"
              dense
              input-class="text-black"
              :disable="loading"
            >
              <template v-slot:prepend>
                <q-icon name="people" color="black" size="20px" />
              </template>
            </q-input>
          </div>
        </div>

        <q-btn
          @click="addRelation"
          color="green"
          label="Adicionar"
          class="full-width"
          unelevated
          no-caps
          :disable="loading || !allowAdd"
        />

        <div class="q-my-sm">
          <q-table
            :rows="data.relations"
            :columns="columnsPreRegistration"
            flat
            bordered
            dense
            row-key="index"
            no-data-label="Nenhuma relação para mostrar"
            :rows-per-page-options="[0]"
            :loading="loading"
          >
            <template v-slot:header="props">
              <q-tr :props="props" class="bg-grey-2">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  <span style="font-size: 13px">{{ col.label }}</span>
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="member" :props="props" class="text-left">
                  {{ props.row.member }}
                </q-td>
                <q-td key="relationship" :props="props" class="text-left">
                  {{ props.row.kinship }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>

      <div
        class="q-pa-md row justify-end items-center q-gutter-x-sm border-top-grey"
      >
        <q-btn
          @click="send"
          color="primary"
          label="Enviar"
          size="md"
          unelevated
          no-caps
          class="px-lg full-width"
          :disable="loading || !allowSend"
        />
      </div>
    </q-form>
    <q-banner
      dense
      inline-actions
      rounded
      v-else-if="!loading && !activeFormPreRegistration"
      style="max-width: 90vw"
      class="text-center"
    >
      <span class="text-h4 text-red"
        >O formulário de pré-registro não está ativo no momento</span
      >
    </q-banner>
    <q-inner-loading
      :showing="loading"
      label="Carregando os dados..."
      label-class="black"
      label-style="font-size: 1.1em"
      color="primary"
      size="50px"
    />
  </section>
</template>

<style scoped>
.scroll {
  overflow-y: auto;
}

.overflow-hidden {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.border-top-grey {
  border-top: 1px solid #e0e0e0;
}
</style>
