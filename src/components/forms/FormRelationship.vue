<!-- eslint-disable no-restricted-globals -->
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import TitlePage from 'src/components/shared/TitlePage.vue';
import { Notify } from 'quasar';
import { storeToRefs } from 'pinia';
import { Relationship } from 'src/ts/interfaces/data/Relationship';
import { useRelationshipStore } from 'src/stores/relationship-store';

defineOptions({
  name: 'FormRelationship',
});

const props = defineProps<{
  open: boolean;
  dataEdit: Relationship | null;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { createRelationship, updateRelationship } = useRelationshipStore();
const { loadingRelationship } = storeToRefs(useRelationshipStore());

const dataRelationship = reactive({
  name: '' as string,
});

const checkData = (): { status: boolean; message?: string } => {
  if (dataRelationship.name.trim() === '') {
    return {
      status: false,
      message: 'Deve ser informado o nome da relação',
    };
  }
  return { status: true };
};
const clear = (): void => {
  Object.assign(dataRelationship, {
    name: '',
  });
};
const save = async () => {
  const check = checkData();
  if (check.status) {
    const response = await createRelationship(dataRelationship.name);
    if (response?.status === 201) {
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
    const response = await updateRelationship(
      props.dataEdit?.id ?? '',
      dataRelationship.name
    );
    if (response?.status === 200) {
      emit('update:open');
    }
  } else {
    Notify.create({
      message: check.message,
      type: 'negative',
    });
  }
};
const mountData = () => {
  if (props.dataEdit) {
    Object.assign(dataRelationship, {
      name: props.dataEdit.name,
    });
  }
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

watch(open, () => {
  if (open.value) {
    clear();
    mountData();
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
              ? 'Cadastro de relação'
              : 'Atualização de relação'
          "
        />
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <q-form class="q-gutter-y-sm">
          <q-input
            v-model="dataRelationship.name"
            bg-color="white"
            label-color="black"
            outlined
            label="Nome da relação"
            dense
            input-class="text-black no-spinners"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="black" size="20px" />
            </template>
          </q-input>
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
            v-if="props.dataEdit === null"
            @click="save"
            color="primary"
            label="Salvar"
            size="md"
            :loading="loadingRelationship"
            unelevated
            no-caps
          />
          <q-btn
            v-else
            @click="update"
            color="primary"
            label="Atualizar"
            size="md"
            :loading="loadingRelationship"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
