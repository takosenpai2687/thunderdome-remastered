<template>
    <div class="activity-list-wrapper">
        <!-- Tabs Row -->
        <div class="tabs-row relative">
            <button class="tab" ref="tabsRef" :key="'tab-' + index" v-for="(tab, index) in tabs"
                @click="handleClickTab(index)">{{ tab
                }}</button>
            <!-- Cursor -->
            <div class="cursor" :style="{ left: cursorX }"></div>
        </div>
        <!-- Activity Group List Content -->
        <ul class="activity-list activity-groups" v-if="tabs[tabIdx] === 'Groups'">
            <li class="act-box" v-for="act in activities.groups">
                <img :src="act.avatar" alt="" class="act-img">
                <div class="act-info">
                    <p class="act-name">
                        <span>{{ act.user }}</span>
                        {{ ` created ` }}
                        <span>{{ act.group }}</span>
                        {{ ` group` }}
                    </p>
                    <p class="act-time">
                        {{ act.time }}
                    </p>
                </div>
            </li>
        </ul>
        <!-- Activity Tickets List Content -->
        <!-- Activity Group List Content -->
        <ul class="activity-list activity-tickets" v-if="tabs[tabIdx] === 'Tickets'">
            <li class="act-box" v-for="act in activities.tickets">
                <img :src="act.avatar" alt="" class="act-img">
                <div class="act-info">
                    <p class="act-name">
                        <span>{{ act.user }}</span>
                        {{ ` bought 1 ticket(s) of ` }}
                        <span>{{ act.group }}</span>
                        {{ ` group` }}
                    </p>
                    <p class="act-time">
                        {{ act.price + ', ' + act.time }}
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            tabs: ['Groups', 'Tickets'],
            tabIdx: 0,
            cursorX: 0,
            activities: {
                groups: [],
                tickets: []
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.handleClickTab(0);
        });
        this.fetchData();
    },
    methods: {
        async fetchData() {
            const _acts = await axios.get('/mock/activities.json').then(r => r.data);
            const groups = new Array(5).fill(structuredClone(_acts)).flat();
            const tickets = new Array(5).fill(structuredClone(_acts)).flat();
            groups.sort(_ => Math.random() - 0.5);
            tickets.sort(_ => Math.random() - 0.5);
            this.activities = { groups, tickets };
        },
        handleClickTab(index) {
            const tabsRef = this.$refs.tabsRef;
            if (!tabsRef) return;
            const tab = tabsRef[index];
            this.tabIdx = index;
            this.cursorX = tab.offsetLeft + 'px';
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

$list-tab-height: 4em;

@keyframes slideInFromLeft {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}

@keyframes slideInFromRight {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}

.activity-list-wrapper {
    width: $activity-list-width;
    height: 100%;
    border-left: 1px solid var(--line-color);

    .tabs-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: $list-tab-height;

        .tab {
            user-select: none;
            width: 50%;
            height: 100%;
            z-index: 10;
            color: #fff;
            transition: all 0.2s ease-out;
            font-weight: bold;
            letter-spacing: 1px;

            &:hover {
                color: var(--btn-hover-color);
                transform: scale(1.1);
            }
        }

        .cursor {
            user-select: none;
            transition: all 0.2s ease-out;
            position: absolute;
            width: calc($activity-list-width / 2);
            height: $list-tab-height;
            top: 0;
            z-index: 0;
            border-bottom: .2em solid var(--btn-hover-color);
        }
    }

    .activity-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        height: calc(100% - $list-tab-height);
        overflow-y: auto;
        user-select: none;


        .act-box {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1em;
            width: 100%;
            padding: .66em 1em;
            border-bottom: 1px solid var(--line-color);
            background-color: var(--primary-color);
            transition: all 0.2s ease-out;

            &:hover {
                background-color: var(--primary-color-deeper);
                transform: scaleY(1.1);
                cursor: pointer;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15) inset;
            }

            .act-img {
                width: 2.8em;
                height: 2.8em;
                border-radius: 50%;
                background-color: var(--line-color);
            }

            .act-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                gap: .5em;

                .act-name {
                    font-size: 1em;
                    font-weight: normal;
                    color: #fff;

                    span {
                        color: var(--btn-hover-color);
                    }
                }

                .act-time {
                    font-size: 0.8em;
                    color: var(--gray-font);
                    font-style: italic;
                }
            }
        }

        &.activity-groups {
            .act-box {
                animation: .3s ease-out slideInFromLeft;
            }
        }

        &.activity-tickets {
            .act-box {
                animation: .3s ease-out slideInFromRight;
            }
        }
    }
}
</style>