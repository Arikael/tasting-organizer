<template>
  <div v-show="!publishId" class="bg-red-1">
    you need to add the publish id of a published google spreadsheet as query parameter<br />
    like "pid=[the pid]"
  </div>
  <div v-show="publishId">
    <p>Click on a row to display all scores for a wine</p>
    <q-table title="Tasting Results"
             :pagination="pagination"
             :columns="columns"
             :rows="rows"
             dense
             table-header-class="table-header"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th text class="text-right">
            Rank
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
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">All Scores: {{ props.row.individualScores.join(', ') }}</div>
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

const resultOptions = {
  defaultSort: 'Avg'
}

export default defineComponent({
  name: 'Results',
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
      rows: [] as any[]
    }
  },
  props: {
    msg: String,
  },
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

</style>
