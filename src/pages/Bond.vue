<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import AlertDataEnterprise from 'src/components/shared/AlertDataEnterprise.vue';
import { Alert } from 'src/ts/interfaces/data/Alert';
import { useOrderStore } from 'src/stores/order-store';
import ConfirmAction from 'src/components/confirm/ConfirmAction.vue';
import DataClient from 'src/components/general/DataClient.vue';
import AlertsClient from 'src/components/general/AlertsClient.vue';
import FormManageUsers from 'src/components/forms/FormManageUsers.vue';
import FormCodeFinancial from 'src/components/forms/FormCodeFinancial.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter, useRoute } from 'vue-router';
import { deleteEnterpriseService } from 'src/services/enterprise-service';
import { Dialog } from 'quasar';

defineOptions({
  name: 'Bond',
});

const { loadingOrder, listBond, filledData } = storeToRefs(useOrderStore());
const { getBonds, deleteBond } = useOrderStore();
const { user } = useAuthStore();

const router = useRouter();
const route = useRoute();
const showAlertDataEnterprise = ref<boolean>(false);
const showFormCodeFinancial = ref<boolean>(false);
const showFormManageUsers = ref<boolean>(false);
const showAlertsClient = ref<boolean>(false);
const filterOrder = ref<string>('');
const selectedDataEdit = ref<Alert | null>(null);
const showConfirmAction = ref<boolean>(false);
const showDataClient = ref<boolean>(false);
const dataClient = ref<string | null>(null);
const dataManage = ref<string | null>(null);
const dataBond = ref<string | null>(null);
const dataEnterpriseId = ref<string | null>(null);
const dataEnterpriseName = ref<string | null>(null);
const dataEnterpriseCode = ref<number | null>(null);
const columnsBond = reactive<QuasarTable[]>([
  {
    name: 'code_financial',
    label: 'Código Interno',
    field: 'code_financial',
    align: 'left',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cnpj',
    label: 'CNPJ',
    field: 'cnpj',
    align: 'left',
  },
  {
    name: 'cpf',
    label: 'CPF',
    field: 'cpf',
    align: 'left',
  },
  {
    name: 'no_verified',
    label: 'Entregas não analisadas',
    field: 'no_verified',
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
  selectedDataEdit.value = null;
  filterOrder.value = '';
  dataBond.value = null;
  dataClient.value = null;
  dataEnterpriseId.value = null;
  dataEnterpriseName.value = null;
  dataEnterpriseCode.value = null;
};
const fetchBonds = async () => {
  await getBonds();
};
const closeAlertDataEnterprise = (): void => {
  showAlertDataEnterprise.value = false;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await deleteBond(dataBond.value ?? '');
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
};
const openConfirmAction = (orderId: string): void => {
  dataBond.value = orderId;
  showConfirmAction.value = true;
};
const openDataClient = (id: string) => {
  const routeData = router.resolve({
    name: 'admin-bond-with-id',
    params: { id },
  });

  window.open(routeData.href, '_blank');
};
const closeDataClient = () => {
  clear();
  showDataClient.value = false;
  window.close();
};
const openFormManageUsers = (enterpriseId: string): void => {
  dataManage.value = enterpriseId;
  showFormManageUsers.value = true;
};
const closeFormManageUsers = (): void => {
  showFormManageUsers.value = false;
  dataManage.value = null;
};
const openFormCodeFinancial = (
  enterpriseId: string,
  enterpriseName: string,
  enterpriseCode: number | null
): void => {
  dataEnterpriseId.value = enterpriseId;
  dataEnterpriseName.value = enterpriseName;
  dataEnterpriseCode.value = enterpriseCode;
  showFormCodeFinancial.value = true;
};
const closeFormCodeFinancial = (): void => {
  showFormCodeFinancial.value = false;
  dataEnterpriseId.value = null;
  dataEnterpriseName.value = null;
  dataEnterpriseCode.value = null;
};
const openAlertsClient = (enterpriseId: string): void => {
  dataManage.value = enterpriseId;
  showAlertsClient.value = true;
};
const closeAlertsClient = (): void => {
  showAlertsClient.value = false;
  dataManage.value = null;
};
const deleteEnterpriseSystem = (id: string) => {
  Dialog.create({
    title: 'Confirmação',
    message: 'Você tem certeza que deseja apagar a organização do sistema?',
    persistent: true,
    ok: { label: 'Sim' },
    cancel: { label: 'Não', color: 'red' },
  })
    .onOk(async () => {
      loadingOrder.value = true;
      const response = await deleteEnterpriseService(id);
      if (response.status === 200) {
        listBond.value = listBond.value.filter((item) => item.id !== id);
      }
      loadingOrder.value = false;
    })
    .onCancel(() => {
      console.log('Operação cancelada pelo usuário.');
    });
};

watch(
  filledData,
  () => {
    if (!filledData.value) {
      showAlertDataEnterprise.value = true;
    }
  },
  { immediate: true }
);
watch(
  () => route,
  () => {
    if ('id' in route.params) {
      dataClient.value = Array.isArray(route.params.id)
        ? route.params.id[0]
        : route.params.id;
      showDataClient.value = true;
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await fetchBonds();
});
</script>
<template>
  <section>
    <header
      :class="
        !$q.screen.lt.sm
          ? 'row justify-between no-wrap bg-grey-1'
          : 'column justify-between no-wrap bg-grey-1'
      "
    >
      <div class="col-11">
        <TitlePage title="Gerenciamento de vínculos" />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          v-show="!showDataClient"
          :rows="loadingOrder ? [] : listBond"
          :columns="columnsBond"
          :filter="filterOrder"
          :loading="loadingOrder"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma vinculação para mostrar"
          virtual-scroll
          :rows-per-page-options="[20]"
        >
          <template v-slot:top>
            <span class="text-subtitle2">Lista de vínculos</span>
            <q-space />
            <q-input filled v-model="filterOrder" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="code_financial" :props="props" class="text-left">
                {{ props.row.code_financial }}
              </q-td>
              <q-td key="name" :props="props" class="text-left">
                {{ props.row.name }}
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                {{ props.row.cnpj }}
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                {{ props.row.cpf }}
              </q-td>
              <q-td key="no_verified" :props="props" class="text-left">
                <q-badge
                  rounded
                  :color="props.row.no_verified > 0 ? 'red' : 'green'"
                  :label="props.row.no_verified"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="
                    openFormCodeFinancial(
                      props.row.id,
                      props.row.name,
                      props.row.code_financial
                    )
                  "
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="key"
                >
                  <q-tooltip> Código interno </q-tooltip>
                </q-btn>
                <q-btn
                  @click="openAlertsClient(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="crisis_alert"
                >
                  <q-tooltip> Alertas </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.manage_users"
                  @click="openFormManageUsers(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="group"
                >
                  <q-tooltip> Usuários </q-tooltip>
                </q-btn>
                <q-btn
                  @click="openDataClient(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="visibility"
                >
                  <q-tooltip> Analisar </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="props.row.created_by === null"
                  @click="openConfirmAction(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
                <q-btn
                  v-show="user?.email === 'marcelo.dias@etikasolucoes.com.br'"
                  @click="deleteEnterpriseSystem(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="cancel"
                >
                  <q-tooltip>Excluir do sistema</q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
        <DataClient
          :id-client="dataClient"
          :open="showDataClient"
          @update:open="closeDataClient"
        />
        <FormCodeFinancial
          :enterprise-id="dataEnterpriseId"
          :enterprise-name="dataEnterpriseName"
          :enterprise-code="dataEnterpriseCode"
          :open="showFormCodeFinancial"
          @update:open="closeFormCodeFinancial"
        />
        <FormManageUsers
          :open="showFormManageUsers"
          :id="dataManage"
          @update:open="closeFormManageUsers"
        />
        <AlertDataEnterprise
          :open="showAlertDataEnterprise"
          @update:open="closeAlertDataEnterprise"
        />
        <AlertsClient
          :open="showAlertsClient"
          :enterprise-id="dataManage"
          @update:open="closeAlertsClient"
        />
        <ConfirmAction
          :open="showConfirmAction"
          label-action="Continuar"
          title="Confirmação de desvínculo"
          message="Não poderá ter mais acesso aos dados do cliente, além das filiais serem removidas também, caso existam. Caso tenha certeza, clique em 'Continuar' para prosseguir."
          @update:open="closeConfirmAction"
          @update:ok="closeConfirmActionOk"
        />
      </main>
    </q-scroll-area>
  </section>
</template>
