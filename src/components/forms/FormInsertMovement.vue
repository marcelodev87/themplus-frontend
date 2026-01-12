<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { useMovementStore } from 'src/stores/movement-store';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { formatCurrencyBRL } from 'src/composables/formatCurrencyBRL';
import * as XLSX from 'xlsx';
import {
  InsertMovement,
  InsertMovementData,
} from 'src/ts/interfaces/data/Movement';
import { ExcelData } from 'src/ts/interfaces/data/Excel';
import { DataOFX } from 'src/ts/interfaces/data/Geral';

defineOptions({
  name: 'FormInsertMovement',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const {
  exportMovementInsertExample,
  setLoading,
  getMovementInformations,
  insertMovement,
} = useMovementStore();
const { loadingMovement, listAccount, listCategoryAll } =
  storeToRefs(useMovementStore());

const viewMode = ref<'add' | 'process'>('add');
const optionsCategories = ref(listCategoryAll.value);
const optionsAccounts = ref(listAccount.value);
const listInsertMovement = ref<InsertMovement[]>([]);
const mountPayloadData = reactive<InsertMovementData[]>([]);
const dataInsert = reactive({
  file: null as File | null,
});
const columnsMovement = reactive<QuasarTable[]>([
  {
    name: 'dataMovimentacao',
    label: 'Data de movimentação',
    field: 'dataMovimentacao',
    align: 'left',
    style: 'width: 120px;',
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'left',
    style: 'width: 120px;',
  },
  {
    name: 'valor',
    label: 'Valor',
    field: 'valor',
    align: 'left',
    style: 'width: 120px;',
  },
  {
    name: 'account',
    label: 'Banco',
    field: 'account',
    align: 'left',
    style: 'max-width: 120px;',
  },
  {
    name: 'category',
    label: 'Categoria',
    field: 'category',
    align: 'left',
    style: 'max-width:100px;',
  },
  {
    name: 'descricao',
    label: 'Descrição',
    field: 'descricao',
    align: 'left',
    style:
      'max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
  },
  {
    name: 'receipt',
    label: 'Arquivo',
    field: 'receipt',
    align: 'left',
    style: 'width: 10%;',
  },
]);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataInsert.file === null) {
    return {
      status: false,
      message: 'Selecione um arquivo',
    };
  }

  if (
    dataInsert.file.type === 'application/x-ofx' ||
    dataInsert.file.name.toLowerCase().endsWith('.ofx')
  ) {
    return { status: true };
  }

  const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedTypes.includes(dataInsert.file.type)) {
    return {
      status: false,
      message: 'O arquivo deve ser uma planilha do Excel (.xls ou .xlsx)',
    };
  }

  const hasNoAccount = listInsertMovement.value.some(
    (movement) => !movement.account
  );
  const hasNoCategory = listInsertMovement.value.some(
    (movement) => !movement.category
  );

  if (hasNoAccount) {
    return {
      status: false,
      message: 'Há registros sem conta selecionada.',
    };
  }

  if (hasNoCategory) {
    return {
      status: false,
      message: 'Há registros sem categoria selecionada.',
    };
  }

  return { status: true };
};
const checkDataSave = (): { status: boolean; message?: string } => {
  const hasNoAccount = listInsertMovement.value.some(
    (movement) => !movement.account
  );
  const hasNoCategory = listInsertMovement.value.some(
    (movement) => !movement.category
  );

  if (hasNoAccount) {
    return {
      status: false,
      message: 'Há registros sem conta selecionada.',
    };
  }

  if (hasNoCategory) {
    return {
      status: false,
      message: 'Há registros sem categoria selecionada.',
    };
  }

  return { status: true };
};
const clear = (): void => {
  Object.assign(dataInsert, {
    file: null,
  });
  viewMode.value = 'add';
  listInsertMovement.value = [];
  mountPayloadData.splice(0, mountPayloadData.length);
};
const mountPayload = (): void => {
  mountPayloadData.splice(0, mountPayloadData.length);
  listInsertMovement.value.forEach((item) => {
    mountPayloadData.push({
      type: item.tipo.toLowerCase() === 'entrada' ? 'entrada' : 'saída',
      value: item.valor,
      description: item.descricao ?? null,
      receipt: item.receipt && item.receipt !== null ? item.receipt : null,
      category: item.category.value,
      account: item.account.value,
      date: item.dataMovimentacao,
      programmed: 0,
    });
  });
};
const save = async () => {
  const check = checkDataSave();
  if (check.status) {
    mountPayload();
    const response = await insertMovement(mountPayloadData);
    if (response?.status === 201) {
      clear();
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const exportInsert = async () => {
  await exportMovementInsertExample();
};
const excelSerialToDate = (serial: number): string => {
  const utcDays = serial - 25569;
  const utcValue = utcDays * 86400;
  const date = new Date(utcValue * 1000);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
const normalizeAndValidateValue = (valor: string): number | null => {
  if (typeof valor !== 'string') return null;

  valor = valor.trim();

  const regex = /^[0-9]+(\.[0-9]{1,2})?$/;

  if (regex.test(valor)) {
    return parseFloat(valor);
  }

  return null;
};
const checkAccountAndCategoryRows = (rows: ExcelData[]): InsertMovement[] => {
  return rows.map((item) => {
    const updatedItem: ExcelData = { ...item };

    if (item.accountID) {
      const foundAccount = listAccount.value.find(
        (account) => account.value === item.accountID
      );

      if (foundAccount) {
        updatedItem.account = foundAccount;
      }
    }

    if (item.categoryID) {
      const listCategories = listCategoryAll.value.filter((category) => {
        if (item.tipo.toLowerCase() === 'entrada') {
          return category.type === 'entrada';
        }
        return category.type !== 'entrada';
      });
      const foundCategory = listCategories.find(
        (category) => category.id === item.categoryID
      );

      if (foundCategory) {
        updatedItem.category = {
          label: foundCategory.name,
          value: foundCategory.id,
        };
      }
    }
    return updatedItem;
  });
};
const mapOFXToInsertMovement = (transactions: DataOFX[]): ExcelData[] => {
  return transactions.map((t) => ({
    tipo: t.type === 'entry' ? 'entrada' : 'saída',
    valor: t.value,
    dataMovimentacao: t.date,
    descricao: t.description,
    accountID: '',
    categoryID: '',
  })) as unknown as ExcelData[];
};
const formatOFXDate = (raw: string): string => {
  const clean = raw.replace(/\[.*?\]/, '');

  const year = clean.slice(0, 4);
  const month = clean.slice(4, 6);
  const day = clean.slice(6, 8);

  return `${day}/${month}/${year}`;
};
const getTagValue = (block: string, tag: string): string | null => {
  const regex = new RegExp(`<${tag}>([^<\\r\\n]+)`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : null;
};
const parseOFX = (content: string): DataOFX[] => {
  const transactions: DataOFX[] = [];

  const stmtRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  const blocks = content.match(stmtRegex) || [];

  blocks.forEach((block) => {
    const trnType = getTagValue(block, 'TRNTYPE');
    const dtPosted = getTagValue(block, 'DTPOSTED');
    const trnAmt = getTagValue(block, 'TRNAMT');
    const memo = getTagValue(block, 'MEMO');

    if (!trnType || !dtPosted || !trnAmt) return;

    const type =
      trnType.toUpperCase() === 'DEBIT'
        ? 'out'
        : trnType.toUpperCase() === 'CREDIT'
          ? 'entry'
          : null;

    if (!type) return;

    transactions.push({
      type,
      date: formatOFXDate(dtPosted),
      value: Math.abs(Number(trnAmt)).toFixed(2),
      description: memo ?? '',
    });
  });

  return transactions;
};
const processOFXFile = (file: File) => {
  setLoading(true);

  const reader = new FileReader();

  reader.onload = (e) => {
    const content = e.target?.result;

    if (typeof content !== 'string') {
      Notify.create({
        type: 'negative',
        message: 'Erro ao ler o arquivo OFX',
      });
      setLoading(false);
      return;
    }

    const transactions = parseOFX(content);

    if (transactions.length === 0) {
      Notify.create({
        type: 'negative',
        message: 'Nenhuma movimentação válida encontrada no arquivo OFX',
      });
      setLoading(false);
      return;
    }

    const mappedRows = mapOFXToInsertMovement(transactions);

    listInsertMovement.value = checkAccountAndCategoryRows(mappedRows);

    Notify.create({
      type: 'positive',
      message: `Arquivo OFX processado com sucesso (${mappedRows.length} registros)`,
    });

    viewMode.value = 'process';
    setLoading(false);
  };

  reader.onerror = () => {
    Notify.create({
      type: 'negative',
      message: 'Erro ao ler o arquivo OFX',
    });
    setLoading(false);
  };

  reader.readAsText(file, 'utf-8');
};
const process = () => {
  const check = checkData();
  if (check.status) {
    const isOFX = dataInsert.file?.name?.toLowerCase().endsWith('.ofx');

    if (isOFX) {
      if (!dataInsert.file) {
        Notify.create({
          type: 'negative',
          message: 'Nenhum arquivo OFX selecionado',
        });
        return;
      }

      processOFXFile(dataInsert.file);
      return;
    }
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) {
        Notify.create({
          message: 'Erro ao processar o arquivo: evento inválido.',
          type: 'negative',
        });
        setLoading(false);
        return;
      }

      const { result } = e.target;
      if (!(result instanceof ArrayBuffer)) {
        Notify.create({
          message: 'Erro ao processar o arquivo: formato inválido.',
          type: 'negative',
        });
        setLoading(false);
        return;
      }

      const data = new Uint8Array(result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers: any = jsonData[0];
      const requiredHeaders = [
        'DATA DE MOVIMENTAÇÃO',
        'TIPO',
        'VALOR',
        'CONTA_ID',
        'CATEGORIA_ID',
        'DESCRIÇÃO',
      ];
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );
      if (missingHeaders.length > 0) {
        Notify.create({
          type: 'negative',
          message: `As seguintes colunas estão ausentes no arquivo: ${missingHeaders.join(', ')}`,
        });
        setLoading(false);
        return;
      }

      const columnIndexes = requiredHeaders.map((header) =>
        headers.indexOf(header)
      );

      const columnErrors = {
        TIPO: 0,
        VALOR: 0,
        'DATA DE MOVIMENTAÇÃO': 0,
      };

      const validRows: any[] = [];
      let errorIncomplete: number = 0;

      jsonData.slice(1).forEach((row: any) => {
        if (
          row.length > 0 &&
          (!row[columnIndexes[0]] ||
            !row[columnIndexes[1]] ||
            !row[columnIndexes[2]])
        ) {
          errorIncomplete += 1;
          return;
        }

        if (row.length > 0) {
          let dataMovimentacao = row[columnIndexes[0]];
          const tipo = row[columnIndexes[1]];
          const valor = row[columnIndexes[2]]?.toString() || '';
          const accountID = row[columnIndexes[3]]?.toString() || '';
          const categoryID = row[columnIndexes[4]]?.toString() || '';
          const descricao = row[columnIndexes[5]];

          let isValid = true;

          dataMovimentacao = excelSerialToDate(dataMovimentacao);

          if (!['entrada', 'saída'].includes(tipo?.toLowerCase())) {
            columnErrors.TIPO++;
            isValid = false;
          }

          const normalizedValue = normalizeAndValidateValue(valor);
          if (!normalizedValue) {
            columnErrors.VALOR++;
            isValid = false;
          }

          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataMovimentacao)) {
            columnErrors['DATA DE MOVIMENTAÇÃO']++;
            isValid = false;
          }

          if (isValid) {
            validRows.push({
              tipo,
              valor: normalizedValue,
              accountID,
              categoryID,
              dataMovimentacao,
              descricao,
            });
          }
        }
      });

      if (errorIncomplete > 0) {
        Notify.create({
          type: 'negative',
          message:
            'Alguns registros não foram processadas por estarem incompletas. Coluna Data de Movimentação, Tipo e Valor são obrigatórias.',
          timeout: 10000,
          progress: true,
        });
      }
      if (Object.values(columnErrors).some((count) => count > 0)) {
        const errorMessages = [];

        if (columnErrors.TIPO > 0) {
          errorMessages.push(
            `A coluna "TIPO" contém ${columnErrors.TIPO} erros. Valores permitidos: "Entrada" ou "Saída".`
          );
        }
        if (columnErrors.VALOR > 0) {
          errorMessages.push(
            `A coluna "VALOR" contém ${columnErrors.VALOR} erros. Formato esperado: numérico, ex: R$ 5.000,000 ou 650,00.`
          );
        }
        if (columnErrors['DATA DE MOVIMENTAÇÃO'] > 0) {
          errorMessages.push(
            `A coluna "DATA DE MOVIMENTAÇÃO" contém ${columnErrors['DATA DE MOVIMENTAÇÃO']} erros. Formato esperado: DD/MM/AAAA.`
          );
        }

        Notify.create({
          type: 'negative',
          message: `Erros encontrados nas colunas:\n${errorMessages.join('\n')}`,
          timeout: 10000,
          progress: true,
        });
        setLoading(false);
        return;
      }

      listInsertMovement.value = checkAccountAndCategoryRows(validRows);

      Notify.create({
        message: 'Arquivo processado com sucesso',
        type: 'positive',
      });

      setLoading(false);
    };

    reader.onerror = () => {
      Notify.create({
        message: 'Erro ao ler o arquivo',
        type: 'negative',
      });
      setLoading(false);
    };

    if (dataInsert.file) {
      reader.readAsArrayBuffer(dataInsert.file);
    }

    viewMode.value = 'process';
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const onChangeAccount = (account: any) => {
  listInsertMovement.value = listInsertMovement.value.map((item) => ({
    ...item,
    account,
  }));
};
const filterFnAccount = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    optionsAccounts.value =
      val === ''
        ? listAccount.value
        : listAccount.value.filter((element) =>
            element.label?.toLowerCase().includes(needle)
          );
  });
};
const filterFnCategory = (
  val: string,
  updateFilter: (callback: () => void) => void
) => {
  const needle = val.toLowerCase();
  updateFilter(() => {
    optionsCategories.value =
      val === ''
        ? listCategoryAll.value
        : listCategoryAll.value.filter((element) =>
            element.name?.toLowerCase().includes(needle)
          );
  });
};

watch(
  () => dataInsert.file,
  (file) => {
    if (file === null) {
      listInsertMovement.value = [];
    }
  },
  { immediate: true }
);
watch(
  viewMode,
  (mode) => {
    if (mode === 'add') {
      clear();
    }
  },
  { immediate: true }
);
watch(open, async () => {
  clear();
  if (open.value) {
    await getMovementInformations(null, null);
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card
      class="bg-grey-2"
      :style="viewMode === 'process' ? 'min-width: 98vw' : 'min-width: 40vw'"
    >
      <q-card-section class="q-pa-none">
        <TitlePage title="Inserção de movimentações" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form v-if="viewMode === 'add'" class="q-gutter-y-sm">
          <q-file
            v-model="dataInsert.file"
            filled
            bg-color="white"
            label-color="black"
            label="Adicione um documento ( .xls, .xlsx ou .ofx )"
            dense
            clearable
            accept=".xls,.xlsx,.ofx"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" color="black" size="20px" />
            </template>
          </q-file>
        </q-form>

        <q-table
          v-else
          :rows="loadingMovement ? [] : listInsertMovement"
          :columns="columnsMovement"
          :loading="loadingMovement"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhuma movimentação para mostrar"
          style="height: 450px"
          virtual-scroll
          :rows-per-page-options="[25]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top>
            <span class="text-subtitle2">Planilha processada</span>
          </template>
          <template v-slot:body="props">
            <q-tr
              :props="props"
              style="height: 28px"
              :class="
                props.row.tipo.toLocaleLowerCase() === 'entrada'
                  ? 'text-green'
                  : 'text-red'
              "
            >
              <q-td key="dataMovimentacao" :props="props" class="text-left">
                {{ props.row.dataMovimentacao }}
              </q-td>
              <q-td key="tipo" :props="props" class="text-left capitalize">
                {{ props.row.tipo }}
              </q-td>
              <q-td key="valor" :props="props" class="text-left">
                {{ `${formatCurrencyBRL(props.row.valor)}` }}
              </q-td>
              <q-td key="account" :props="props" class="text-left">
                <q-select
                  v-model="props.row.account"
                  :options="optionsAccounts"
                  @filter="filterFnAccount"
                  @update:model-value="onChangeAccount"
                  label="Conta"
                  filled
                  dense
                  options-dense
                  map-options
                  bg-color="white"
                  label-color="black"
                  use-input
                  input-debounce="0"
                  behavior="menu"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_balance" color="black" size="16px" />
                  </template>
                </q-select>
              </q-td>
              <q-td key="category" :props="props" class="text-left">
                <q-select
                  v-model="props.row.category"
                  :options="
                    (props.row.tipo.toLocaleLowerCase() === 'entrada'
                      ? optionsCategories.filter(
                          (item) => item.type === 'entrada'
                        )
                      : optionsCategories.filter(
                          (item) => item.type !== 'entrada'
                        )
                    ).map((item) => ({ value: item.id, label: item.name }))
                  "
                  @filter="filterFnCategory"
                  label="Categoria"
                  filled
                  dense
                  options-dense
                  map-options
                  bg-color="white"
                  label-color="black"
                  use-input
                  input-debounce="0"
                  behavior="menu"
                >
                  <template v-slot:prepend>
                    <q-icon name="category" color="black" size="16px" />
                  </template>
                </q-select>
              </q-td>
              <!-- <q-td key="descricao" :props="props" class="text-left">
                {{ props.row.descricao }}
              </q-td> -->
              <q-td key="descricao" :props="props">
                {{ props.row.descricao }}
                <q-popup-edit
                  v-model="props.row.descricao"
                  auto-save
                  v-slot="scope"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    counter
                    @keyup.enter="scope.set"
                  />
                </q-popup-edit>
              </q-td>
              <q-td key="receipt" :props="props" class="text-left">
                <q-file
                  v-model="props.row.receipt"
                  filled
                  bg-color="white"
                  label-color="black"
                  label="Arquivo"
                  dense
                  clearable
                  accept=".pdf, .jpeg, .jpg, .png"
                  :max-file-size="2 * 1024 * 1024"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" color="black" size="20px" />
                  </template>
                </q-file>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            v-show="viewMode === 'add'"
            color="red"
            label="Fechar"
            size="md"
            flat
            @click="open = false"
            unelevated
            no-caps
          />
          <q-btn
            v-show="viewMode === 'process'"
            color="red"
            label="Voltar"
            size="md"
            flat
            @click="viewMode = 'add'"
            unelevated
            no-caps
          />
          <q-btn
            v-show="viewMode === 'add'"
            @click="exportInsert"
            color="black"
            icon-right="download"
            label="Exemplo"
            flat
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
          <q-btn
            v-show="viewMode === 'add'"
            @click="process"
            color="primary"
            label="Processar"
            icon-right="sync"
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
          <q-btn
            v-show="viewMode === 'process'"
            @click="save"
            color="primary"
            label="Salvar"
            icon-right="save"
            size="md"
            :loading="loadingMovement"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
