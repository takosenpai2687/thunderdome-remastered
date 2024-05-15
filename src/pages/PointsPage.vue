<template>
    <div class="wrapper">
        <!-- Main Content -->
        <main>
            <section class="my-info">
                <!-- First Row -->
                <div class="my-info-row w-full">
                    <!-- Your Points -->
                    <div class="info-card w-1/2">
                        <h2>Your Points</h2>
                        <p>0</p>
                    </div>
                    <!-- Your Rank -->
                    <div class="info-card w-1/2">
                        <h2>Your Rank</h2>
                        <p>0</p>
                    </div>
                </div>
                <!-- 2nd Row -->
                <div class="my-info-row w-full">
                    <div class="info-card w-full">
                        <h2>Your Referral Link</h2>
                        <div class="referral-link">https://thunderdome.so/from=helloworld
                            <span v-if="!isCopied" @click="handleClickCopy('https://thunderdome.so/from=helloworld')"
                                class="icon material-icon material-symbols-outlined notranslate component">content_copy</span>
                            <span v-if="isCopied"
                                class="icon material-icon material-symbols-outlined notranslate component">check</span>
                        </div>
                    </div>
                </div>
            </section>
            <section class="leaderboard">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th :style="{ width: '144px' }">Rank</th>
                            <th>User</th>
                            <th :style="{ width: '144px' }">Points</th>
                            <th>𝕏</th>
                            <th>Wallet Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player, index) in leaderboard">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <button class="player-button">
                                    <img :src="player.avatar">
                                    {{ player.user }}
                                </button>
                            </td>
                            <td>{{ player.points }}</td>
                            <td class="x-text text-gray-300">{{ player.x }}</td>
                            <td class="text-gray-300">{{ player.wallet }}</td>
                        </tr>

                    </tbody>
                </table>
            </section>
        </main>
        <!-- Activities List -->
        <div class="activities-box">
            <activity-list />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ActivityList from '../components/ActivityList.vue';

export default {
    components: {
        ActivityList
    },
    created() {
        this.fetchData();
    },
    data() {
        return {
            isCopied: false,
            leaderboard: []
        }
    },
    methods: {
        async fetchData() {
            const _leaderboard = await axios.get('/mock/leaderboard.json').then(res => res.data);
            this.leaderboard = new Array(10).fill(_leaderboard).flat();
        },
        handleClickCopy() {
            navigator.clipboard.writeText('https://thunderdome.so/from=helloworld');
            this.isCopied = true;
            setTimeout(() => {
                this.isCopied = false;
            }, 2000);
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    main {
        width: calc(100% - $activity-list-width);

        .my-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: .75rem;
            padding: 1.5rem;

            .my-info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: .5rem;
                width: 100%;

                .info-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-self: flex-start;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    padding: 1rem;
                    gap: 1.25rem;

                    h2 {
                        font-size: 1.5rem;
                        font-weight: bolder;
                        color: #fff;
                    }

                    p {
                        font-size: 1.25rem;
                        font-weight: bolder;
                        color: #fff;
                    }

                    .referral-link {
                        font-size: 1.25rem;
                        font-weight: normal;
                        color: #ddd;
                        background-color: rgba(0, 0, 0, 0.33);
                        width: auto;
                        margin-right: auto;
                        padding: .5rem 1rem;
                        border-radius: .5rem;
                        transition: all .2s ease-out;
                        user-select: none;

                        .icon {
                            margin-top: 4px;
                            font-size: 1.1rem;
                            font-weight: bolder;
                            color: #fff;
                            margin-left: 8px;
                            cursor: pointer;
                            transition: all .2s ease-out;

                            &:hover {
                                color: #aaa;
                                transform: scale(1.1);
                            }

                        }

                        &:hover {
                            background-color: rgba(0, 0, 0, 0.67);
                        }
                    }
                }
            }
        }

        .leaderboard {
            height: 100%;
            overflow-y: auto;

            .leaderboard-table {
                margin: 1em;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                max-height: 100%;

                th,
                td {
                    text-align: left;
                    width: auto;
                }

                thead {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: bolder;
                    position: sticky;
                    background-color: var(--primary-color);

                    th {
                        background-color: var(--primary-color);
                        padding: 8px;
                        border-bottom: 1px solid var(--line-color);
                        width: auto;
                        position: sticky;
                        top: 0;
                    }
                }

                tbody {
                    tr {
                        color: #fff;
                        font-size: 1rem;
                        font-weight: normal;
                        height: 3rem;

                        td {
                            height: 100%;
                            padding: .5rem;
                            border-bottom: 1px solid var(--line-color);
                        }

                        &:nth-child(odd) {
                            background-color: var(--primary-color-deeper);
                        }

                        .x-text {
                            font-size: 0.9rem;
                            font-style: italic;
                            user-select: none;

                            &:hover {
                                color: #fff;
                                cursor: pointer;
                            }
                        }

                        .player-button {
                            margin-top: auto;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            background-color: var(--btn-color);
                            border-radius: 66px;
                            overflow: hidden;
                            user-select: none;
                            transition: all .2s ease-out;
                            padding: .25rem 2rem .25rem .25rem;
                            gap: 1rem;

                            &:hover {
                                background-color: var(--btn-hover-color);
                                transform: scale(1.05);
                                filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
                                -webkit-filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.5));
                            }

                            img {
                                width: 32px;
                                height: 32px;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }

    .activities-box {
        width: $activity-list-width;
    }
}
</style>