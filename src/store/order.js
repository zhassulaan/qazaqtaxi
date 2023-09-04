import { ref } from "vue";
import { defineStore } from "pinia";

export const useOrderStore = defineStore(
    "order",
    () => {
        const bookingId = ref(null);
        const price = ref(null);
        const driver = ref({});
        const order = ref({});
        const timeEstimate = ref("");
        const distanceEstimate = ref("");
        const pointA = ref({});
        const pointB = ref({});
        const isRated = ref(false);
        const rating = ref(null);
        const areaId = ref(null);
        const carId = ref(null);

        function $reset() {
            bookingId.value = null;
            price.value = null;
            driver.value = {};
            order.value = {};
            timeEstimate.value = "";
            distanceEstimate.value = "";
            pointA.value = {};
            pointB.value = {};
            isRated.value = false;
            rating.value = null;
            areaId.value = null;
            carId.value = null;
        }

        return {
            timeEstimate,
            distanceEstimate,
            bookingId,
            price,
            driver,
            order,
            pointA,
            pointB,
            isRated,
            rating,
            areaId,
            $reset,
            carId
        };
    }, {
        persist: true,
    }
);
