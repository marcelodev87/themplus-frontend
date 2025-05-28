<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { CategoryPanel } from 'src/ts/interfaces/data/Category';
import { useCategoryStore } from 'src/stores/category-store';
import { storeToRefs } from 'pinia';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'FormCategoryCode',
});

const props = defineProps<{
  open: boolean;
  categorySelected: CategoryPanel | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { loadingCategory } = storeToRefs(useCategoryStore());
const { updateCategoryCode } = useCategoryStore();

const dataCategoryCode = reactive({
  name: '' as string,
  enterpriseName: '' as string,
  codeCredit: '' as string,
  codeDebt: '' as string,
});

const clear = (): void => {
  Object.assign(dataCategoryCode, {
    name: '',
    enterpriseName: '',
    codeCredit: '',
    codeDebt: '',
  });
};
const mountEdit = (): void => {
  Object.assign(dataCategoryCode, {
    name: props.categorySelected?.name,
    enterpriseName:
      props.categorySelected?.organization_name ?? 'Categoria padrão',
    codeCredit: String(props.categorySelected?.code_credit) ?? '',
    codeDebt: String(props.categorySelected?.code_debt) ?? '',
  });
};
const update = async () => {
  const response = await updateCategoryCode({
    id: props.categorySelected?.id ?? null,
    name: props.categorySelected?.name ?? '',
    codeDebt:
      dataCategoryCode.codeDebt.trim() !== ''
        ? Number(dataCategoryCode.codeDebt)
        : null,
    codeCredit:
      dataCategoryCode.codeCredit.trim() !== ''
        ? Number(dataCategoryCode.codeCredit)
        : null,
  });

  if (response?.status === 200) {
    clear();
    emit('update:open');
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    mountEdit();
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="width: 500px; max-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Edite o plano de conta" />
      </q-card-section>
      <q-card-section>
        <q-form class="column q-gutter-y-sm">
          <q-input
            v-model="dataCategoryCode.name"
            label="Nome"
            bg-color="white"
            label-color="black"
            disable
            filled
            dense
            input-class="text-black"
          />
          <q-input
            v-model="dataCategoryCode.enterpriseName"
            label="Organização"
            bg-color="white"
            label-color="black"
            disable
            filled
            dense
            input-class="text-black"
          />
          <q-input
            v-model="dataCategoryCode.codeCredit"
            label="Código crédito"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
            mask="##########"
          />
          <q-input
            v-model="dataCategoryCode.codeDebt"
            label="Código débito"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
            mask="##########"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="emit('update:open')"
            color="red"
            label="Voltar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            :loading="loadingCategory"
            color="primary"
            label="Atualizar"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
