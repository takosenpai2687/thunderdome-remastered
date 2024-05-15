<template>
    <div class="wrapper">
        <div class="tabs-bar relative flex flex-row z-10">
            <button :key="'tab-' + index" v-for="(tab, index) in tabs" ref="refButtons"
                @click="handleClickTab(index)">{{ tab }}</button>
            <!-- Cursor -->
            <div class="cursor absolute" :style="{ left: cursorX }"></div>
        </div>
        <!-- Sorting Options -->
        <div class="sorting-row flex justify-start items-center gap-4" v-if="tabIdx === 0">
            <!-- Sort by holders -->
            <button class="btn-sort" :class="{ active: sortByHoldersAsc || sortByHoldersDesc }"
                @click="handleClickSort('holders')">
                <span>Holders</span>
                <!-- Arrow Up -->
                <span class="material-symbols-outlined" :class="{ down: sortByHoldersDesc }"
                    v-if="sortByHoldersAsc || sortByHoldersDesc">
                    keyboard_double_arrow_up
                </span>
            </button>
            <!-- Sort by Price FTM -->
            <button class="btn-sort" :class="{ active: sortByPriceAsc || sortByPriceDesc }"
                @click="handleClickSort('price')">
                <span>Price FTM</span>
                <!-- Arrow Up -->
                <span class="material-symbols-outlined" :class="{ down: sortByPriceDesc }"
                    v-if="sortByPriceAsc || sortByPriceDesc">
                    keyboard_double_arrow_up
                </span>
            </button>
        </div>
        <div class="groups-container grid grid-cols-4 gap-4 mx-auto w-full">
            <div class="group-card" v-for="(group, index) in groups" :key="'group-' + index">
                <div class="group-avatar">
                    <img :src="group.avatar" alt="avatar" />
                </div>
                <div class="group-info">
                    <h3>{{ group.name }}</h3>
                    <p>{{ `${group.holders} holders, ${group.price}FTM` }}</p>
                </div>
            </div>
        </div>
        <!-- Pagination -->
        <div class="pagination flex justify-center items-center mt-4 gap-4">
            <button @click="handleChangePage(pageIdx - 1)">Prev</button>
            <span>{{ pageIdx + 1 }} / {{ totalPages }}</span>
            <button @click="handleChangePage(pageIdx + 1)"
                :disabled="pageIdx === Math.floor(total / pageSize)">Next</button>
        </div>
    </div>
</template>

<script>
import { nextTick } from 'vue';
import axios from 'axios';
const ROWS = 10;

export default {
    data() {
        return {
            cursorX: 0,
            tabIdx: 0,
            tabs: ['My Groups', 'Trending', 'Top', 'New'],
            groups: [],
            allGroups: [],
            pageIdx: 0,
            pageSize: 4 * ROWS,
            total: 0,
            sortByHoldersAsc: false,
            sortByHoldersDesc: true,
            sortByPriceAsc: false,
            sortByPriceDesc: false
        }
    },
    computed: {
        // Pagination
        totalPages() {
            return Math.ceil(this.total / this.pageSize);
        }
    },
    methods: {
        handleClickTab(index) {
            const button = this.$refs.refButtons[index];
            this.tabIdx = index;
            this.cursorX = button.offsetLeft + 'px';
            this.groups.sort(() => Math.random() - 0.5);
        },
        async fetchData() {
            let _groups = await axios.get('/mock/leaderboard.json').then(res => res.data.map(u => {
                const _holders = Math.floor(Math.random() * 1000);
                const _price = Math.ceil(Math.random() * 10);
                return {
                    name: u.user,
                    avatar: u.avatar,
                    price: _price,
                    holders: _holders,
                }
            }));
            // Repeat 25 times
            _groups = new Array(25).fill(_groups).flat().map(u => ({
                ...u,
                holders: Math.floor(Math.random() * 1000),
                price: Math.ceil(Math.random() * 10),
            }));
            this.total = _groups.length;
            this.allGroups = _groups;
            this.groups = _groups.slice(0, this.pageSize);
        },
        handleChangePage(pageIdx) {
            if (pageIdx < 0 || pageIdx > Math.floor(this.total / this.pageSize)) return;
            this.pageIdx = pageIdx;
            this.groups = this.allGroups.slice(this.pageIdx * this.pageSize, (this.pageIdx + 1) * this.pageSize);
        },
        applySort() {
            if (this.sortByHoldersAsc) {
                this.allGroups.sort((a, b) => a.holders - b.holders);
            } else if (this.sortByHoldersDesc) {
                this.allGroups.sort((a, b) => b.holders - a.holders);
            } else if (this.sortByPriceAsc) {
                this.allGroups.sort((a, b) => a.price - b.price);
            } else if (this.sortByPriceDesc) {
                this.allGroups.sort((a, b) => b.price - a.price);
            }
            this.handleChangePage(this.pageIdx);
        },
        handleClickSort(sortBy) {
            if (sortBy === 'holders') {
                // Sort by holders Asc
                if (!this.sortByHoldersAsc) {
                    this.sortByHoldersAsc = true;
                    this.sortByHoldersDesc = false;
                    this.sortByPriceAsc = false;
                    this.sortByPriceDesc = false;
                    this.applySort();
                    return;
                }
                // Sort by holders Desc
                if (!this.sortByHoldersDesc) {
                    this.sortByHoldersAsc = false;
                    this.sortByHoldersDesc = true;
                    this.sortByPriceAsc = false;
                    this.sortByPriceDesc = false;
                    this.applySort();
                    return;
                }
            } else if (sortBy === 'price') {
                // Sort by price Asc
                if (!this.sortByPriceAsc) {
                    this.sortByHoldersAsc = false;
                    this.sortByHoldersDesc = false;
                    this.sortByPriceAsc = true;
                    this.sortByPriceDesc = false;
                    this.applySort();
                    return;
                }
                // Sort by price Desc
                if (!this.sortByPriceDesc) {
                    this.sortByHoldersAsc = false;
                    this.sortByHoldersDesc = false;
                    this.sortByPriceAsc = false;
                    this.sortByPriceDesc = true;
                    this.applySort();
                    return;
                }
            }
        },
    },
    mounted() {
        this.fetchData().then(_ => {
            this.applySort();
        });
        nextTick(() => {
            this.handleClickTab(0);
        });
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    padding: .5em;
    height: 100%;

    .tabs-bar {
        padding: 0 1em;

        button {
            width: 8em;
            height: 3.5em;
            padding: .2em 1em;
            appearance: none;
            z-index: 10;
            color: #FFF;
        }

        .cursor {
            user-select: none;
            width: 8em;
            height: 2.4em;
            background-color: var(--btn-color);
            z-index: 0;
            position: absolute;
            top: 50%;
            left: 1em;
            transform: translateY(-50%);
            transition: .3s;
            border-radius: 99em;
        }
    }

    .sorting-row {
        padding: 1rem 1rem 0 1rem;

        .btn-sort {
            background-color: var(--btn-color);
            color: #eee;
            padding: .4rem 1.5rem;
            border-radius: 99rem;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            font-weight: bold;
            transition: 0.3s all ease-out;
            width: 14rem;
            height: 2.5rem;
            gap: .75rem;

            span.material-symbols-outlined {
                display: block;
                transform: rotateZ(0);
                transition: .2s all ease-out;

                &.down {
                    transform: rotateZ(180deg);
                }
            }

            &.active {
                background-color: var(--btn-hover-color);
            }
        }
    }

    .groups-container {
        margin-top: 1rem;
        padding: 1em;
        max-height: 80%;
        overflow-y: auto;

        .group-card {
            background-color: var(--btn-color);
            border-radius: 100rem;
            display: flex;
            overflow: hidden;
            justify-content: flex-start;
            align-items: center;
            gap: 1.25rem;
            height: 4.5rem;
            padding: 0 .8rem;

            .group-avatar {
                width: 3em;
                height: 3em;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }

            .group-info {
                color: #fff;

                h3 {
                    font-size: 1.25em;
                    text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
                }

                p {
                    font-size: 0.9em;
                    text-shadow: 0 0 1px rgba(0, 0, 0, 0.9);
                }
            }
        }
    }

    .pagination {
        user-select: none;
        color: #FFF;

        span {
            font-size: 1.1rem;
        }

        button {
            padding: .5em 1em;
            background-color: var(--btn-color);
            color: #eee;
            border-radius: 100rem;
            font-size: 1.1rem;
            transition: 0.3s all ease-out;
            font-weight: bold;

            &:hover {
                background-color: var(--btn-hover-color);
                text-shadow: 0 0 2px rgba(255, 255, 255, 0.9);
            }
        }
    }
}
</style>