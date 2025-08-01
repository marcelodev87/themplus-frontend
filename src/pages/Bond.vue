<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { QuasarSelect, QuasarTable } from 'src/ts/interfaces/framework/Quasar';
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
import ManageCategory from 'src/components/general/ManageCategory.vue';
import { useEnterpriseStore } from 'src/stores/enterprise-store';
import { Bond } from 'src/ts/interfaces/data/Bond';
import Paginate from 'src/components/general/Paginate.vue';

defineOptions({
  name: 'Bond',
});

const { loadingOrder, listBond, filledData } = storeToRefs(useOrderStore());
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());
const { setViewEnterprise } = useEnterpriseStore();
const { getBonds, deleteBond } = useOrderStore();
const { user, enterprisePosition } = storeToRefs(useAuthStore());

const router = useRouter();
const route = useRoute();

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(12);
const showInspect = ref<boolean>(false);
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
const showCategoryPanel = ref<boolean>(false);
const listEnterpriseView = reactive<Bond[]>([]);

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
    style:
      'max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
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
const selectedVerified = ref<QuasarSelect<string>>({
  label: 'Todas as organizações',
  value: 'all',
});
const optionsVerified = reactive<QuasarSelect<string>[]>([
  {
    label: 'Todas as organizações',
    value: 'all',
  },
  {
    label: 'Com entrega',
    value: 'true',
  },
  {
    label: 'Sem entrega',
    value: 'false',
  },
]);

const resetPage = (): void => {
  currentPage.value = 1;
};
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
  await getBonds(selectedVerified.value.value);
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
const openCategoryPanel = (): void => {
  showCategoryPanel.value = true;
};
const closeCategoryPanel = (): void => {
  showCategoryPanel.value = false;
  clear();
};
const setView = async (entepriseId: string | null): Promise<void> => {
  const response = await setViewEnterprise(entepriseId);
  if (response?.status === 200) {
    listEnterpriseView.splice(0, listEnterpriseView.length);
    showInspect.value = false;
  }
};

const filteredBonds = computed(() => {
  const normalize = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const searchTerm = normalize(filterOrder.value);
  resetPage();

  return listBond.value.filter((item) => {
    return item.name && normalize(item.name).includes(searchTerm);
  });
});

const listBondCurrent = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredBonds.value.slice(start, end);
});
const maxPages = computed(() => {
  return Math.ceil(filteredBonds.value.length / rowsPerPage.value);
});

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
watch(
  showInspect,
  () => {
    listEnterpriseView.splice(0, listEnterpriseView.length);
    if (showInspect.value) {
      listBond.value.forEach((item) => {
        if (item.id === user.value?.view_enterprise_id) {
          listEnterpriseView.push(item);
        }
      });
    }
  },
  { immediate: true }
);
watch(selectedVerified, async () => {
  clear();
  await fetchBonds();
});

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
      <div :class="!$q.screen.lt.sm ? 'col-5' : 'col-12'">
        <TitlePage title="Gerenciamento de vínculos" />
      </div>
      <div
        class="col-6 row items-center justify-end q-gutter-x-sm"
        :class="!$q.screen.lt.sm ? '' : 'q-mb-sm'"
      >
        <q-btn
          @click="openCategoryPanel"
          icon-right="category"
          label="Painel de categorias"
          class="q-mr-sm bg-contabilidade"
          unelevated
          no-caps
        />
      </div>
    </header>
    <q-scroll-area class="main-scroll">
      <main
        class="q-pa-sm q-mb-md"
        :style="!$q.screen.lt.sm ? '' : 'width: 98vw'"
      >
        <q-table
          v-show="!showDataClient"
          :rows="
            loadingOrder || loadingEnterprise
              ? []
              : showInspect
                ? listEnterpriseView
                : listBondCurrent
          "
          :columns="columnsBond"
          :loading="loadingOrder || loadingEnterprise"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma vinculação para mostrar"
          virtual-scroll
          :rows-per-page-options="[rowsPerPage]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <span class="text-subtitle2">Lista de vínculos</span>
            <q-space />
            <q-toggle
              v-show="
                user?.enterprise_id !== user?.view_enterprise_id &&
                enterprisePosition === 'counter'
              "
              v-model="showInspect"
              color="primary"
              label="Inspeção aberta"
              left-label
            />
            <q-select
              v-model="selectedVerified"
              :options="optionsVerified"
              label="Filtrar por entrega"
              class="q-mr-sm"
              filled
              dense
              options-dense
              bg-color="grey-1"
              label-color="black"
              style="min-width: 200px"
              :class="!$q.screen.lt.md ? '' : 'full-width q-mt-sm'"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_month" color="black" size="20px" />
              </template>
            </q-select>
            <q-input filled v-model="filterOrder" dense label="Pesquisar">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="
                props.row.id === user?.view_enterprise_id ? 'text-red' : ''
              "
            >
              <q-td key="code_financial" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.code_financial
                }}</span>
              </q-td>
              <q-td key="name" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.name }}</span>
              </q-td>
              <q-td key="cnpj" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.cnpj }}</span>
              </q-td>
              <q-td key="cpf" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.cpf }}</span>
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
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    enterprisePosition === 'counter'
                  "
                  @click="setView(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="black"
                  icon="pageview"
                >
                  <q-tooltip> Inspecionar </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="user?.view_enterprise_id === props.row.id"
                  @click="setView(null)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="pageview"
                >
                  <q-tooltip> Fechar Inspeção </q-tooltip>
                </q-btn>
                <q-btn
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    enterprisePosition === 'counter'
                  "
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
                  v-show="
                    props.row.created_by === null &&
                    user?.enterprise_id === user?.view_enterprise_id &&
                    enterprisePosition === 'counter'
                  "
                  @click="openConfirmAction(props.row.id)"
                  size="sm"
                  flat
                  round
                  color="red"
                  icon="delete"
                />
                <q-btn
                  v-show="
                    user?.enterprise_id === user?.view_enterprise_id &&
                    enterprisePosition === 'counter'
                  "
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
          <template v-slot:bottom>
            <Paginate
              v-model="currentPage"
              :max="maxPages"
              :length="filteredBonds.length"
            />
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
        <ManageCategory
          :open="showCategoryPanel"
          @update:open="closeCategoryPanel"
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
