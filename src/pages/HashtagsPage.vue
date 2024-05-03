<template>
    <div class="hashtags-wrapper">
        <!-- Left hand side list -->
        <div class="chatroom-list-container">
            <!-- Search bar -->
            <div class="search-container">
                <span class="icon material-icon material-symbols-outlined notranslate component">search</span>
                <input type="text" placeholder="Enter hashtags to navigate" />
            </div>
            <!-- Chatrooms -->
            <div class="chatroom-list">
                <!-- Chat Item -->
                <div class="chatroom-list-item" :key="'clt-' + idx"
                    :class="{ active: currentIdx === idx, unread: (room.unread && room.unread > 0) }"
                    v-for="(room, idx) in chatrooms" @click="handleClickChatRoom(idx)">
                    <main>
                        <header>
                            <h3>#&nbsp;{{ room.roomName }}
                                <!-- Unread bubble -->
                                <span class="unread-bubble" v-if="room.unread && room.unread > 0">{{ room.unread
                                    }}</span>
                            </h3>
                            <span class="price">{{ room.price }}</span>
                        </header>
                        <div class="last-message">
                            <div class="message">{{ room.lastMessage }}</div>
                            <div class="sent-at">{{ room.lastTime }}</div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        <div class="chatroom-main" v-if="chatrooms.length > 0">
            <!-- Header -->
            <header class="chatroom-header">
                <h3>#&nbsp;{{ chatrooms[currentIdx].roomName }}</h3>
            </header>
            <!-- Main Content -->
            <div class="chatroom-content-wrapper">
                <div class="chatroom-content" ref="chatroomContent">
                    <!-- Messages -->
                    <div class="message-box" :class="{ me: !!msg.isMe }" v-for="(msg, idx) in messages"
                        :key="'msg-' + idx">
                        <div class="avatar">
                            <img :src="msg.avatar" alt="">
                        </div>
                        <div class="message-main">
                            <div class="message-header">
                                <div class="message-username">{{ msg.username }}</div>
                                <div class="message-time">{{ msg.time }}</div>
                            </div>
                            <div class="message-text-box">
                                <p v-for="text in msg.content">{{ text }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Footer -->
            <div class="chatroom-footer">
                <div class="left-footer">
                    <!-- Attach File -->
                    <button>
                        <span class="icon material-icon material-symbols-outlined component">attach_file</span>
                    </button>
                    <!-- Input -->
                    <div class="input-wrapper">
                        <input type="text" placeholder="Starting chatting" />
                    </div>
                </div>
                <!-- Button Send -->
                <button class="btn-send">Send</button>
            </div>
        </div>
        <div class="chatroom-members">
            <!-- Members Header -->
            <div class="chatroom-members-header">
                <h3>Members</h3>
            </div>
            <!-- Members List -->
            <ul class="members-list">
                <li class="member-list-item" v-for="member in members">
                    <div class="member-avatar">
                        <img :src="member.avatar" alt="">
                    </div>
                    <span class="member-name">{{ member.name }}</span>
                    <span class="member-time">{{ member.time }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    created() {
        this.fetchData();
    },
    data() {
        return {
            chatrooms: [],
            currentIdx: 0,
            members: [],
            messages: []
        }
    },
    methods: {
        async fetchData() {
            this.chatrooms = await axios.get('/mock/chat_history.json').then(r => r.data.filter(r => r.roomName)) ?? [];
            this.currentIdx = 0;
            if (this.chatrooms[0]) {
                this.chatrooms[0].unread = 0;
            }
            this.resetMembers();
            this.resetMessages();
        },
        handleClickChatRoom(idx) {
            this.currentIdx = idx;
            this.chatrooms[idx].unread = 0;
            this.resetMembers();
            this.resetMessages();
        },
        resetMembers() {
            this.members = Array.from(this.chatrooms.flatMap(room => room.messages.map(msg => ({
                avatar: msg.avatar,
                name: msg.username,
                time: msg.time
            }))).reduce((acc, curr) => {
                if (!acc.has(curr.name)) {
                    acc.set(curr.name, curr);
                }
                return acc;
            }, new Map()).values()).filter(member => member.name);
            // Repeat self 3 times for demo scrollbar
            this.members = Array.from({ length: 5 }, () => this.members).flat();
        },
        resetMessages() {
            this.messages = this.chatrooms[this.currentIdx].messages;

            // Scroll to bottom
            this.$nextTick(() => {
                const chatroomContent = this.$refs.chatroomContent;
                chatroomContent.scrollTo({
                    top: 0,
                    behavior: 'instant'
                });
                this.$nextTick(() => {
                    const chatroomContent = this.$refs.chatroomContent;
                    // Animated
                    chatroomContent.scrollTo({
                        top: chatroomContent.scrollHeight,
                        behavior: 'smooth'
                    });
                });
            });
        }
    }
}
</script>

<style lang="scss" scoped>
$unread-text-color: #fff;
$read-text-color: #eee;
$members-width: 28rem;

.hashtags-wrapper {
    height: 100%;
    display: flex;

    .chatroom-list-container {
        width: 32em;
        height: 100%;
        border-right: 1px solid var(--line-color);
        display: flex;
        flex-direction: column;

        .search-container {
            padding: .5em;
            border-bottom: 1px solid var(--line-color);
            display: flex;
            align-items: center;
            gap: .5em;
            height: 4em;

            .icon {
                font-size: 1.5em;
                color: #fff;
            }

            input {
                width: 100%;
                padding: 10px;
                border-radius: 5px;
                outline: none;
                background-color: transparent;
                color: #fff;
                font-size: 1em;
                transition: all .2s ease-out;

                &:focus {
                    width: 100%;
                    background-color: var(--primary-color-deeper);
                }
            }
        }

        .chatroom-list {
            padding: 5px 0;
            overflow-y: auto;
            height: calc(100% - 4rem) !important;

            .chatroom-list-item {
                height: 5em;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 10px;
                border-bottom: 1px solid var(--line-color);
                cursor: pointer;
                color: $read-text-color;
                text-shadow: 0 0 1px rgba(0, 0, 0, .5);
                transition: transform 0.25s, background-color 0.1s;

                &:hover,
                &.active {
                    background-color: var(--primary-color-deeper);
                    box-shadow: 0 0 10px 2px var(--line-color) inset;
                    font-weight: bold;
                    transform: scaleY(1.15);

                    h3 {
                        text-shadow: 0 0 3px #fff;
                    }
                }

                &.unread {
                    color: $unread-text-color !important;
                }

                main {
                    width: 100%;

                    header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        h3 {
                            font-size: 1.25rem;
                            font-weight: normal;
                            padding-top: -8px;
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            font-family: "Source Code Pro", monospace;
                            letter-spacing: 1.5px;
                            text-shadow: 0 0 1px rgba(0, 0, 0, .5);
                            user-select: none;

                            .unread-bubble {
                                font-family: "roboto";
                                font-weight: bolder;
                                letter-spacing: 1px;
                                width: 1.3em;
                                height: 1.3em;
                                margin-left: 8px;
                                padding: .3em;
                                border-radius: 50%;
                                background-color: #f00;
                                color: #fff;
                                font-size: .7em;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.2);
                            }
                        }
                    }

                    .last-message {
                        padding-left: 4px;
                        display: flex;
                        align-items: center;
                        color: $read-text-color;
                        justify-content: space-between;
                    }
                }
            }
        }

    }

    .chatroom-main {
        position: relative;
        width: calc(100% - $members-width);
        height: 100%;

        .chatroom-header {
            display: block;
            width: 100%;
            height: 4rem;
            border-bottom: 1px solid var(--line-color);
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 8px 16px;
            color: #fff;
            font-weight: bold;
            font-size: 1.25em;
            letter-spacing: 3px;
        }

        .chatroom-content-wrapper {
            height: calc(100% - 128px);
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: calc(100% - 8rem);

            .chatroom-content {
                overflow-y: scroll;
                width: 100%;
                height: 100%;
                padding: 12px 4px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                gap: 8px;

                .message-box {
                    display: flex;
                    width: 100%;
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: 8px;

                    &.me {
                        flex-direction: row-reverse;

                        .message-text-box {
                            align-items: flex-end !important;
                        }
                    }

                    .avatar {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin: 8px;
                        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            object-fit: cover;
                        }
                    }

                    .message-main {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        justify-content: flex-start;
                        gap: 3px;

                        .message-header {
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            gap: 16px;

                            .message-username {
                                color: #fff;
                            }

                            .message-time {
                                color: var(--gray-font);
                                font-size: 12px;
                                font-style: italic;
                            }
                        }

                        .message-text-box {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: flex-start;
                            gap: 12px;

                            p {
                                border-radius: 4px;
                                background-color: #fff;
                                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
                                padding: 8px;
                            }
                        }
                    }
                }
            }


        }

        .chatroom-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            bottom: 0;
            height: 4em;
            border-top: 1px solid var(--line-color);
            padding: .5em;
            gap: .5em;

            .left-footer {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                height: 100%;

                // Upload Button
                button {
                    padding: .2em;
                    transition: .2s all ease-out;
                    margin-bottom: -4px;

                    &:hover {
                        filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
                        -webkit-filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
                        transform: scale(1.1);
                    }

                    span {
                        color: #fff;
                    }
                }

                // Input field
                .input-wrapper {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: .5em;
                    height: 100%;

                    input {
                        display: block;
                        padding: .2em .5em;
                        width: 100%;
                        height: 100%;
                        border-radius: 5px;
                        outline: none;
                        background-color: transparent;
                        color: #fff;
                        font-size: 1.2em;
                        transition: all .2s ease-out;

                        &:focus {
                            width: 100%;
                            background-color: var(--primary-color-deeper);
                        }
                    }
                }
            }



            // Send Button
            .btn-send {
                background-color: var(--btn-color);
                color: #fff;
                cursor: pointer;
                height: 100%;
                padding: 0 1em;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                font-weight: bold;
                transition: all .2s ease-out;
                margin-right: 8px;
                font-size: 1.2em;

                &:hover {
                    background-color: var(--btn-hover-color);
                    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
                    box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
                    color: rgba(0, 0, 0, 0.3);
                }
            }
        }
    }

    .chatroom-members {
        width: $members-width;
        height: 100%;
        border-left: 1px solid var(--line-color);
        overflow: hidden;

        .chatroom-members-header {
            height: 4rem;
            display: flex;
            color: #fff;
            padding: 0 8px;
            align-items: center;
            justify-content: flex-start;
            border-bottom: 1px solid var(--line-color);
            font-size: 1.25em;
            font-weight: bold;
            user-select: none;
        }

        .members-list {
            height: 100%;
            background-color: var(--primary-color-deeper);
            padding: 8px 0;
            overflow-y: auto;

            .member-list-item {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 8px;
                margin: 0 4px;
                padding: 4px 12px;
                background-color: var(--primary-color-deeper);
                user-select: none;
                height: 56px;
                border-radius: 8px;
                transition: all .2s ease-out;

                &:hover {
                    background-color: var(--line-color);
                    cursor: pointer;
                    box-shadow: 0 0 10px 2px var(--line-color) inset;
                    font-weight: bold;
                    text-shadow: 0 0 2px #88f;
                    transform: scaleY(1.15);
                    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1) inset;

                    .member-time {
                        color: #fff !important;
                    }
                }

                .member-name {
                    color: #fff;
                    font-size: 1.15rem;
                    font-weight: bold;
                    padding: 8px;
                }

                .member-time {
                    color: var(--gray-font);
                    font-size: 1em;
                    font-style: italic;
                    margin-left: auto;
                    text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
                }

                .member-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                    }
                }
            }

        }
    }
}
</style>