<template>
    <div class='w-100 d-inline-flex justify-content-center mb-5 pb-5 pb-xl-3'>
        <div class="pagination">
            <a @click='firstPage'><img :src="getIconUrl('chevron-left.svg')"/></a>
            <a @click='changePage(currentPage - 2)' v-show="(currentPage - 2) > 0">{{ currentPage - 2 }}</a>
            <a @click='previousPage' v-show="(currentPage - 1) > 0">{{ currentPage - 1 }}</a>
            <a class="active">{{ currentPage }}</a>
            <a @click='nextPage' v-show="(currentPage + 1) <= totalPage">{{ currentPage + 1 }}</a>
            <a @click='changePage(currentPage + 2)' v-show="(currentPage + 2) <= totalPage">{{ currentPage + 2 }}</a>
            <a @click='lastPage'><img :src="getIconUrl('chevron-right.svg')"/></a>
        </div>
    </div>
</template>

<script>
import {getIconUrl} from "@/utils/utils";

export default {
    data() {
        return {}
    },
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalItem: {
            type: Number,
            required: true,
        },
        itemPerPage: {
            type: Number,
            required: true,
        },
    },
    computed: {
        totalPage() {
            return parseInt(((this.totalItem - 1) / this.itemPerPage).toString()) + 1;
        },
    },
    methods: {
        getIconUrl,
        nextPage() {
            this.$emit("to-page", Math.min(this.totalPage, this.currentPage + 1));
        },
        previousPage() {
            this.$emit("to-page", Math.max(1, this.currentPage - 1));
        },
        changePage(page) {
            this.$emit("to-page", page);
        },
        lastPage() {
            this.$emit("to-page", this.totalPage);
        },
        firstPage() {
            this.$emit("to-page", 1);
        },
    },
    mounted() {
    }
}
</script>

<style scoped>
    .pagination {
        display: inline-block;
    }

    .pagination a {
        color: black;
        padding: 8px 16px;
        text-decoration: none;
        transition: background-color .3s;
        font-size: 16px;
    }

    .pagination a.active {
        background-color: #999999;
        color: white;
        border-radius: 6px
    }
</style>
