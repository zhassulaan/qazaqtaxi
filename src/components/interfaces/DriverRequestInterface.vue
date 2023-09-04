<template>
    <v-row>
        <v-col class="text-center py-0">
            <div>
                {{ $t("accept") }}
                {{ timer }}
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <RequestCard
                :data="{
                    distance: '0.2',
                    time: '7',
                    price: '400',
                    payment: 'cash',
                }"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col class="pt-0">
            <WayCard
                :data="{
                    title: $t('departure'),
                    target: 'улица Мауленова, 92',
                }"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="3">
            <v-btn class="rounded-lg bg-blackish font-weight-bold"
                block
                height="60"
                icon="mdi-close-thick text-white"
                @click="handleCancelClick()"
            ></v-btn>
        </v-col>
        <v-col>
            <v-btn class="rounded-lg bg-brand font-weight-bold text-white"
                block
                height="60"
                :disabled="mode === 'driver-ready'"
                @click="handleMainClick()"
            >
                <span class="text-white">
                    {{ $t("accept_order") }}
                </span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePanelStore } from "@/store/userPanel";
import RequestCard from "@/components/RequestCard.vue";
import WayCard from "@/components/WayCard.vue";

const panelStore = usePanelStore();
const { mode } = storeToRefs(panelStore);
// const paymentMethodDialog = ref(false);
// const orderStatus = ref("waiting");
const timer = ref("60");

function handleCancelClick() {
    if (mode.value === "driver-ready") {
        // TODO уход с линии сервер
        mode.value = "driver-stand-by";
    }
}

function handleMainClick() {}
</script>
