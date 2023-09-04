import { ref } from "vue";
import { defineStore } from "pinia";

export const usePanelStore = defineStore(
    "userPanel",
    () => {
        const mode = ref("");
        // MODES:
        // stand-by
        // pick-car
        // pre-order

        return { mode };
    }, {
        persist: true,
    }
);
