<template>
    <v-container>
        <v-row>
            <v-col>
                <HeaderRouter
                    :title="$t('add_card')"
                    @clicked="$router.push({name: 'Map'})"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <CardForm />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import HeaderRouter from "@/components/HeaderRouter.vue";
import CardForm from "@/components/forms/CardForm.vue";
</script>
