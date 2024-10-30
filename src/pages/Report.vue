<script setup lang="ts">
import TitlePage from 'src/components/shared/TitlePage.vue';
import ReportFilterMonth from 'src/components/filters/ReportFilterMonth.vue';
import ReportFilterPeriod from 'src/components/filters/ReportFilterPeriod.vue';
import { ref } from 'vue';

defineOptions({
  name: 'Report',
});

const showReportFilterMonth = ref<boolean>(false);
const showReportFilterPeriod = ref<boolean>(false);

const openReportFilterMonth = (): void => {
  showReportFilterMonth.value = true;
};
const closeReportFilterMonth = (): void => {
  showReportFilterMonth.value = false;
};
const openReportFilterPeriod = (): void => {
  showReportFilterPeriod.value = true;
};
const closeReportFilterPeriod = (): void => {
  showReportFilterPeriod.value = false;
};
</script>
<template>
  <section>
    <header class="row justify-between no-wrap bg-grey-1">
      <div class="col-5">
        <TitlePage title="Gerenciamento de relatórios" />
      </div>
      <div class="col-7 row items-center justify-end q-gutter-x-sm">
        <q-btn
          @click="openReportFilterMonth"
          color="blue-8"
          icon-right="filter_alt"
          label="Mês"
          class="q-mr-sm"
          unelevated
          no-caps
        />
        <q-btn
          @click="openReportFilterPeriod"
          color="blue-8"
          icon-right="filter_alt"
          label="Período"
          class="q-mr-sm"
          unelevated
          no-caps
        />
      </div>
    </header>
    <main>
      <ReportFilterMonth
        :open="showReportFilterMonth"
        @update:open="closeReportFilterMonth"
      />
      <ReportFilterPeriod
        :open="showReportFilterPeriod"
        @update:open="closeReportFilterPeriod"
      />
    </main>
  </section>
</template>
