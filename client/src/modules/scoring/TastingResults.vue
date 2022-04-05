<template>
  <div v-show="state.tastingResults">
    <div class="message-box info-box q-mb-md text-caption">
      {{ $t('tastingInfoTitle') }}<br/>
      <q-badge color="orange">{{ $t('orange') }}</q-badge>
      {{ $t('tastingInfoLowDesc') }},
      <q-badge color="green">{{ $t('green') }}</q-badge>
      {{ $t('tastingInfoHighDesc') }}
    </div>
    <q-table :title="state.tastingResults.tasting.title"
             :pagination="pagination"
             :columns="columns"
             :rows="state.tastingResults.wineResults"
             :dense="$q.screen.lt.md"
             row-key="wine"
             table-header-class="table-header"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th text class="text-right">
            {{ $t('Rank') }}
          </q-th>
          <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
              class="text-right rank-nr"
              @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'">
            {{ props.pageIndex + 1 }}
          </q-td>
          <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'"
          >
            <tasting-result-cell v-if="typeof col.value == 'number'" :value="col.value"
                                 :name="col.name"></tasting-result-cell>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">{{ $t('AllScores') }}: {{ props.row.scores.join(', ') }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import TastingResultCell from '@/modules/scoring/TastingResultCell.vue';
import {store} from '@/store';
import {QBadge, QTable, QTd, QTh, QTr} from 'quasar';
import {SingleTastingResultDto} from '@/api/types'
import {useI18n} from "vue-i18n";

const resultOptions = {
  defaultSort: 'avg'
}

export default defineComponent({
  name: 'TastingResults',
  props: {
    tastingId: {
      type: String,
      default: ''
    }
  },
  components: {TastingResultCell, QTable, QTd, QTr, QTh, QBadge},
  setup(props) {
    const state = store.state
    const i18n = useI18n({useScope: 'global'})

    onMounted(async () => {
      await store.actions.loadTastingResults(props.tastingId)
    })

    return {
      t: i18n,
      state: store.state,
      pagination: {
        sortBy: resultOptions.defaultSort,
        descending: true,
        rowsPerPage: 100
      },
      columns: [{
        name: 'wine',
        field: ((row: SingleTastingResultDto) => row.wine.name),
        sortable: true,
        label: i18n.t('Wine')
      },
        {
          name: 'wineNr',
          field: ((row: SingleTastingResultDto) => row.wine.wineNr),
          sortable: true,
          label: i18n.t('WineNr'),
          //format: (val: string) => i18n.t('Wine') + ' ' + val
        },
        {
          name: 'avg',
          sortOrder: 'da',
          field: ((row: SingleTastingResultDto) => row.avg),
          label: i18n.t('Avg'),
          sortable: true,
          format: (val: number) => Math.round(val)
        },
        {
          name: 'max',
          field: ((row: SingleTastingResultDto) => row.max),
          label: i18n.t('Max'),
          sortable: true,
          format: (val: number) => Math.round(val)
        },
        {
          name: 'min',
          field: ((row: SingleTastingResultDto) => row.min),
          label: i18n.t('Min'),
          sortable: true,
          format: (val: number) => Math.round(val)
        },
        {
          name: 'stddev',
          field: ((row: SingleTastingResultDto) => row.stddev),
          label: i18n.t('Stddev'),
          sortable: true,
          format: (val: number) => Math.round(val)
        }
      ],
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../styles/quasar.variables";

.q-table th,
.table-header {
  text-transform: uppercase;
}

.q-table td {
  cursor: pointer;
}

.rank-nr {
  color: indianred;
}

.message-box {
  border-left-width: 6px;
  border-left-style: solid;
  padding: map-get($space-sm, "x") map-get($space-sm, "y");
}

.info-box {
  border-color: $blue-5;
  background: $grey-2;
}

.error-box {
  border-color: $red-8;
  background: $red-1;
  color: $red-8;
}

</style>
