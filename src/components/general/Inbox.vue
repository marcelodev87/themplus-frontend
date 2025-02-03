<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'Inbox',
});

const { getInbox, readNotification, deleteNotification } =
  useUsersMembersStore();
const { loadingUsersMembers, listInbox } = storeToRefs(useUsersMembersStore());

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const dataNotification = ref<{
  text: string | null;
  read: number;
  id: string;
} | null>(null);
const splitterModel = ref<number>(300);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const fetchInbox = async () => {
  await getInbox();
};
const selectNotification = async (text: string, read: number, id: string) => {
  dataNotification.value = {
    text,
    read,
    id,
  };
};
const clear = (): void => {
  dataNotification.value = null;
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Configurações de formatação da data e hora para Brasília
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric', // 'numeric' é o tipo correto
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 24 horas
  };

  // Usando Intl.DateTimeFormat para formatar a data
  const formatter = new Intl.DateTimeFormat('pt-BR', options);

  // Formatando a data
  const formattedDate = formatter.format(date);

  return formattedDate;
};
const read = async () => {
  const response = await readNotification(dataNotification.value?.id ?? '');
  if (response?.status === 200) {
    clear();
  }
};
const isActive = (id: string) => {
  return dataNotification.value?.id === id;
};
const exclude = async () => {
  const response = await deleteNotification(dataNotification.value?.id ?? '');
  if (response?.status === 200) {
    clear();
  }
};

watch(
  open,
  async () => {
    if (open.value) {
      clear();
      await fetchInbox();
    }
  },
  { immediate: true }
);
</script>
<template>
  <q-dialog v-model="open">
    <q-card class="bg-grey-2" style="min-width: 98vw">
      <q-card-section class="q-pa-none">
        <TitlePage title="Lista de notificações" class="bg-grey-4" />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <div
          v-if="listInbox.length === 0 && !loadingUsersMembers"
          class="q-pa-sm"
        >
          <q-banner dense inline-actions class="text-white bg-red" rounded>
            Suas lista de notificações está vazia.
          </q-banner>
        </div>
        <q-splitter
          v-else
          v-model="splitterModel"
          style="height: 430px"
          unit="px"
        >
          <template v-slot:before>
            <q-list dense separator>
              <q-item
                v-for="(item, index) in listInbox"
                :key="index"
                clickable
                dense
                @click="selectNotification(item.text, item.read, item.id)"
                :class="item.read ? 'bg-grey-4 opacity-50' : ''"
                :active="isActive(item.id)"
                active-class="active-option-inbox"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="
                      item.read ? 'mark_email_read' : 'fa-regular fa-envelope'
                    "
                  />
                </q-item-section>
                <q-item-section>
                  <div class="column">
                    <p :class="item.read ? 'text-bold' : ''">
                      {{ item.title }}
                    </p>
                    <p
                      class="text-caption"
                      :class="item.read ? 'text-bold' : ''"
                    >
                      {{ formatDate(item.created_at) }}
                    </p>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </template>

          <template v-slot:after>
            <div class="q-pa-md text-h6">
              {{
                dataNotification === null
                  ? 'Não foi selecionado nenhuma notificação'
                  : dataNotification.text
              }}
            </div>
          </template>
        </q-splitter>
        <q-inner-loading
          :showing="loadingUsersMembers"
          label="Carregando os e-mails..."
          label-class="black"
          label-style="font-size: 1.1em"
          color="primary"
          size="50px"
        />
      </q-card-section>
      <q-card-actions align="right" class="border-top">
        <div class="row justify-end items-center q-gutter-x-sm">
          <q-btn
            color="red"
            label="Fechar"
            size="md"
            @click="open = false"
            unelevated
            no-caps
            flat
          />
          <q-btn
            @click="exclude"
            v-show="dataNotification?.id"
            color="negative"
            label="Excluir"
            icon-right="delete"
            size="md"
            unelevated
            no-caps
          />
          <q-btn
            @click="read"
            v-show="dataNotification?.text && dataNotification.read === 0"
            color="primary"
            label="Marcar como lido"
            icon-right="done_all"
            size="md"
            unelevated
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
