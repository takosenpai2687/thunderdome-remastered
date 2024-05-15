<template>
    <div class="wrapper">
        <div class="tabs-bar relative flex flex-row z-10">
            <button :key="'tab-' + index" v-for="(tab, index) in tabs" ref="refButtons"
                @click="handleClickTab(index)">{{ tab }}</button>
            <!-- Cursor -->
            <div class="cursor absolute" :style="{ left: cursorX }"></div>
        </div>
        <div class="creators-container p-1 w-full overflow-y-scroll">
            <div class="grid grid-cols-4 gap-4 mx-auto w-full">
                <div class="creator-card" v-for="(creator, index) in creators" :key="'creator-' + index">
                    <div class="creator-avatar">
                        <img :src="creator.avatar" alt="avatar" />
                    </div>
                    <div class="creator-info">
                        <h3>{{ creator.name }}</h3>
                        <p>{{ creator.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Pagination -->
        <div class="pagination flex justify-center items-center mt-4 gap-4">
            <button @click="handleChangePage(pageIdx - 1)">Prev</button>
            <span>{{ pageIdx + 1 }}</span>
            <button @click="handleChangePage(pageIdx + 1)"
                :disabled="pageIdx === Math.floor(total / pageSize)">Next</button>
        </div>
    </div>
</template>

<script>
import { nextTick } from 'vue';
import axios from 'axios';

const ROWS = 7;

export default {
    data() {
        return {
            cursorX: 0,
            tabIdx: 0,
            tabs: ['My Creators', 'Trending', 'Top', 'New'],
            creators: [],
            allCreators: [],
            pageIdx: 0,
            pageSize: 4 * ROWS,
            total: 0
        }
    },
    methods: {
        handleClickTab(index) {
            const button = this.$refs.refButtons[index];
            this.tabIdx = index;
            this.cursorX = button.offsetLeft + 'px';
            this.creators.sort(() => Math.random() - 0.5);
            this.pageIdx = 0;
        },
        async fetchData() {
            let _creators = await axios.get('/mock/leaderboard.json').then(res => res.data.map(u => ({
                name: u.user,
                avatar: u.avatar,
                description: `${Math.floor(Math.random() * 1000)} holders, ${Math.ceil(Math.random() * 10)}FTM`
            })));
            // Repeat 25 times
            _creators = new Array(25).fill(_creators).flat();
            // Pagination
            this.total = _creators.length;
            this.allCreators = _creators;
            this.creators = this.allCreators.slice(0, this.pageSize);
        },
        handleChangePage(pageIdx) {
            if (pageIdx < 0 || pageIdx > Math.floor(this.total / this.pageSize)) return;
            this.pageIdx = pageIdx;
            this.creators = this.allCreators.slice(this.pageIdx * this.pageSize, (this.pageIdx + 1) * this.pageSize);
        },
    },
    mounted() {
        this.fetchData();
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

    .creators-container {
        padding: 2em 1em;

        .creator-card {
            background-color: var(--btn-color);
            border-radius: 100rem;
            display: flex;
            padding: .5rem .5rem;
            overflow: hidden;
            justify-content: flex-start;
            align-items: center;
            gap: 1.25rem;

            .creator-avatar {
                width: 3em;
                height: 3em;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }

            .creator-info {
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