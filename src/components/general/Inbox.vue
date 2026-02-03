<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersMembersStore } from 'src/stores/users-store';
import { NotificationUser } from 'src/ts/interfaces/data/Notifications';
import { Inbox } from 'src/ts/interfaces/data/Inbox';

defineOptions({
  name: 'Inbox',
});

const { getInbox, readNotification, readAllNotification, deleteNotification } =
  useUsersMembersStore();
const { loadingUsersMembers, listInbox, notifications } = storeToRefs(
  useUsersMembersStore()
);

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ 'update:open': [void] }>();

const pageCurrent = ref<number>(1);
const totalPerPage = ref<number>(10);
const dataNotification = ref<{
  text: string | null;
  read: number;
  title: string;
  id: string;
  created_at?: string;
} | null>(null);
const splitterModel = ref<number>(350);

const open = computed({
  get: () => props.open,
  set: () => emit('update:open'),
});

const selectNotification = (item: Inbox) => {
  dataNotification.value = { ...item };
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const read = async () => {
  const response = await readNotification(dataNotification.value?.id ?? '');
  if (response?.status === 200) {
    notifications.value = response.data.inbox.filter(
      (item: NotificationUser) => item.read === 0
    ).length;
    dataNotification.value = null;
  }
};

const exclude = async () => {
  const response = await deleteNotification(dataNotification.value?.id ?? '');
  if (response?.status === 200) dataNotification.value = null;
};

const readAll = async () => {
  const response = await readAllNotification();
  if (response?.status === 200) {
    notifications.value = 0;
    dataNotification.value = null;
  }
};

const existAnyForRead = computed(() =>
  listInbox.value.some((item) => !item.read)
);
const listInboxPage = computed(() => {
  const start = (pageCurrent.value - 1) * totalPerPage.value;
  return listInbox.value.slice(start, start + totalPerPage.value);
});

watch(
  open,
  async () => {
    if (open.value) {
      dataNotification.value = null;
      await getInbox();
    }
  },
  { immediate: true }
);
</script>

<template>
  <q-dialog
    v-model="open"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card
      class="column no-wrap shadow-24"
      style="width: 900px; max-width: 98vw; height: 600px"
    >
      <q-card-section class="q-pa-none bg-contabilidade text-white">
        <div class="row items-center q-pa-md">
          <q-icon name="mail" size="sm" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">Centro de Notificações</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-none col row no-wrap bg-white">
        <div
          v-if="listInbox.length === 0 && !loadingUsersMembers"
          class="full-width column flex-center text-grey-6"
        >
          <q-icon name="auto_stories" size="100px" color="grey-3" />
          <div class="text-h6 q-mt-md">Tudo limpo por aqui!</div>
          <p>Você não possui notificações no momento.</p>
        </div>

        <q-splitter v-else v-model="splitterModel" unit="px" class="full-width">
          <template v-slot:before>
            <q-list class="bg-grey-1 full-height overflow-auto">
              <q-item
                v-for="item in listInboxPage"
                :key="item.id"
                clickable
                @click="selectNotification(item)"
                :active="dataNotification?.id === item.id"
                active-class="bg-red-1 text-red"
                class="border-bottom q-py-md"
              >
                <q-item-section avatar min-width="40px">
                  <q-icon
                    :name="item.read ? 'drafts' : 'mail'"
                    :color="item.read ? 'grey-5' : 'red'"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    :class="!item.read ? 'text-weight-bold' : 'text-grey-7'"
                  >
                    {{ item.title }}
                  </q-item-label>
                  <q-item-label caption :class="!item.read ? 'text-red' : ''">
                    {{ formatDate(item.created_at) }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side v-if="!item.read">
                  <div class="unread-dot" />
                </q-item-section>
              </q-item>
            </q-list>
          </template>

          <template v-slot:after>
            <div v-if="dataNotification" class="column full-height bg-white">
              <div class="q-pa-lg border-bottom">
                <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">
                  {{ dataNotification.title }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ formatDate(dataNotification.created_at || '') }}
                </div>
              </div>
              <q-scroll-area class="col q-pa-lg">
                <div class="text-body1 text-grey-8 line-height-relaxed">
                  {{ dataNotification.text }}
                </div>
              </q-scroll-area>
            </div>

            <div v-else class="full-height flex flex-center text-grey-5 column">
              <q-icon name="mark_as_unread" size="80px" />
              <p class="q-mt-md text-subtitle1">
                Selecione uma notificação para ler
              </p>
            </div>
          </template>
        </q-splitter>

        <q-inner-loading :showing="loadingUsersMembers">
          <q-spinner-tail color="primary" size="3em" />
        </q-inner-loading>
      </q-card-section>

      <q-separator />

      <q-card-actions class="bg-grey-1 q-pa-md row justify-between">
        <q-pagination
          v-if="listInbox.length > totalPerPage"
          v-model="pageCurrent"
          :max="Math.ceil(listInbox.length / totalPerPage)"
          direction-links
          flat
          color="primary"
          size="sm"
        />
        <div v-else />

        <div class="row q-gutter-x-sm">
          <q-btn flat label="Fechar" color="red" v-close-popup no-caps />

          <q-btn
            v-if="dataNotification?.id"
            unelevated
            color="negative"
            label="Excluir"
            icon="delete_outline"
            @click="exclude"
            no-caps
          />

          <q-btn
            v-if="dataNotification?.read === 0"
            unelevated
            color="primary"
            label="Marcar como lido"
            icon="done_all"
            @click="read"
            no-caps
          />

          <q-btn
            v-if="existAnyForRead"
            unelevated
            color="secondary"
            label="Ler todas"
            icon="checklist"
            @click="readAll"
            no-caps
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.line-height-relaxed {
  line-height: 1.6;
  white-space: pre-line;
}
.unread-dot {
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}
.full-height {
  height: 100%;
}
</style>
