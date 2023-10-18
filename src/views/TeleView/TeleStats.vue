<template>
    <FpDefLayout>
        <template #comp>

            <CallHistory :self-filter="false"/>

        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import CallHistory from "@/views/TeleView/CallHistory.vue";

export default {
    components: {
        FpDefLayout,
        CallHistory,
    },
    data() {
        return {}
    },
    methods: {},
    mounted() {

    }
}
</script>

<style scoped>
</style>
