<template>
    <CommentDialog
        v-model="commentDialog"
        :title="$t('add_comment')"
        @submit="handleCommentSubmit"
    />
    <APIDialog
        v-model="rateDialog"
        :title="!activeStars ? $t('completed') : $t('thanks_rating')"
        @close-me="handleFinish(); rateDialog = false;"
    />
    <v-row>
        <v-col>
            <HeaderRouter
                :title="$t('ride_ended')"
                @clicked="rateDialog = true"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col class="py-0 d-flex flex-row justify-center">
            <v-sheet class="bg-brand text-blackish font-weight-bold rounded-lg px-2">
                {{ orderStore.price }}
                {{ $t("t").toUpperCase() }}
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="font-15">
            <div class="font-weight-medium one-liner">
                <v-icon icon="mdi-circle-outline text-red"></v-icon>
                {{ orderStore.pointA.name }}
            </div>
            <div class="font-weight-medium one-liner">
                <v-icon icon="mdi-circle-outline"></v-icon>
                {{ orderStore.pointB.name }}
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="font-15">
            <div class="d-flex flex-row align-center justify-space-between">
                <div class="font-weight-medium">
                    {{ orderStore.driver.name }}
                </div>
                <div class="font-weight-medium">
                    <v-icon icon="mdi-star"></v-icon>
                    {{ orderStore.driver.raiting }}
                </div>
            </div>
            <div class="d-flex flex-row align-center justify-space-between">
                <div class="text-graydarker">
                    {{ orderStore.driver.carModel }}
                </div>
                <div class="font-weight-medium">
                    {{ orderStore.driver.carNumber }}
                </div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="font-15">
            <div class="font-weight-medium mb-3">{{ $t("ride_info") }}</div>
            <div class="d-flex flex-row">
                <div class="nowrap">{{ $t("distance") }}</div>
                <div class="block dotted-line"></div>
                <div class="nowrap">{{ orderStore.distanceEstimate }}</div>
            </div>
            <div class="d-flex flex-row">
                <div class="nowrap">{{ $t("duration").split(' ')[0] }}</div>
                <div class="block dotted-line"></div>
                <div class="nowrap">{{ orderStore.timeEstimate }}</div>
            </div>
            <div class="d-flex flex-row">
                <div class="nowrap">{{ $t("amount")}}</div>
                <div class="block dotted-line"></div>
                <div class="nowrap">{{ orderStore.price }}T</div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <div class="font-weight-bold text-center">{{ $t("rate")}}</div>
            <div class="d-flex flex-row align-center justify-center">
                <v-btn class="star"
                    :style="{ opacity: (n <= activeStars) ? 1 : .35 }"
                    v-for="n in 5"
                    :key="n"
                    icon="mdi-star"
                    variant="text"
                    color="brand"
                    @click="handleStars(n)"
                ></v-btn>
            </div>
            <div class="d-flex flex-row justify-center">
                <v-btn class="font-15 yellow-border"
                    variant="text"
                    :disabled="activeStars === 0"
                    @click="commentDialog = true"
                >
                    <span class="text-graydarker">{{ $t("add_comment") }}</span>
                </v-btn>
            </div>
            <div class="d-flex flex-row justify-center pt-4">
                <v-btn class="round"
                    color="brand"
                    size="small"
                    :disabled="activeStars === 0"
                    @click="RATE_DRIVER()"
                >
                    {{ $t("review") }}
                </v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from "vue";
import User from "@/repositories/user";
import { useDirectionsStore } from "@/store/directions";
import { useMapStore } from "@/store/map";
import { useOrderStore } from "@/store/order";
import { usePanelStore } from "@/store/userPanel";
import APIDialog from "@/components/dialogs/APIDialog.vue";
import CommentDialog from "@/components/dialogs/CommentDialog.vue";
import HeaderRouter from "@/components/HeaderRouter.vue";

const directionStore = useDirectionsStore();
const mapStore = useMapStore();
const orderStore = useOrderStore();
const panelStore = usePanelStore();
const commentDialog = ref(false);
const rateDialog = ref(false);
const activeStars = ref(0)

function handleCommentSubmit() {
    // TODO отправка коммента на сервер
    commentDialog.value = false;
}

function handleFinish() {
    mapStore.pointA = {};
    mapStore.pointB = {};
    directionStore.pointA = {};
    directionStore.pointB = {};
    directionStore.debouncedClearDirection();
    panelStore.mode = "stand-by";
    orderStore.$reset();
}

function handleStars(val) {
    activeStars.value = val;
    console.log(val);
    console.log(activeStars.value);
}

async function RATE_DRIVER() {
    if (orderStore.isRated) {
        return;
    }
    try {
        orderStore.rating = activeStars.value;
        const payload = {
            segment_slug: 1,
            booking_order_id: orderStore.bookingId,
            rating: activeStars.value,
        };
        await User.rateDriver(payload);
        orderStore.isRated = true;
        rateDialog.value = true;
    } catch (error) {
        console.log(error);
    }
}
</script>

<style lang="scss" scoped>
.dotted-line {
    height: 1.3em;
    border-bottom: dotted 1px black;
}

.yellow-border {
    border-bottom: solid 1px rgb(var(--v-theme-brand));
}

.star {
    transition: .2s;
}

.one-liner {
    height: 3em;
    overflow: hidden;
    -webkit-line-clamp: 2;
}
</style>
