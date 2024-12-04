<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Category, DataCategory } from 'src/ts/interfaces/data/Category';
import { Notify } from 'quasar';
import { QuasarSelect } from 'src/ts/interfaces/framework/Quasar';
import { useCategoryStore } from 'src/stores/category-store';
import { useAlertStore } from 'src/stores/alert-store';
import { storeToRefs } from 'pinia';

defineOptions({
  name: 'FormCategory',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Category | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createCategory, updateCategory } = useCategoryStore();
const { loadingCategory } = storeToRefs(useCategoryStore());
const { loadingAlert, listAlert } = storeToRefs(useAlertStore());
const { getAlerts } = useAlertStore();

const selectedAlert = ref<QuasarSelect<string> | null>(null);
const filterCategory = ref<string>('');
const dataCategory = reactive<DataCategory>({
  name: '',
  type: 'Entrada',
});
const optionsTypeCategory = reactive<string[]>(['Entrada', 'Saída']);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const optionsAlerts = computed(() => {
  return listAlert.value.map((item) => {
    return { label: item.description, value: item.id };
  });
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataCategory.name.trim() === '') {
    return {
      status: false,
      message: 'O campo de categoria não pode ser vazio',
    };
  }
  if (dataCategory.name.trim().length < 3) {
    return {
      status: false,
      message: 'O campo de categoria deve conter pelo menos 3 caracteres',
    };
  }
  return { status: true };
};
const clear = (): void => {
  dataCategory.name = '';
  dataCategory.type = 'Entrada';
  filterCategory.value = '';
  selectedAlert.value = null;
};

const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createCategory(
      dataCategory.name,
      dataCategory.type,
      selectedAlert.value?.value ?? null
    );
    if (response?.status === 200) {
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
const update = async () => {
  const check = checkData();
  if (check.status) {
    const response = await updateCategory(
      props.dataEdit?.id ?? '',
      dataCategory.name,
      dataCategory.type,
      selectedAlert.value?.value ?? null
    );
    if (response?.status === 200) {
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
const fetchInformations = async () => {
  await getAlerts();
};
const checkEdit = () => {
  if (props.dataEdit !== null) {
    Object.assign(dataCategory, {
      name: props.dataEdit.name,
      type: props.dataEdit.type === 'entrada' ? 'Entrada' : 'Saída',
    });

    const foundItem = props.dataEdit.alert_id
      ? listAlert.value.find((item) => item.id === props.dataEdit?.alert_id)
      : null;

    selectedAlert.value = foundItem
      ? { label: foundItem.description, value: foundItem.id }
      : null;
  }
};

watch(open, async () => {
  if (open.value) {
    clear();
    await fetchInformations();
    checkEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage
          :title="
            props.dataEdit === null
              ? 'Registre uma categoria'
              : 'Atualize uma categoria'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm q-gutter-y-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCategory.name"
            bg-color="white"
            label-color="black"
            filled
            label="Crie uma nova categoria"
            dense
            input-class="text-black"
          >
            <template v-slot:prepend>
              <q-icon name="category" color="black" size="20px" />
            </template>
          </q-input>
          <q-select
            v-model="dataCategory.type"
            :options="optionsTypeCategory"
            label="Tipo"
            filled
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="sync_alt" color="black" size="20px" />
            </template>
          </q-select>
          <q-select
            v-model="selectedAlert"
            :options="optionsAlerts"
            :readonly="optionsAlerts.length === 0"
            clearable
            :label="
              optionsAlerts.length === 0
                ? 'Não existe nenhuma alerta registrada'
                : 'Selecione uma alerta'
            "
            filled
            dense
            options-dense
            bg-color="white"
            label-color="black"
            class="full-width"
          >
            <template v-slot:prepend>
              <q-icon name="warning" color="black" size="20px" />
            </template>
          </q-select>
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
            unelevated
            no-caps
          />
          <q-btn
            v-if="props.dataEdit !== null"
            @click="update"
            :loading="loadingCategory"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="save"
            :loading="loadingCategory"
            color="primary"
            label="Salvar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
      <q-inner-loading
        :showing="loadingAlert || loadingCategory"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
  </q-dialog>
</template>
