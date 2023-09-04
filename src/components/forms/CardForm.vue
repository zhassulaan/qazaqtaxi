<template>
    <v-container class="drop-big-shadow rounded-lg">
        <APIDialog
            v-model="dialogError"
            :title="$t('card_failed')"
            @close-me="$router.push({ name: 'Map' })"
        />
        <APIDialog
            v-model="dialogSuccess"
            :title="$t('card_success')"
            @close-me="$router.push({ name: 'Map' })"
        />
        <v-row>
            <v-col class="text-center font-weight-bold">
                {{ $t("fill_info") }}
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div class="font-15 font-weight-medium">{{ $t("card_numb") }}</div>
                <v-text-field
                    variant="outlined"
                    placeholder="5169 0000 0000 0000"
                    hide-details
                    v-maska:[cardNumberMask]
                    v-model="card.number"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7">
                <div class="font-15 font-weight-medium">{{ $t("expiry_date") }}</div>
                <v-text-field
                    variant="outlined"
                    placeholder="мм / гггг"
                    hide-details
                    v-maska:[cardDateMask]
                    v-model="card.date"
                ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4">
                <div class="font-15 font-weight-medium">CVV</div>
                <v-text-field
                    type="password"
                    variant="outlined"
                    placeholder="***"
                    hide-details
                    v-maska:[cardCVVMask]
                    v-model="card.CVV"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="8">
                <div class="font-15 font-weight-medium">{{ $t("name") }}</div>
                <v-text-field
                    variant="outlined"
                    placeholder="NAME FULLNAME"
                    hide-details
                    v-maska:[cardNameMask]
                    v-model="card.name"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-center">
                <v-btn
                    color="brand"
                    :disabled="!formCheck"
                    @click="SUBMIT_CARD()"
                >
                    <span class="text-white">{{ $t("add_card") }}</span>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { vMaska } from "maska";
import User from "@/repositories/user";
import APIDialog from "@/components/dialogs/APIDialog.vue";

const dialogSuccess = ref(false);
const dialogError = ref(false);
const card = ref({
    number: "",
    date: "",
    CVV: "",
    name: "",
});

const formCheck = computed(() => {
    return (
        card.value.number.length === 19 &&
        card.value.date.length === 9 &&
        card.value.CVV.length === 3 &&
        card.value.name.length > 0
    );
});

const cardNumberMask = ref({
    mask: "#### #### #### ####",
    eager: true,
});
const cardDateMask = ref({
    mask: (value) => (value.at(0) === "1" ? "XZ / ####" : "X# / ####"),
    eager: true,
    tokens: {
        X: {
            pattern: /[0-1]/,
        },
        Z: {
            pattern: /[0-2]/,
        },
    },
});
const cardCVVMask = ref({
    mask: "###",
    eager: true,
});
const cardNameMask = ref({
    mask: "A A",
    eager: true,
    tokens: {
        A: {
            pattern: /[A-Z]/,
            multiple: true
        },
    },
});

async function SUBMIT_CARD() {
    try {
        const [month, year] = card.value.date.split("/");
        const payload = {
            exp_month: month,
            exp_year: year,
            card_number: card.value.number.split(" ").join(""),
            token: card.value.CVV,
            card_holder: card.value.name,
        };
        await User.addCard(payload);
        dialogSuccess.value = true;
    } catch (error) {
        console.log(error);
        dialogError.value = true;
    }
}
</script>
