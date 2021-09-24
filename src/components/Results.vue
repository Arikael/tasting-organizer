<template>
  <div v-show="!publishId" class="message-box error-box">
    {{ $t('noPidError') }}
  </div>
  <div v-show="publishId">
    <div class="message-box info-box q-mb-md text-caption">
      {{ $t('tastingInfoTitle') }}<br/>
      <q-badge color="orange">{{ $t('orange') }}</q-badge>
      {{ $t('tastingInfoLowDesc') }},
      <q-badge color="green">{{ $t('green') }}</q-badge>
      {{ $t('tastingInfoHighDesc') }}
    </div>
    <q-table title="Pinot Noir Tasting"
             :pagination="pagination"
             :columns="columns"
             :rows="rows"
             :dense="$q.screen.lt.md"
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
            {{ $t(col.label) }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" :key="`m_${props.row.index}`">
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
            <result-cell :value="col.value"
                         :high-score="results.highScores[col.name]"
                         :low-score="results.lowScores[col.name]"></result-cell>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">{{ $t('AllScores') }}: {{ props.row.individualScores.join(', ') }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import * as Papa from 'papaparse'
import {ParseError, ParseResult} from "papaparse";
import {
  ResultSet,
  transformDataSet
} from "@/data-transformer";
import ResultCell from "@/components/ResultCell.vue";

const resultOptions = {
  defaultSort: 'Avg'
}

export default defineComponent({
  name: 'Results',
  components: {ResultCell},
  data() {
    return {
      publishId: "" as string | null,
      results: new ResultSet(),
      pagination: {
        sortBy: resultOptions.defaultSort,
        descending: true,
        rowsPerPage: 100
      },
      columns: [] as any[],
      rows: [] as any[],
      bestOfThree: [] as string[]
    }
  },
  computed: {},
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    this.publishId = urlParams.get('pid');

    if (!this.publishId) {
      return
    }

    let url = `https://docs.google.com/spreadsheets/d/e/${this.publishId}/pub?single=true&output=csv`;
    Papa.parse(url, {
      download: true,
      header: false,
      dynamicTyping: true,
      error(error: ParseError) {
        console.log(error)
      },
      complete: (results: ParseResult<unknown>) => {
        this.results = transformDataSet(results)

        for (const header of this.results.headers) {
          this.columns.push({
            name: header,
            label: header,
            field: header,
            sortable: true
          })
        }

        this.rows = this.results.items
      }
    })
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "/src/styles/quasar.variables";

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
