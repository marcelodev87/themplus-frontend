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
const selectNotification = async (
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
};
const clear = (): void => {
  dataNotification.value = null;
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
const existAnyForRead = computed(() => {
  return listInbox.value.some((item) => !item.read);
});
const readAll = async () => {
  const response = await readAllNotification();
  if (response?.status === 200) {
    notifications.value = response.data.inbox.filter((item) => {
      return item.read === 0;
    }).length;
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
          :limits="[300, 300]"
        >
          <template v-slot:before>
            <q-list dense separator>
              <q-item
                v-for="(item, index) in listInbox"
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
            <div>
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
