<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { useAuthStore } from 'src/stores/auth-store';
import { useMemberStore } from 'src/stores/member-store';
import { PreRegistration } from 'src/ts/interfaces/data/Member';
import { Notify } from 'quasar';
import { updateConfigPreRegistration } from 'src/services/member-service';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import RelationshipDetails from '../info/RelationshipDetails.vue';

defineOptions({
  name: 'ManagePreRegistration',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'update:openByRegistration': [void];
  showFormMemberByRegistration: [PreRegistration];
}>();

const { listMemberPreRegistration, loadingMember } =
  storeToRefs(useMemberStore());
const { getPreRegistration, deleteRegistration, getConfigPreRegistration } =
  useMemberStore();
const { user } = storeToRefs(useAuthStore());

const loading = ref<boolean>(false);
const startMonitoringConfig = ref<boolean>(false);
const filter = ref<string>('');
const showRelationshipDetails = ref<boolean>(false);
const activeFormPreRegistration = ref<number>(1);
const selectedDataEdit = ref<PreRegistration | null>(null);
const showConfirmAction = ref<boolean>(false);
const columnsPreRegistration = reactive<QuasarTable[]>([
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left',
  },
  {
    name: 'phone',
    label: 'Telefone',
    field: 'phone',
    align: 'left',
  },
  {
    name: 'created_at',
    label: 'Data de registro',
    field: 'created_at',
    align: 'left',
  },
  {
    name: 'description',
    label: 'Descrição',
    field: 'description',
    align: 'left',
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'action',
    align: 'right',
  },
]);

const clear = (): void => {
  filter.value = '';
  selectedDataEdit.value = null;
  startMonitoringConfig.value = false;
  showRelationshipDetails.value = false;
};
const fetchPreRegistration = async () => {
  await getPreRegistration();
};
const fetchConfigPreRegistration = async () => {
  const response = await getConfigPreRegistration();
  if (response?.status === 200) {
    activeFormPreRegistration.value = response.data.config.active;
  }
};
const exclude = async (id: string) => {
  await deleteRegistration(id);
};
const handleApprove = (registration: PreRegistration) => {
  emit('showFormMemberByRegistration', registration);
  emit('update:openByRegistration');
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await exclude(selectedDataEdit.value?.id ?? '');
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  selectedDataEdit.value = null;
};
const openConfirmAction = async (data: PreRegistration): Promise<void> => {
  selectedDataEdit.value = data;
  showConfirmAction.value = true;
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const getLink = async (): Promise<void> => {
  const baseUrl = window.location.origin;
  const preRegistrationPath = '/pre-registration/form';

  if (!user.value?.view_enterprise_id) {
    console.warn('Enterprise ID não encontrado');
    return;
  }

  const fullLink = `${baseUrl}${preRegistrationPath}?enterprise_id=${user.value.view_enterprise_id}`;

  try {
    await navigator.clipboard.writeText(fullLink);
    Notify.create({
      message: 'Link copiado para a área de transferência',
      type: 'positive',
    });
  } catch (error) {
    console.error('Erro ao copiar o link', error);
  }
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('pt-BR', options).format(date);
};
const changeShowRelationshipDetails = (
  registration: PreRegistration | null = null
): void => {
  showRelationshipDetails.value = !showRelationshipDetails.value;
  selectedDataEdit.value = registration;
};

watch(activeFormPreRegistration, async () => {
  if (startMonitoringConfig.value) {
    loading.value = true;
    const reponse = await updateConfigPreRegistration({
      active: activeFormPreRegistration.value ? 1 : 0,
    });
    if (reponse?.status === 200) {
      Notify.create({
        message: reponse.data.message,
        type: 'positive',
      });
    }
    loading.value = false;
  }
});
watch(open, async () => {
  if (open.value) {
    loading.value = true;
    clear();
    await fetchConfigPreRegistration();
    await fetchPreRegistration();
    loading.value = false;
    startMonitoringConfig.value = true;
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2 form-basic"
      style="min-width: 98vw; max-width: 98vw"
    >
      <q-card-section class="q-pa-none">
        <header
          :class="
            !$q.screen.lt.sm
              ? 'row justify-between no-wrap bg-grey-1'
              : 'column justify-between no-wrap bg-grey-1'
          "
        >
          <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
            <TitlePage title="Gerenciamento de pré-registros" />
          </div>
        </header>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-toggle
          v-model="activeFormPreRegistration"
          :true-value="1"
          :false-value="0"
        >
          <span>
            Permitir que novos usuários preencham o formulário de
            <span class="text-bold">cadastro para inclusão de membros</span>
          </span>
        </q-toggle>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-table
          :rows="loadingMember ? [] : listMemberPreRegistration"
          :columns="columnsPreRegistration"
          :loading="loadingMember"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum registro para mostrar"
          virtual-scroll
          :rows-per-page-options="[0]"
          :filter="filter"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <div
              :class="!$q.screen.lt.md ? 'row full-width' : 'column full-width'"
            >
              <span class="text-subtitle2">Lista de registros</span>
              <q-space />
              <div v-if="!$q.screen.lt.sm" class="row">
                <q-input
                  filled
                  v-model="filter"
                  dense
                  label="Pesquisar"
                  :style="!$q.screen.lt.sm ? 'width: 200px' : 'width: 49%'"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-expansion-item
                v-else
                expand-separator
                icon="filter_alt"
                label="Filtros"
                class="border-form"
              >
                <q-input
                  filled
                  v-model="filter"
                  dense
                  label="Pesquisar"
                  class="full-width q-mt-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </q-expansion-item>
            </div>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="email" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.email }}</span>
              </q-td>
              <q-td key="phone" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.phone }}</span>
              </q-td>
              <q-td key="created_at" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  formatDate(props.row.created_at)
                }}</span>
              </q-td>
              <q-td key="description" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.description ?? ''
                }}</span>
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="changeShowRelationshipDetails(props.row)"
                  v-show="
                    props.row.relationships.length > 0 &&
                    user?.enterprise_id === user?.view_enterprise_id
                  "
                  size="sm"
                  flat
                  round
                  color="primary"
                  icon="group"
                />
                <q-btn
                  @click="handleApprove(props.row)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="edit"
                />
                <q-btn
                  @click="openConfirmAction(props.row)"
                  v-show="user?.enterprise_id === user?.view_enterprise_id"
                  size="sm"
                  flat
                  round
                  color="negative"
                  icon="delete"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            color="primary"
            label="Link"
            size="md"
            @click="getLink"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>

      <!-- Modals -->
      <ConfirmAction
        :open="showConfirmAction"
        label-action="Continuar"
        title="Confirmação de exclusão"
        message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
        @update:open="closeConfirmAction"
        @update:ok="closeConfirmActionOk"
      />
      <RelationshipDetails
        :open="showRelationshipDetails"
        :data="selectedDataEdit"
        @update:open="changeShowRelationshipDetails()"
      />
    </q-card>
  </q-dialog>
</template>
