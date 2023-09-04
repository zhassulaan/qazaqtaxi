<template>
    <div></div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

function getToken() {
    localStorage.removeItem("token");
    localStorage.setItem("token", route.params.token);
    // localStorage.removeItem("lang");
    // localStorage.setItem("lang", route.params.lang);
    window.location.replace("/user/map");
}
getToken();
</script>
