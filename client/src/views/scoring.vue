<template>
  <scoring-container :tasting-id="tastingId"></scoring-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ScoringContainer from "@/modules/scoring/ScoringContainer.vue";
import feathers from "@feathersjs/feathers";
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client';

export default defineComponent({
  name: "scoring",
  components: {ScoringContainer},
  setup(props) {
    const socket = io('http://localhost:3030');
    const client = feathers();
    client.configure(socketio(socket))
    client.service('tasting').get('tdf')

    return {
      tastingId: "sdf"
    }
  }
})
</script>

<style scoped>

</style>