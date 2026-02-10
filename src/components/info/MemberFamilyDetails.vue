<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMemberStore } from 'src/stores/member-store';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'MemberFamilyDetails',
});

const props = defineProps<{
  data: {
    open: boolean;
    memberFamilyID: string | null;
  };
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const { Member, loadingShowMember } = storeToRefs(useMemberStore());

const showMember = async () => {
  if (props.data.memberFamilyID) {
    await useMemberStore().showMember(props.data.memberFamilyID);
  }
};

const open = computed({
  get: () => props.data.open,
  set: () => emit('update:open'),
});

watch(
  () => open.value,
  async () => {
    if (open.value) {
      await showMember();
    }
  }
);
</script>

<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2 form-basic" style="min-width: 40vw">
      <q-card-section class="q-pa-sm">
        <TitlePage :title="`Detalhes de ${Member?.name ?? ''}`" />
      </q-card-section>
      <q-card-section
        :class="
          loadingShowMember
            ? 'q-pa-xl column q-gutter-md'
            : 'q-pa-md column q-gutter-md'
        "
      >
        <q-inner-loading
          :showing="loadingShowMember"
          class="column flex justify-center self-center"
          label="Carregando os dados..."
          label-class="black"
          label-style="font-size: 1.1em"
          color="primary"
          size="50px"
        />

        <div v-if="!loadingShowMember" class="column q-gutter-md">
          <q-card flat bordered class="bg-white q-pa-md">
            <div class="text-h6 text-red-10 flex items-center">
              <q-icon name="person" class="q-mr-sm" />
              Informações Pessoais
            </div>
            <q-separator spaced />
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Nome:</b> {{ Member?.name || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Profissão:</b>
                  {{ Member?.profession || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Data de nascimento:</b>
                  {{ Member?.date_birth || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Naturalidade:</b>
                  {{ Member?.naturalness || '-' }}
                </p>
              </div>
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Estado civil:</b>
                  {{ Member?.marital_status || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Escolaridade:</b>
                  {{ Member?.education || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">CPF:</b> {{ Member?.cpf || '-' }}
                </p>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="bg-white q-pa-md">
            <div class="text-h6 text-red-10 flex items-center">
              <q-icon name="contact_mail" class="q-mr-sm" />
              Contatos
            </div>
            <q-separator spaced />
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Email pessoal:</b>
                  {{ Member?.email || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Email profissional:</b>
                  {{ Member?.email_professional || '-' }}
                </p>
              </div>
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Telefone pessoal:</b>
                  {{ Member?.phone || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Telefone profissional:</b>
                  {{ Member?.phone_professional || '-' }}
                </p>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="bg-white q-pa-md">
            <div class="text-h6 text-red-10 flex items-center">
              <q-icon name="home" class="q-mr-sm" />
              Endereço
            </div>
            <q-separator spaced />
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">CEP:</b> {{ Member?.cep || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">UF:</b> {{ Member?.uf || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Cidade:</b> {{ Member?.city || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Bairro:</b>
                  {{ Member?.neighborhood || '-' }}
                </p>
              </div>
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Endereço:</b> {{ Member?.address || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Nº:</b> {{ Member?.address_number || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Complemento:</b>
                  {{ Member?.complement || '-' }}
                </p>
              </div>
            </div>
          </q-card>

          <q-card flat bordered class="bg-white q-pa-md">
            <div class="text-h6 text-red-10 flex items-center">
              <q-icon name="calendar_today" class="q-mr-sm" />
              Datas e Igreja
            </div>
            <q-separator spaced />
            <div class="row q-col-gutter-md q-mt-sm">
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Data de batismo:</b>
                  {{ Member?.date_baptismo || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Membro desde:</b>
                  {{ Member?.start_date || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Igreja origem:</b>
                  {{ Member?.church_start_date || '-' }}
                </p>
              </div>
              <div class="col-12 col-sm-6">
                <p class="flex items-center">
                  <b class="q-mr-xs">Data de saída:</b>
                  {{ Member?.end_date || '-' }}
                </p>
                <p class="flex items-center">
                  <b class="q-mr-xs">Igreja destino:</b>
                  {{ Member?.church_end_date || '-' }}
                </p>
              </div>
            </div>
          </q-card>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-py-sm q-px-md">
        <q-btn
          color="red"
          label="Fechar"
          size="md"
          @click="open = false"
          unelevated
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
