<template>
    <div>
        <Map class="map" :style="{ height: mapHeight }" />
        <ClientPanel class="bottom-panel"
            :style="{ height: `${panelHeight}px` }"
        >
            <template v-slot:toggler>
                <v-sheet class="bg-graydark rounded-lg toggler"
                    width="50"
                    height="5"
                ></v-sheet>
            </template>
            <template v-slot:content>
                <component :is="interfaces[currentInterface]" />
            </template>
        </ClientPanel>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Driver from "@/repositories/driver";
import { useDriverDataStore } from "@/store/driverData";
import { useMapStore } from "@/store/map";
import { usePanelStore } from "@/store/userPanel";
import ClientPanel from "@/components/ClientPanel.vue";
import Map from "@/components/DriverMap.vue";
import ChatInterface from "@/components/interfaces/ChatInterface.vue";
import DriverCheckInterface from "@/components/interfaces/DriverCheckInterface.vue";
import DriverReadyInterface from "@/components/interfaces/DriverReadyInterface.vue";
import DriverRequestInterface from "@/components/interfaces/DriverRequestInterface.vue";
import DriverStandByInterface from "@/components/interfaces/DriverStandByInterface.vue";
import DriverToInterface from "@/components/interfaces/DriverToInterface.vue";

const driverDataStore = useDriverDataStore();
const mapStore = useMapStore();
const panelStore = usePanelStore();
const { mode } = storeToRefs(panelStore);
const panelHeight = ref(230);
const panelHeightConst = ref(0.85);
const currentInterface = ref("");
const togglePanel = ref(true);
const interfaces = {
    ChatInterface,
    DriverCheckInterface,
    DriverReadyInterface,
    DriverRequestInterface,
    DriverStandByInterface,
    DriverToInterface,
};

const mapHeight = computed(() => {
    if (togglePanel.value) {
        return `calc(100vh - ${panelHeight.value}px + 40px)`;
    }
    return "calc(100vh + 20px)";
});

const panelOffset = computed(() => {
    if (togglePanel.value) {
        return 0;
    }
    return -panelHeight.value * panelHeightConst.value;
});

onMounted(() => {
    driverDataStore.updatePoint();
    GET_DRIVER_DATA();
    GET_VEHICLE_DATA();
});

async function GET_DRIVER_DATA() {
    try {
        const res = await Driver.getDriverData();
        console.log(res);
        driverDataStore.info.firstName = res.data.data.first_name;
        driverDataStore.info.lastName = res.data.data.last_name;
        driverDataStore.info.rating = res.data.data.rating;
        driverDataStore.info.color = res.data.data.DriverVehicle[0].vehicle_color;
    } catch (error) {
        console.log(error);
    }
}
async function GET_VEHICLE_DATA() {
    try {
        const res = await Driver.getVehicleData(localStorage.getItem("token"));
        driverDataStore.info.image = res.data.data.work_set.image;
        driverDataStore.info.id = res.data.data.work_set.driver_vehicle_id;
        driverDataStore.info.carModel = res.data.data.work_set.vehicle_detail.split("(")[0];
        driverDataStore.info.carNumber = res.data.data.work_set.vehicle_detail.split("(")[1].slice(0, -1);
    } catch (error) {
        console.log(error);
    }
}

watch(togglePanel, () => {
    mapStore.debouncedRerender();
});

mode.value = "driver-stand-by";
watch(
    mode,
    () => {
        panelHeightConst.value = 0.85;
        panelHeight.value = 230;
        if (mode.value === "chat") {
            panelHeight.value = 365;
            currentInterface.value = "ChatInterface";
        }
        if (mode.value === "driver-check") {
            panelHeight.value = 500;
            currentInterface.value = "CheckInterface";
        }
        if (mode.value === "driver-stand-by") {
            panelHeight.value = 260;
            currentInterface.value = "DriverStandByInterface";
        }
        if (mode.value === "driver-ready") {
            panelHeight.value = 160;
            panelHeightConst.value = 0.75;
            currentInterface.value = "DriverReadyInterface";
        }
        if (mode.value === "driver-request") {
            panelHeight.value = 330;
            panelHeightConst.value = 0.88;
            currentInterface.value = "DriverRequestInterface";
        }
        if (mode.value === "driver-to-client") {
            panelHeightConst.value = 0.89;
            panelHeight.value = 350;
            currentInterface.value = "DriverToInterface";
        }
        if (mode.value === "driver-to-goal") {
            panelHeightConst.value = 0.89;
            panelHeight.value = 350;
            currentInterface.value = "DriverToInterface";
        }
        mapStore.debouncedRerender();
        return;
    },
    {
        immediate: true,
    }
);
</script>

<style lang="scss" scoped>
.top-panel {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.map {
    width: 100vw;
}

.bottom-panel {
    position: fixed;
    width: 100%;
    z-index: 1000;
}

.bottom-panel--down {
    bottom: -255px;
}

.bottom-panel--up {
    bottom: 0;
}
</style>
