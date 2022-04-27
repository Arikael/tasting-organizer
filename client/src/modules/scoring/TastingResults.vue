<template>
  <div v-if="isTastingResultLoaded">
    <div class="content-box content-box--padding">
      <h2 class="text-subtitle1 content-box__title">{{ store.state.tastingResults.tasting.title }}</h2>
      <span class="text-caption"><q-icon name="today" class="q-mr-xs"></q-icon>{{ tastingDate }}</span>
      <div class="text-caption q-pt-md">
        {{ $t('tastingInfoTitle') }}<br/>
        <q-badge color="orange">{{ $t('orange') }}</q-badge>
        {{ $t('tastingInfoLowDesc') }},
        <q-badge color="green">{{ $t('green') }}</q-badge>
        {{ $t('tastingInfoHighDesc') }}
      </div>
    </div>
    <q-table :pagination="pagination"
             :columns="columns"
             :rows="store.state.tastingResults.wineResults"
             :dense="$q.screen.lt.md"
             row-key="wine"
             table-header-class="table-header">
      <template v-slot:top v-if="hasCurrentUser">
        <q-toggle v-model="filterMyScores" color="accent" class="text-caption"
                  :label="$t('showOnlyMyScores')" @update:model-value="toggleMyScores"></q-toggle>
      </template>
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
              @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'">
            <tasting-result-cell v-if="typeof col.value == 'number'" :value="col.value"
                                 :name="col.name"></tasting-result-cell>
            <template v-else>{{ col.value }}</template>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <tasting-result-detail-row :scores="props.row.scores"></tasting-result-detail-row>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue';
import TastingResultCell from '@/modules/scoring/TastingResultCell.vue';
import {store} from '@/store';
import {QBadge, QIcon, QTable, QTd, QTh, QTr} from 'quasar';
import {SingleTastingResultDto} from '@/api/types'
import {useI18n} from "vue-i18n";
import TastingResultDetailRow from "@/modules/scoring/TastingResultDetailRow.vue";
import {useUtils} from "@/lib/useUtils";

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
  components: {TastingResultDetailRow, TastingResultCell, QTable, QTd, QTr, QTh, QBadge, QIcon},
  setup() {
    const i18n = useI18n({useScope: 'global'})

    onMounted(async () => {
      const id = useUtils().loadTastingIdFromBrowser();
      await store.actions.loadTastingResults(id, false)
    })

    let filterMyScores = ref(false)

    return {
      hasCurrentUser: computed(() => store.getters.currentUser.value.length > 0),
      filterMyScores,
      toggleMyScores: (toggle: boolean, evt: any) => {
        filterMyScores.value = toggle
        store.actions.loadTastingResults(store.state.tastingResults.tasting.publicId, toggle).then()
      },
      isTastingResultLoaded: store.getters.isTastingResultLoaded,
      tastingDate: computed(() => store.state.tastingResults.tasting.date.toDateString()),
      t: i18n,
      store: store,
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
          label: i18n.t('WineNr')
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
        },
        {
          name: 'price',
          field: ((row: SingleTastingResultDto) => row.wine.price),
          label: i18n.t('price'),
          sortable: true
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
