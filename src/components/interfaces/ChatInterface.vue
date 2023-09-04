<template>
    <v-row>
        <v-col>
            <HeaderRouter
                :title="$t('chat')"
                @clicked="handleCloseChat()"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col class="py-0">
            <div class="gray-buttom d-flex align-center justify-center pb-2 mx-5">
                <v-avatar color="graydark" size="x-small"></v-avatar>
                <div class="ml-2 text-graydarker">{{ orderStore.driver.name }}</div>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col class="messages-box d-flex flex-column">
            <v-sheet class="py-1 px-5 mb-3 rounded-xl"
                :class="{
                    'bg-brand align-self-end': message.sender === 'USER',
                    'bg-grey-lighten-2': message.sender === 'DRIVER',
                }"
                style="width: fit-content; word-break: break-all"
                v-for="message in messages"
                :key="message.timestamp"
            >
                {{ message.message }}
            </v-sheet>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-text-field class="bg-white"
                :label="$t('your_message')"
                append-icon="mdi-send"
                v-model="userMessage"
                :loading="isLoading"
                @click:append="SEND_MESSAGE()"
            ></v-text-field>
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from "vue";
import User from "@/repositories/user";
import { useOrderStore } from "@/store/order";
import { usePanelStore } from "@/store/userPanel";
import HeaderRouter from "@/components/HeaderRouter.vue";

// STORE
const orderStore = useOrderStore();
const panelStore = usePanelStore();

// VARS
let timerNum = null;
const userMessage = ref("");
const isLoading = ref(false);
const messages = ref([]);

// FUNS
function handleCloseChat() {
    clearInterval(timerNum);
    panelStore.mode = "order-in-progress";
}

// ASYNC FUNS
async function SEND_MESSAGE() {
    isLoading.value = true;
    try {
        const res = await User.sendChatMessage(
            orderStore.bookingId,
            userMessage.value
        );
        GET_CHAT_MESSAGES();
        console.log("CHAT SEND", res);
    } catch (error) {
        console.log("CHAT SEND ERROR", error);
    }
    isLoading.value = false;
    userMessage.value = "";
}

async function GET_CHAT_MESSAGES() {
    try {
        const res = await User.getChat(orderStore.bookingId);
        if (res.data.data === null) {
            messages.value = [];
        } else {
            messages.value = res.data.data.chat;
        }
        console.log("CHAT", res);
    } catch (error) {
        console.log("CHAT ERROR", error);
    }
}

// SETUP
GET_CHAT_MESSAGES();
timerNum = setInterval(GET_CHAT_MESSAGES, 3000);
</script>

<style lang="scss" scoped>
.gray-buttom {
    border-bottom: 1px solid rgb(var(--v-theme-graydarker));
}

.messages-box {
    height: 350px;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>
