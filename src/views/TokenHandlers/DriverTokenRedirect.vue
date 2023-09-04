<template>
    <div></div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

getToken();
function getToken() {
    localStorage.removeItem("token");
    localStorage.setItem("token", route.params.token);
    window.location.replace("/driver/map");
}
</script>
