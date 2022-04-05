import {useRoute} from "vue-router";

export function useScoringUtils() {

    return {
        loadTastingId: () => {
            const route = useRoute()
            let tastingId = ''
            const id = route.params?.id ?? '';
            tastingId = Array.isArray(id) ? id[0] : id

            return tastingId
        }
    }
}