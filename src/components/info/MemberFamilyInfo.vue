<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { QuasarTable } from 'src/ts/interfaces/framework/Quasar';
import { MemberChurch } from 'src/ts/interfaces/data/Member';
import { useRelationshipStore } from 'src/stores/relationship-store';
import { useMemberStore } from 'src/stores/member-store';
import TitlePage from '../shared/TitlePage.vue';
import ConfirmAction from '../confirm/ConfirmAction.vue';
import MemberFamilyDetails from './MemberFamilyDetails.vue';

defineOptions({
  name: 'MemberFamilyInfo',
});

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
  'show:member-family-details': [string];
}>();

const { listMember } = storeToRefs(useMemberStore());
const { listRelationship } = storeToRefs(useRelationshipStore());
const { getRelationships } = useRelationshipStore();

const showConfirmAction = ref<boolean>(false);
const excludeRelationShipData = reactive({
  relatedMemberID: null as string | null,
  relationshipID: null as string | null,
});
const showMemberFamilyDetails = reactive({
  open: false as boolean,
  memberFamilyID: null as string | null,
});
const model = defineModel<MemberChurch | null>({ required: true });
const loading = ref<boolean>(false);
const columnsMemberFamily = reactive<QuasarTable[]>([
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
  {
    name: 'actions',
    label: 'Ações',
    field: 'actions',
    align: 'right',
    sortable: true,
  },
]);

const fetchRelationships = async () => {
  await getRelationships();
};
const deleteRelationship = async (
  memberID: string,
  relatedMemberID: string,
  relationshipID: string
) => {
  const response = await useMemberStore().deleteRelationship(
    memberID,
    relatedMemberID,
    relationshipID
  );

  if (response?.status === 200 && model.value?.family) {
    model.value.family = model.value.family.filter(
      (item) =>
        item.pivot.related_member_id !== relatedMemberID ||
        item.pivot.relationship_id !== relationshipID
    );
  }
};
const clear = (): void => {
  excludeRelationShipData.relatedMemberID = null;
  excludeRelationShipData.relationshipID = null;
};
const closeConfirmActionOk = async (): Promise<void> => {
  showConfirmAction.value = false;
  await deleteRelationship(
    model.value?.id ?? '',
    excludeRelationShipData.relatedMemberID ?? '',
    excludeRelationShipData.relationshipID ?? ''
  );
  clear();
};
const closeConfirmAction = (): void => {
  showConfirmAction.value = false;
  clear();
};
const openConfirmAction = (
  relatedMemberID: string,
  relationshipID: string
): void => {
  excludeRelationShipData.relatedMemberID = relatedMemberID;
  excludeRelationShipData.relationshipID = relationshipID;
  showConfirmAction.value = true;
};
const openShowMemberFamilyDetails = (open: boolean, id: string) => {
  Object.assign(showMemberFamilyDetails, {
    open,
    memberFamilyID: id,
  });
};
const closeShowMemberFamilyDetails = () => {
  showMemberFamilyDetails.open = false;
  showMemberFamilyDetails.memberFamilyID = null;
};

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});
const getListFamily = computed(() => {
  if (!model.value?.family || model.value?.family.length === 0) {
    return [];
  }

  return model.value?.family
    .map((item) => {
      const foundMember = listMember.value.find(
        (member) => member.id === item.pivot.related_member_id
      );

      const foundRelationship = listRelationship.value.find(
        (relationship) => relationship.id === item.pivot.relationship_id
      );

      const memberOption = foundMember
        ? { label: foundMember.name, value: foundMember.id }
        : null;

      const relationshipOption = foundRelationship
        ? { label: foundRelationship.name, value: foundRelationship.id }
        : null;

      if (memberOption && relationshipOption) {
        return {
          member: memberOption,
          relationship: relationshipOption,
        };
      }

      return null;
    })
    .filter((item) => item !== null);
});

watch(open, async () => {
  if (open.value) {
    loading.value = true;
    await fetchRelationships();
    loading.value = false;
  }
});
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 98vw">
      <q-card-section class="q-pa-sm">
        <TitlePage :title="`Relações (${model?.name ?? ''})`" />
        <q-table
          :rows="loading || !getListFamily ? [] : getListFamily"
          :columns="columnsMemberFamily"
          :loading="loading"
          flat
          bordered
          dense
          row-key="index"
          no-data-label="Nenhum parentesco para mostrar"
          virtual-scroll
          :rows-per-page-options="[10]"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                <span style="font-size: 13px">{{ col.label }}</span>
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" style="height: 28px">
              <q-td key="member" :props="props" class="text-left">
                <span class="text-subtitle2">{{ props.row.member.label }}</span>
              </q-td>
              <q-td key="relationship" :props="props" class="text-left">
                <span class="text-subtitle2">{{
                  props.row.relationship.label
                }}</span>
              </q-td>
              <q-td key="actions" :props="props" class="text-left">
                <q-btn
                  @click="
                    openShowMemberFamilyDetails(true, props.row.member.value)
                  "
                  size="sm"
                  flat
                  round
                  color="primary"
                  icon="visibility"
                />
                <q-btn
                  @click="
                    openConfirmAction(
                      props.row.member.value,
                      props.row.relationship.value
                    )
                  "
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
        <q-card-actions align="right" class="q-py-sm q-px-none">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
          />
        </q-card-actions>
      </q-card-section>
      <q-inner-loading
        :showing="loading"
        label="Carregando os dados..."
        label-class="black"
        label-style="font-size: 1.1em"
        color="primary"
        size="50px"
      />
    </q-card>
    <!-- Modals -->
    <ConfirmAction
      :open="showConfirmAction"
      label-action="Continuar"
      title="Confirmação de exclusão"
      message="Este processo é irreversível. Caso tenha certeza, clique em 'Continuar' para prosseguir."
      @update:open="closeConfirmAction"
      @update:ok="closeConfirmActionOk"
    />
    <MemberFamilyDetails
      :data="showMemberFamilyDetails"
      @update:open="closeShowMemberFamilyDetails"
    />
  </q-dialog>
</template>
