<template>
    <v-dialog class="dialog" z-index="99999">
        <v-sheet class="bg-white rounded-lg px-7 pt-3 pb-4 d-flex flex-column justify-center align-center">
            <div class="text-blackish font-weight-bold mb-3">{{ $t("payment_method") }}</div>
            <div class="block mb-3">
                <div class="d-flex flex-row justify-space-between border-bottom mb-2"
                    v-for="card in linkedCards"
                    :key="card.id"
                    @click="choosenPayment = card.id"
                >
                    <div class="payment-text">
                        <v-icon class="mr-3"
                            :icon="getIcon(card.system)"
                        ></v-icon>
                        {{ card.preview }}
                    </div>
                    <div>
                        <input
                            type="radio"
                            :value="card.id"
                            v-model="choosenPayment"
                        />
                    </div>
                </div>
                <div class="d-flex flex-row justify-space-between">
                    <v-btn class="pa-1 mr-3 payment-text"
                        prepend-icon="mdi-plus-box-outline"
                        variant="text"
                        density="compact"
                        :to="{ name: 'AddPaymentMethod' }"
                    >
                        {{ $t("add_card") }}
                    </v-btn>
                </div>
            </div>
            <v-btn class="bg-brand"
                @click="emit('closeMe')"
            >
                <span class="text-white">{{ $t("ready") }}</span>
            </v-btn>
        </v-sheet>
    </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import User from "@/repositories/user";
import { usePaymentStore } from "@/store/payment";

const emit = defineEmits(["closeMe"]);
const i18n = useI18n();

const linkedCards = ref([{ id: 0, system: "cash", preview: i18n.t("cash") }]);
const payment_method_id = ref(0);
const choosenPayment = ref(0);
const paymentStore = usePaymentStore();

watch(choosenPayment, () => {
    if (linkedCards.value[choosenPayment.value].system === "cash") {
        payment_method_id.value = 1;
        paymentStore.isCard = false;
        paymentStore.paymentId = 1;
    } else {
        payment_method_id.value = 2;
        paymentStore.isCard = true;
        paymentStore.paymentId = linkedCards.value[choosenPayment.value].id;
    }
});

function getIcon(system) {
    switch (system) {
        case "cash":
            return "mdi-cash-multiple";
        case "visa":
            return "mdi-card-bulleted-outline ";
        case "master":
            return "mdi-card-bulleted ";
        default:
            return "";
    }
}
async function GET_CARDS() {
    try {
        const res = await User.getCards();
        const card = res.data.data.map((item) => {
            return {
                id: item.id,
                system: "visa",
                preview: item.card_number.slice(-4),
            };
        });
        linkedCards.value.push(...card);
    } catch (error) {
        console.log(error);
    }
}
GET_CARDS();
</script>

<style lang="scss" scoped>
.border-bottom {
    border-bottom: 1px solid rgb(var(--v-theme-graydark));
}

.payment-text {
    font-size: 15px;
    color: #929292;
}
</style>
