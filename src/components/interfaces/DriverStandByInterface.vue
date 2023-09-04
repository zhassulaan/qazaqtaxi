<template>
    <APIDialog
        v-model="dialogError"
        :title="$t('failed_work')"
        @close-me="dialogError = false"
    />
    <v-row>
        <v-col>
            <DriverCard :data="driverDataStore.info" />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="3">
            <v-btn class="rounded-lg bg-brand font-weight-bold"
                block
                height="60"
                icon="mdi-card-bulleted-outline text-white"
                @click="handlePaymentClick()"
            ></v-btn>
        </v-col>
        <v-col>
            <v-btn class="rounded-lg bg-brand font-weight-bold text-white"
                block
                height="60"
                @click="START_WORK()"
            >
                <span class="text-white">{{ $t("start_work") }}</span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from "vue";
import Driver from "@/repositories/driver";
import { useDriverDataStore } from "@/store/driverData";
import { useMapStore } from "@/store/map";
import { usePanelStore } from "@/store/userPanel";
import APIDialog from "@/components/dialogs/APIDialog.vue";
import DriverCard from "@/components/DriverCard.vue";

const driverDataStore = useDriverDataStore();
const mapStore = useMapStore();
const panelStore = usePanelStore();
const dialogError = ref(false);

async function START_WORK() {
    try {
        await Driver.startWork(driverDataStore.point);
        panelStore.mode = "driver-ready";
        mapStore.showLoader = true;
    } catch (error) {
        console.log(error);
        dialogError.value = true;
    }
}

function handlePaymentClick() {
    // TODO переход в оплаты в приложении
}
</script>
