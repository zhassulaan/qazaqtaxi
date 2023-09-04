<template>
    <CommentDialog
        v-model="cancelDialog"
        :title="$t('reason')"
        :type="'cancel'"
        @submit="handleCancelSubmit"
    />
    <APIDialog
        v-model="errorDialog"
        :title="$t('canceled').split(' ').slice(1).join(' ').charAt(0).toUpperCase() + $t('canceled').split(' ').slice(1).join(' ').slice(1)"
        @close-me="handleCancelBooking(); closeDialog();"
    />
    <v-row>
        <v-col class="d-flex flex-row justify-space-between align-center font-weight-medium text-blackish">
            <div v-show="bookingStatus === 1002">{{ $t("arrive") }}</div>
            <div v-show="bookingStatus === 1003">{{ $t("driver_arrived") }}</div>
            <div v-show="bookingStatus === 1004">{{ $t("started") }}</div>
            <div v-show="bookingStatus === 1002 || bookingStatus === 1004">-</div>
            <v-sheet class="bg-brand px-2 rounded-lg"
                v-show="bookingStatus === 1002 || bookingStatus === 1004"
            >
                {{ directionStore.timeEstimate }}
                {{ $t("min") }}
                {{ $t("left") }}
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="d-flex flex-row justify-start align-center pt-0">
            <img :src="driverInfo.avatar" alt="avatar" v-if="driverInfo.avatar" />
            <v-avatar color="graydark" size="large" v-else></v-avatar>
            <div class="font-15 block ml-2">
                <div class="d-flex flex-row align-center justify-space-between">
                    <div class="font-weight-medium">
                        {{ driverInfo.name }}
                    </div>
                    <div class="font-weight-medium d-flex align-center">
                        <div class="star" :style="{ position: 'relative', width: '22.5px', height: '22.5px' }">
                            <v-icon
                                :style="{ opacity: .35 }"
                                icon="mdi-star"
                                color="brand"
                            ></v-icon>
                            <div class="star-mask" :style="{ position: 'absolute', top: 0, width: `${driverInfo.rating * 20 * .8235}%`, overflow: 'hidden' }">
                                <v-icon
                                    :style="{ opacity: 1 }"
                                    icon="mdi-star"
                                    color="brand"
                                ></v-icon>
                            </div>
                        </div>
                        <div>{{ driverInfo.rating }}</div>
                    </div>
                </div>
                <div class="d-flex flex-row align-center justify-space-between">
                    <div class="text-graydarker">
                        {{ driverInfo.carModel }}
                    </div>
                    <div class="font-weight-medium">
                        {{ driverInfo.carNumber }}
                    </div>
                </div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="font-15">
            <div class="d-flex flex-row">
                <div class="nowrap">{{ $t("amount")}}</div>
                <div class="block dotted-line"></div>
                <div class="nowrap">{{ orderStore.price }} ₸</div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="d-flex flex-row justify-space-around align-center">
            <v-btn class="bg-brand"
                icon="mdi-phone"
                size="x-large"
                @click="handleCall()"
            ></v-btn>
            <v-btn class="bg-brand"
                icon="mdi-message"
                size="x-large"
                @click="panelStore.mode = 'chat'"
            ></v-btn>
            <v-btn class="bg-brand"
                icon="mdi-close-thick"
                size="x-large"
                @click="cancelDialog = true"
            ></v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, onMounted } from "vue";
import User from "@/repositories/user";
import { useDirectionsStore } from "@/store/directions";
import { useMapStore } from "@/store/map";
import { useOrderStore } from "@/store/order";
import { useOrderPanelStore } from "@/store/orderPanel";
import { usePanelStore } from "@/store/userPanel";
import APIDialog from "@/components/dialogs/APIDialog.vue";
import CommentDialog from "@/components/dialogs/CommentDialog.vue";

const directionStore = useDirectionsStore();
const mapStore = useMapStore();
const orderStore = useOrderStore();
const orderPanelStore = useOrderPanelStore();
const panelStore = usePanelStore();
const cancelDialog = ref(false);
const driverInfo = ref({});
const bookingStatus = ref(1002);
const driverComingFlag = ref(false);
const roadStartFlag = ref(false);
const errorDialog = ref(false);
const phoneNumber = ref("");

// FUNS
function handleCancelSubmit() {
    // TODO отправка на бэк причины отказа
    cancelDialog.value = false;
    errorDialog.value = true;
}

function handleCancelBooking() {
    directionStore.stopDrawInterval();
    mapStore.pointA = {};
    mapStore.pointB = {};
    mapStore.showLoader = false;
    directionStore.pointA = {};
    directionStore.pointB = {};
    directionStore.debouncedClearDirection();
    clearTimeout(orderPanelStore.checkTimeout);
    CANCEL_ORDER();
}

function closeDialog() {
    panelStore.mode = "stand-by";
    errorDialog.value = false;
}

function handleCall() {
    const link = document.createElement("a");
    link.href = `tel:${phoneNumber.value}`;
    link.click();
}

// ASYNC FUNS
async function GET_BOOKING_DETAILS() {
    try {
        const res = await User.getBookingDetails(orderStore.bookingId);
        console.log("GET_BOOKING_DETAILS", res);
        driverInfo.value = {
            name: res.data.data.driver.fullName,
            rating: res.data.data.driver.rating,
            carModel: `${res.data.data.vehicle_details.vehicle_make} ${res.data.data.vehicle_details.vehicle_model} `,
            carNumber: res.data.data.vehicle_details.vehicle_number,
        };
        phoneNumber.value = res.data.data.driver.phoneNumber;
        console.log(phoneNumber);
        orderStore.driver = { ...driverInfo.value };
    } catch (error) {
        console.log(error);
    }
}

async function CANCEL_ORDER() {
    try {
        const res = await User.cancelBooking(orderStore.bookingId);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

async function CHECK_BOOKING_STATUS() {
    try {
        const res = await User.checkBookingStatus(orderStore.bookingId);
        console.log("CHECK_BOOKING_STATUS", res);
        if (res.data.data.booking_status === "1002") {
            // водитель едет до пассажира
            if (!driverComingFlag.value) {
                driverComingFlag.value = true;
                directionStore.stopDrawInterval();
                directionStore.updatePoints("driver-position");
                directionStore.debouncedDrawDirection();
                directionStore.startDrawInterval("driver-position");
            }
            bookingStatus.value = 1002;
        } else if (res.data.data.booking_status === "1003") {
            // водитель доехал до пассажира
            if (!driverComingFlag.value) {
                driverComingFlag.value = true;
                directionStore.stopDrawInterval();
                directionStore.updatePoints("driver-position");
                directionStore.debouncedDrawDirection();
                directionStore.startDrawInterval("driver-position");
            }
            bookingStatus.value = 1003;
        } else if (res.data.data.booking_status === "1004") {
            // начало поездки А-Б
            if (!roadStartFlag.value) {
                roadStartFlag.value = true;
                directionStore.stopDrawInterval();
                directionStore.updatePoints("my-position");
                directionStore.debouncedDrawDirection();
                directionStore.startDrawInterval("my-position");
            }
            bookingStatus.value = 1004;
        } else if (res.data.data.booking_status === "1005") {
            // конец поездки
            directionStore.stopDrawInterval();
            bookingStatus.value = 1005;
            clearTimeout(orderPanelStore.checkTimeout);
            panelStore.mode = "check";
            return;
        } else if (res.data.data.booking_status === "1007") {
            // отмена водителем во время подъезда
            directionStore.stopDrawInterval();
            bookingStatus.value = 1007;
            clearTimeout(orderPanelStore.checkTimeout);
            errorDialog.value = true;
            orderStore.$reset();
            return;
        }
        orderPanelStore.checkTimeout = setTimeout(CHECK_BOOKING_STATUS, 2000);
    } catch (error) {
        console.log(error);
    }
}

// MOUNTED
onMounted(() => {
    GET_BOOKING_DETAILS();
    CHECK_BOOKING_STATUS();
});
</script>
