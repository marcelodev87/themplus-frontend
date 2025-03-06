<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';
import TitlePage from '../shared/TitlePage.vue';

defineOptions({
  name: 'Inbox',
});

const { getInbox, readNotification, readAllNotification, deleteNotification } =
  useUsersMembersStore();
const { loadingUsersMembers, listInbox, notifications } = storeToRefs(
  useUsersMembersStore()
);

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits<{
  'update:open': [void];
}>();

const openOptions = ref<boolean>(true);
const pageCurrent = ref<number>(1);
const totalPerPage = ref<number>(12);
const dataNotification = ref<{
  text: string | null;
  read: number;
  title: string;
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
const selectNotification = (
  text: string,
  title: string,
  read: number,
  id: string
) => {
  dataNotification.value = {
    text,
    title,
    read,
    id,
  };
  openOptions.value = !openOptions.value;
};
const clear = (): void => {
  dataNotification.value = null;
  pageCurrent.value = 1;
};
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);

  const formattedDate = formatter.format(date);

  return formattedDate;
};
const read = async () => {
  const response = await readNotification(dataNotification.value?.id ?? '');
  if (response?.status === 200) {
    notifications.value = response.data.inbox.filter((item) => {
      return item.read === 0;
    }).length;
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
const readAll = async () => {
  const response = await readAllNotification();
  if (response?.status === 200) {
    notifications.value = response.data.inbox.filter((item) => {
      return item.read === 0;
    }).length;
    clear();
  }
};

const existAnyForRead = computed(() => {
  return listInbox.value.some((item) => !item.read);
});
const listInboxPage = computed(() => {
  const start = (pageCurrent.value - 1) * totalPerPage.value;
  const end = start + totalPerPage.value;
  return listInbox.value.slice(start, end);
});

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
          :limits="openOptions ? [300, 300] : [0, 0]"
        >
          <template v-slot:before>
            <q-list dense separator class="column justify-around">
              <q-item
                v-for="(item, index) in listInboxPage"
                :key="index"
                clickable
                dense
                @click="
                  selectNotification(item.text, item.title, item.read, item.id)
                "
                :class="item.read ? 'bg-grey-4 opacity-50' : ''"
                :active="isActive(item.id)"
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
                    <span :class="item.read ? 'text-bold' : ''">
                      {{ item.title }}
                    </span>
                    <span
                      class="text-caption"
                      :class="item.read ? 'text-bold' : ''"
                    >
                      {{ formatDate(item.created_at) }}
                    </span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </template>

          <template v-slot:after>
            <div @click="openOptions = !openOptions" class="full-height">
              <p v-if="dataNotification" class="border-bottom text-h6 q-pa-sm">
                {{ dataNotification?.title }}
              </p>
              <p class="text-subtitle1 q-pa-sm">
                {{
                  dataNotification === null
                    ? 'Não foi selecionado nenhuma notificação'
                    : dataNotification.text
                }}
              </p>
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
      <q-card-actions class="border-top row justify-between items-center">
        <div>
          <q-pagination
            v-show="listInbox.length / totalPerPage >= 2 && openOptions"
            v-model="pageCurrent"
            :max="listInbox.length / totalPerPage"
            direction-links
            flat
            color="black"
            active-color="primary"
            unelevated
            gutter="md"
            :max-pages="5"
          />
        </div>
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
            :loading="loadingUsersMembers"
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
            :loading="loadingUsersMembers"
          />
          <q-btn
            @click="readAll"
            v-show="existAnyForRead"
            color="secondary"
            label="Marcar todas como lido"
            icon-right="done_all"
            size="md"
            unelevated
            no-caps
            :loading="loadingUsersMembers"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
