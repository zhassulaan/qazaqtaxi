<template>
    <div
        class="d-flex flex-row justify-space-between align-start drop-big-shadow pa-2 rounded-lg"
        style="line-height: 1.1em"
    >
        <div class="d-flex flex-column justify-start align-center font-weight-medium">
            <div>{{ $t("distance") }}</div>
            <div class="font-weight-bold text-brand">
                {{ props.data.distance }}
                {{ $t("km") }}
            </div>
        </div>
        <div class="d-flex flex-column justify-start align-center font-weight-medium">
            <div>{{ $t("duration").split(' ')[0] }}</div>
            <div class="font-weight-bold text-brand">
                {{ props.data.time }}
                {{ $t("min") }}
            </div>

        </div>
        <div class="d-flex flex-column justify-start align-center">
            <div class="font-weight-medium">{{ $t("payment") }}</div>
            <div class="font-weight-bold text-brand">
                {{ props.data.price }}
                {{ $t("t") }}
            </div>
            <div style="border-top: 1px solid black">{{ readPayment(props.data.payment) }}</div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const i18n = useI18n();
const props = defineProps(["data"]);

function readPayment(str) {
    switch(str) {
        case 'cash':
            return i18n.t("cash")
        case 'card':
            return i18n.t("card")
        default:
            return ''
    }
}
</script>
