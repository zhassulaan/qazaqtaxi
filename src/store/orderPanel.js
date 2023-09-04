import { ref } from "vue";
import { defineStore } from "pinia";

export const useOrderPanelStore = defineStore(
    "orderPanel",
    () => {
        const checkTimeout = ref(null);

        return {
            checkTimeout,
        };
    }, {
        persist: true,
    }
);
