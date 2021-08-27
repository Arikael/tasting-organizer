<template>
  <div>
    <q-table title="Tasting Results"
             :pagination="pagination"
             :columns="columns"
             :rows="rows"
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
          <q-td class="text-right">
            {{ props.pageIndex + 1 }}
          </q-td>

          <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
          >
            {{ col.value }}
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
    let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRHmJLjkK8hLoLt35evO0KrFEuBUtBeZo1FNFbIc7Qd2eTwgfhFjmtI8W4MOVm9I0sn2PhKxu2s-J9y/pub?single=true&output=csv";
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

</style>
