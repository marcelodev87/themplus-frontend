<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { storeToRefs } from 'pinia';
import { useEnterpriseStore } from 'src/stores/enterprise-store';

defineOptions({
  name: 'FormCodeFinancial',
});

const props = defineProps<{
  open: boolean;
  enterpriseId: string | null;
  enterpriseName: string | null;
  enterpriseCode: number | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { updateCodeFinancial } = useEnterpriseStore();
const { loadingEnterprise } = storeToRefs(useEnterpriseStore());

const dataCode = reactive({
  code: null as number | null,
  name: '' as string,
});

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const clear = (): void => {
  Object.assign(dataCode, {
    name: '',
    code: null,
  });
};
const update = async () => {
  const response = await updateCodeFinancial(
    props.enterpriseId ?? '',
    dataCode.code ?? null
  );

  if (response?.status === 200) {
    emit('update:open');
    clear();
  }
};
const mountEdit = () => {
  Object.assign(dataCode, {
    name: props.enterpriseName,
    code: props.enterpriseCode,
  });
};

watch(
  open,
  () => {
    if (open.value) {
      clear();
      if (props.enterpriseName) {
        mountEdit();
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic">
      <q-card-section class="q-pa-none">
        <TitlePage title="Atualize o código interno" />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataCode.name"
            bg-color="white"
            label-color="black"
            filled
            label="Nome da organização"
            dense
            input-class="text-black"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="black" size="20px" />
            </template>
          </q-input>
          <q-input
            v-model="dataCode.code"
            bg-color="white"
            label-color="black"
            filled
            label="Digite o código interno"
            dense
            input-class="text-black"
            mask="##########"
          >
            <template v-slot:prepend>
              <q-icon name="key" color="black" size="20px" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            @click="open = false"
            color="red"
            label="Fechar"
            size="md"
            flat
            unelevated
            no-caps
          />
          <q-btn
            @click="update"
            :loading="loadingEnterprise"
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
