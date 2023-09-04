<template>
    <ThankDialog
        v-model="thankDialog"
        @close-me="thankDialog = false"
    />
    <PaymentMethodDialog
        v-model="paymentMethodDialog"
        @close-me="paymentMethodDialog = false"
    />
    <APIDialog
        v-model="cancelDialog"
        :title="cancelDialogText"
        @close-me="handleCancelDialog()"
    />
    <v-row v-show="mode === 'stand-by' || mode === 'pick-car' || mode === 'pre-order'">
        <v-col class="pb-0">
            <v-text-field
                :label="$t('from')"
                variant="outlined"
                prepend-inner-icon="mdi-map-marker"
                hide-details
                v-model="pointAName"
                readonly
                @click="mode !== 'pre-order' ? setInput('A') : null"
                id="firstInput"
                style="background: #F5F5F5; box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, .25);"
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row v-show="mode === 'stand-by' || mode === 'pick-car' || mode === 'pre-order'">
        <v-col>
            <v-text-field
                :label="$t('to')"
                variant="outlined"
                prepend-inner-icon="mdi-arrow-top-left-thick"
                hide-details
                v-model="pointBName"
                readonly
                @click="mode !== 'pre-order' ? setInput('B') : null"
                id="secondInput"
                style="background: #F5F5F5; box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, .25);"
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row v-show="mode === 'pick-car'">
        <v-col class="py-0">
            <v-slide-group v-model="carSelect" mandatory>
                <v-slide-group-item
                    v-for="taxi in carGroup"
                    :key="taxi.id"
                    v-slot="{ isSelected, toggle }"
                >
                    <div
                        @click="toggle"
                        class="price-item px-2 font-13 font-weight-medium"
                        :class="{ 'selected-car': isSelected }"
                    >
                        <div class="car-img">
                            <img style="margin-inline: auto; display: block;" :src="taxi.vehicleTypeImage" />
                        </div>
                        <div class="text-center">{{ taxi.vehicleTypeName }}</div>
                        <div class="text-center" style="font-size: 15px">{{ calcDrivePrice(taxi.estimate_fare) }}</div>
                    </div>
                </v-slide-group-item>
            </v-slide-group>
        </v-col>
    </v-row>
    <v-row v-show="mode === 'stand-by' || mode === 'pick-car'">
        <v-col cols="3">
            <v-btn
                height="60"
                class="round bg-brand font-weight-bold"
                block
                @click="paymentMethodDialog = true"
            >
                <img src="@/assets/card.svg" alt="card" />
            </v-btn>
        </v-col>
        <v-col>
            <v-btn
                block
                height="60"
                class="round bg-brand font-weight-bold text-white"
                @click="makeOrder()"
            >
                <span class="text-white">{{ $t("order") }}</span>
            </v-btn>
        </v-col>
    </v-row>
    <v-row v-show="mode === 'pre-order'">
        <v-col class="d-flex justify-center">
            <v-btn
                prepend-icon="mdi-close"
                class="round"
                color="brand"
                size="large"
                @click="handleOrderCancel()"
            >
                {{ $t("cancel") }}
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import User from "@/repositories/user";
import router from "@/router";
import { useDirectionsStore } from "@/store/directions";
import { useMapStore } from "@/store/map";
import { useOrderStore } from "@/store/order";
import { usePaymentStore } from "@/store/payment";
import { useSearchStore } from "@/store/search";
import { usePanelStore } from "@/store/userPanel";
import APIDialog from "@/components/dialogs/APIDialog.vue";
import PaymentMethodDialog from "@/components/dialogs/PaymentMethodDialog.vue";
import ThankDialog from "@/components/dialogs/ThankDialog.vue";

const directionStore = useDirectionsStore();
const orderStore = useOrderStore();
const paymentStore = usePaymentStore();
const searchStore = useSearchStore();
const mapStore = useMapStore();
const panelStore = usePanelStore();
const { point, pointA, pointB, pointAName, pointBName } = storeToRefs(mapStore);
const { mode } = storeToRefs(panelStore);
const i18n = useI18n();

const thankDialog = ref(false);
const paymentMethodDialog = ref(false);
const carSelect = ref(0);
const carGroup = ref(undefined);
const driverFinder = ref(undefined);
const checkoutId = ref(null);
const statusTimeout = ref(null);
const cancelDialog = ref(false);
const cancelDialogText = ref("");
const blockOrder = ref(true);

onMounted(() => {
    if (mode.value === "pick-car") {
        mode.value = "stand-by";
    }
    if (mode.value === "pre-order") {
        mapStore.pointA = { ...orderStore.pointA };
        mapStore.pointB = { ...orderStore.pointB };
        mapStore.pointAName = orderStore.pointA.name;
        mapStore.pointBName = orderStore.pointB.name;
        directionStore.triggerPositionMap();
        if (orderStore.bookingId === null) {
            mapStore.showLoader = true;
            FIND_DRIVER();
        } else {
            CHECK_BOOKING_STATUS();
        }
    }
    if (mode.value === "stand-by") {
        document.getElementById("firstInput").focus();
    }
});

const checkInput = computed(() => {
    return Boolean(
        Object.keys(pointA.value).length !== 0 &&
        Object.keys(pointB.value).length !== 0 &&
        pointA.value.name !== pointB.value.name
    );
});

watch(
    mode,
    () => {
        if (mode.value === "stand-by") {
            searchStore.focusInput = "A";
            searchStore.readPointer = true;
        }
    }, {
        immediate: true,
    }
);

// WATCHERS
watch(
    checkInput,
    () => {
        if (checkInput.value) {
            directionStore.pointA = { ...mapStore.pointA };
            directionStore.pointB = { ...mapStore.pointB };
            directionStore.debouncedDrawDirection();
            if (mode.value !== "pre-order") {
                GET_CARS();
            }
        } else {
            blockOrder.value = true;
        }
    }, {
        immediate: true,
    }
);

watch(
    point,
    () => {
        if (!searchStore.readPointer) {
            return;
        }
        if (searchStore.focusInput === "A") {
            pointA.value = { ...point.value };
        } else if (searchStore.focusInput === "B") {
            pointB.value = { ...point.value };
        }
        if (
            Object.keys(pointA.value).length &&
            Object.keys(pointB.value).length
        ) {
            directionStore.pointA = { ...mapStore.pointA };
            directionStore.pointB = { ...mapStore.pointB };
            directionStore.debouncedDrawDirection();
        }
    }, {
        immediate: true,
    }
);

// FUNS
function setInput(str) {
    if (str === "A") {
        pointAName.value = '';
        pointA.value = {};
        // document.getElementById("firstInput").focus();
    } else if (str === "B") {
        pointBName.value = '';
        pointB.value = {};
        // document.getElementById("secondInput").focus();
    }
    if (mode.value === "pre-order") {
        return;
    }
    mode.value = "stand-by";
    searchStore.showPanel = true;
    searchStore.readPointer = false;
    searchStore.focusInput = str;
    router.push({ name: "SearchResults" });
}

function makeOrder() {
    try {   
        console.log('trying to make an order')
        mode.value = "pre-order";

        mapStore.showLoader = true;
        directionStore.triggerPositionMap();
        orderStore.pointB = { ...mapStore.pointB };
        orderStore.pointA = { ...mapStore.pointA };
        orderStore.carId = carGroup.value[carSelect.value].id;
        console.log(`carGroup.value[carSelect.value].estimate_fare ${carGroup.value[carSelect.value].estimate_fare}`);
        orderStore.price = Number(
            carGroup.value[carSelect.value].estimate_fare.toString().split(" ")[0]
        );
    
        console.log(orderStore);
        try {
            FIND_DRIVER();
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
}

function handleOrderCancel() {
    pointA.value = {};
    pointB.value = {};
    mapStore.showLoader = false;
    clearTimeout(driverFinder.value);
    directionStore.debouncedClearDirection();
    CANCEL_ORDER();
    cancelDialogText.value = i18n.t("canceled");
    cancelDialog.value = true;
    orderStore.$reset();
}

function handleCancelDialog() {
    cancelDialog.value = false;
    mapStore.showLoader = false;
    mode.value = "stand-by";
    orderStore.$reset();
}

function calcDrivePrice(str) {
    if (paymentStore.isCard) {
        let [val, sign] = str.split(" ");
        return `${Math.ceil(Number(val) * 1.05)} ${sign}`;
    }
    return str;
}

function create2gisLink(point) {
    return `https://2gis.kz/almaty/geo/${point.building_id}/${point.coordinates[0]},${point.coordinates[1]}`;
}

// ASYNC FUNS
async function GET_CARS() {
    const payload = {
        latitude: `${pointA.value.coordinates[1]}`,
        segment_id: 1,
        drop_location: JSON.stringify([
            {
                stop: 1,
                drop_latitude: `${pointB.value.coordinates[1]}`,
                drop_longitude: `${pointB.value.coordinates[0]}`,
                drop_location: pointB.value.name,
            },
        ]),
        longitude: `${pointA.value.coordinates[0]}`,
    };
    try {
        const res = await User.getCars(payload);
        console.log('CARS RESULT ', res);
        orderStore.areaId = res.data.data.response_data.id;
        carGroup.value = res.data.data.response_data.service_types[0].vehicles;
        mode.value = "pick-car";
        blockOrder.value = false;
    } catch (error) {
        console.log(error);
    }
}

async function FIND_DRIVER() {
    try {
        const payload = {
            area: orderStore.areaId,
            service_type: 1,
            distance: 5,
            latitude: `${orderStore.pointA.coordinates[1]}`,
            vehicle_type: orderStore.carId,
            segment_id: 1,
            longitude: `${orderStore.pointA.coordinates[0]}`,
        };
        console.log('trying to find driver = '+payload);
    
        const res = await User.findDriver(payload);
        if (res.data.message === "Data not found") {
            driverFinder.value = setTimeout(() => {
                FIND_DRIVER();
            }, 4000);
        } else {
            CHECK_DROP_AREA();
        }
    } catch (error) {
        console.log(error);
    }
}

async function CHECK_DROP_AREA() {
    try {
        const payload = {
            service_type: 1,
            area_id: orderStore.areaId,
            latitude: `${pointB.value.coordinates[1]}`,
            longitude: `${pointB.value.coordinates[0]}`,
        };
        await User.checkDropArea(payload);
        CHECKOUT_RIDE();
    } catch (error) {
        console.log(error);
    }
}

async function CHECKOUT_RIDE() {
    try {
        const payload = {
            total_ride_amount: orderStore.price,
            area: orderStore.areaId,
            later_time: null,
            service_package_id: null,
            pickup_longitude: orderStore.pointA.coordinates[0],
            vehicle_type: orderStore.carId,
            total_drop_location: 1,
            service_type: 1,
            pickup_latitude: orderStore.pointA.coordinates[1],
            later_date: null,
            booking_type: 1,
            pick_up_location: orderStore.pointA.name,
            segment_id: 1,
            number_of_rider: 0,
            drop_location: JSON.stringify([
                {
                    stop: 1,
                    drop_latitude: orderStore.pointB.coordinates[1],
                    drop_longitude: orderStore.pointB.coordinates[0],
                    drop_location: orderStore.pointB.name,
                    status: 1,
                },
            ]),
        };
        const res = await User.checkoutRide(payload);
        checkoutId.value = res.data.data.id;
        orderStore.timeEstimate = res.data.data.estimate_time;
        orderStore.distanceEstimate = res.data.data.estimate_distance;
        CHECK_PAYMENT();
    } catch (error) {
        console.log(error);
    }
}

async function SEND_2GIS_LINK() {
    try {
        const payload = {
            booking_id: orderStore.bookingId,
            point_a_link: create2gisLink(orderStore.pointA),
            point_b_link: create2gisLink(orderStore.pointB),
        };
        await User.sendNavigatorLinks(payload);
        CHECK_BOOKING_STATUS();
    } catch (error) {
        console.log(error);
    }
}

async function CHECK_PAYMENT() {
    try {
        await User.checkoutPayment({
            checkout: checkoutId.value,
            payment_method_id: 1,
            // payment_method_id: paymentStore.paymentId === 0 ? 1 : 2,
            // card_id: paymentStore.paymentId,
        });
        CONFIRM_BOOKING();
    } catch (error) {
        console.log(error);
    }
}

async function CONFIRM_BOOKING() {
    try {
        const payload = {
            segment_id: 1,
            checkout: checkoutId.value,
        };
        const res = await User.confirmBooking(payload);
        orderStore.bookingId = res.data.data.id;
        console.log("CONFIRM_BOOKING", orderStore.bookingId);
        SEND_2GIS_LINK();
    } catch (error) {
        mapStore.showLoader = false;
        console.log(error);
    }
}

async function CHECK_BOOKING_STATUS() {
    try {
        mapStore.showLoader = true;
        const res = await User.checkBookingStatus(orderStore.bookingId);
        console.log("CHECK_BOOKING_STATUS", res);
        if (res.data.data.booking_status === "1016") {
            FIND_DRIVER();
            clearTimeout(statusTimeout.value);
        } else if (res.data.data.booking_status === "1002") {
            mapStore.showLoader = false;
            mode.value = "order-in-progress";
            clearTimeout(statusTimeout.value);
        } else {
            statusTimeout.value = setTimeout(CHECK_BOOKING_STATUS, 2000);
        }
    } catch (error) {
        console.log(error);
    }
}

async function CANCEL_ORDER() {
    try {
        await User.cancelPreBooking(orderStore.bookingId);
    } catch (error) {
        console.log(error);
    }
}
</script>

<style lang="scss" scoped>
.round {
    border-radius: 10px;
}

.car-img {
    width: 80px;
    height: 60px;
    overflow: hidden;
}

.car-img img {
    width: auto;
    height: 100%;
    object-position: center;
    object-fit: cover;
}
.selected-car {
    border-bottom: 2px solid rgb(var(--v-theme-brand));
}
</style>
