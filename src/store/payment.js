import { ref } from "vue";
import { defineStore } from "pinia";

export const usePaymentStore = defineStore(
    "payment",
    () => {
        const paymentId = ref(1);
        const isCard = ref(false);
        return { isCard, paymentId };
    }, {
        persist: true,
    }
);
