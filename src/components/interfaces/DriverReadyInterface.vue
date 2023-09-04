<template>
    <v-row>
        <v-col class="text-center py-0">{{ $t("wait")}}</v-col>
    </v-row>
    <v-row>
        <v-col cols="3">
            <v-btn class="rounded-lg bg-blackish font-weight-bold"
                block
                height="60"
                icon="mdi-close-thick text-white"
                @click="STOP_WORK()"
            ></v-btn>
        </v-col>
        <v-col>
            <v-btn class="rounded-lg bg-brand font-weight-bold text-white"
                block
                height="60"
                disabled
            >
                <span class="text-white">{{ $t("order_wait")}}</span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { onMounted } from "vue";
import Driver from "@/repositories/driver";
import { useDriverDataStore } from "@/store/driverData";
import { useMapStore } from "@/store/map";
import { usePanelStore } from "@/store/userPanel";

const driverDataStore = useDriverDataStore();
const mapStore = useMapStore();
const panelStore = usePanelStore();

onMounted(() => {
    driverDataStore.updatePoint();
});

async function STOP_WORK() {
    try {
        await Driver.stopWork(driverDataStore.point);
        mapStore.showLoader = false;
        panelStore.mode = "driver-stand-by";
    } catch (error) {
        console.log(error);
    }
}
</script>
