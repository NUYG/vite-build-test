<template>
    <main class="container-fluid mt-4">
        <ul class="nav nav-tabs">
            <li v-for="(header, index) in tabHeader" :key="index" class="nav-item">
                <button @click.prevent="activeTab = index" class="nav-link" :class="{ active: activeTab === index }">{{ header }}</button>
            </li>
        </ul>
        <div class="tab-content row overflow-scroll">
            <div v-for="(header, index) in tabHeader" :key="index" v-show="activeTab === index" class="tab-pane" :class="{ active: activeTab === index }">
                <slot :name="'comp'+index"></slot>
            </div>
        </div>
    </main>
</template>

<script>
export default {
    data() {
        return {
            activeTab: 0,
        }
    },
    props: {
        tabHeader: {
            type: Array,
            default: () => ([]),
        },
    },
    computed: {}
}
</script>
