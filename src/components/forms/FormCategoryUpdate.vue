<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useCategoryStore } from 'src/stores/category-store';
import { CategoryUpdate } from 'src/ts/interfaces/data/CategoryUpdate';
import TitlePage from '../shared/TitlePage.vue';

const { getCategoriesWithParams } = useCategoryStore();

const props = defineProps<{
  open: boolean;
  categorySelected: object;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const selectedCategory = reactive<CategoryUpdate>({
  id: '',
  name: '',
  type: '',
  default: 0,
  enterprise_id: '',
  code_credit: 0,
  code_debt: 0,
});

const displayCategory = computed({
  get() {
    return selectedCategory.default === 0 ? 'Padrão' : 'Criada';
  },
  set(newValue) {
    selectedCategory.default = newValue === 'Padrão' ? 0 : 1;
  },
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Edite o plano de conta" />
      </q-card-section>
      <q-card-section>
        <q-form>
          {{ props.categorySelected }}
          <q-input
            label="Categoria"
            v-model="selectedCategory.name"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
          />
          <q-input
            label="Movimentação"
            v-model="selectedCategory.type"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
          />
          <q-input
            label="Origem da categoria"
            v-model="displayCategory"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
          />
          <q-input
            label="Código de débito"
            v-model="selectedCategory.code_debt"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
          />
          <q-input
            label="código de crédito"
            v-model="selectedCategory.code_credit"
            bg-color="white"
            label-color="black"
            filled
            dense
            input-class="text-black"
          />
        </q-form>
        <div class="row justify-end">
          <q-btn color="primary" label="Atualizar" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
