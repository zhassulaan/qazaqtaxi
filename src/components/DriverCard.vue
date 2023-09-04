<template>
    <v-container>
        <v-row class="rounded-lg drop-big-shadow">
            <v-col class="d-flex flex-row justify-start align-center pa-2 bg-brand rounded-lg">
                <v-avatar color="graydarker" size="large"></v-avatar>
                <div class="font-15 font-weight-medium pl-2"
                    style="line-height: 1.1em"
                >
                    <div>{{ prop.data.firstName }}</div>
                    <div>{{ prop.data.lastName }}</div>
                    <div class="rounded-lg bg-white pa-1"
                        style="width: fit-content"
                    >
                        ID {{ prop.data.id }}
                    </div>
                    <div class="nowrap">
                        <v-icon
                            v-for="n in 5"
                            :key="n"
                            size="small"
                            icon="mdi-star"
                        ></v-icon>
                    </div>
                </div>
            </v-col>
            <v-col class="bg-white rounded-lg d-flex flex-row justify-start align-center font-15 pa-2">
                <img :src="prop.data.image" class="mr-2 car-img rounded-lg" />
                <div>
                    <div class="font-weight-medium">{{ prop.data.carModel }}</div>
                    <div>{{ prop.data.carNumber }}</div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const prop = defineProps(["data"]);
</script>

<style lang="scss" scoped>
.car-img {
    width: 50px;
    height: auto;
}
</style>
