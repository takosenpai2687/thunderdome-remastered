<template>
    <div class="wrapper">
        <div class="tabs-bar relative flex flex-row z-10">
            <button :key="'tab-' + index" v-for="(tab, index) in tabs" ref="refButtons"
                @click="handleClickTab(index)">{{ tab }}</button>
            <!-- Cursor -->
            <div class="cursor absolute" :style="{ left: cursorX }"></div>
        </div>
        <div class="groups-container p-1 w-full h-full overflow-y-scroll">
            <div class="grid grid-cols-5 gap-4 mx-auto w-full">
                <div class="group-card" v-for="(group, index) in groups" :key="'group-' + index">
                    <div class="group-avatar">
                        <img :src="group.avatar" alt="avatar" />
                    </div>
                    <div class="group-info">
                        <h3>{{ group.name }}</h3>
                        <p>{{ group.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { nextTick } from 'vue';
import axios from 'axios';

export default {
    data() {
        return {
            cursorX: 0,
            tabIdx: 0,
            tabs: ['My Groups', 'Trending', 'Top', 'New'],
            groups: []
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
            const _groups = await axios.get('/mock/leaderboard.json').then(res => res.data.map(u => ({
                name: u.user,
                avatar: u.avatar,
                description: `${Math.floor(Math.random() * 1000)} holders, ${Math.ceil(Math.random() * 10)}FTM`
            })));
            // Repeat 5 times
            this.groups = new Array(15).fill(_groups).flat();
        }
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

    .groups-container {
        padding: 2em 1em;

        .group-card {
            background-color: var(--btn-color);
            border-radius: 100rem;
            display: flex;
            padding: .1em .5em;
            overflow: hidden;
            justify-content: flex-start;
            align-items: center;
            gap: 1em;

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
}
</style>