<template>
    <div class="layout h-full p-2">
        <!-- Navbar -->
        <nav>
            <!-- Logo -->
            <RouterLink class="logo" to="/">
                <img src="/logo-navbar.png" width="55" height="55">
            </RouterLink>
            <!-- Buttons -->
            <RouterLink class="menu about" :class="{ active: currentPageName === 'About' }" to="/about">
                <span class="icon material-icon material-symbols-outlined notranslate component">info</span>About
            </RouterLink>
            <RouterLink class="menu hashtags" :class="{ active: currentPageName === 'Hashtags' }" to="/hashtags">
                <span class="icon material-icon material-symbols-outlined notranslate component">tag</span>Hashtags
            </RouterLink>
            <RouterLink class="menu creators" :class="{ active: currentPageName === 'Creators' }" to="/creators">
                <span class="icon material-icon material-symbols-outlined notranslate component">person</span>Creators
            </RouterLink>
            <RouterLink class="menu groups" :class="{ active: currentPageName === 'Groups' }" to="/groups"><span
                    class="icon material-icon material-symbols-outlined notranslate component">diversity_3</span>Groups
            </RouterLink>
            <RouterLink class="menu points" :class="{ active: currentPageName === 'Points' }" to="/points">
                <span
                    class="icon material-icon material-symbols-outlined notranslate component">local_activity</span>Points
            </RouterLink>
            <RouterLink class="menu guide" :class="{ active: currentPageName === 'Guide' }" to="/guide">
                <span class="icon material-icon material-symbols-outlined notranslate component">
                    help
                </span>Guide
            </RouterLink>
        </nav>
        <!-- Main -->
        <main>
            <div class="title-bar">
                <h1>{{ currentPageName }}</h1>
                <section class="user">
                    <!-- Change Theme -->
                    <button @click="handleClickThemeSettings">
                        <span class="material-icon material-symbols-outlined notranslate component">brightness_4</span>
                    </button>
                    <!-- Link Wallet -->
                    <button>
                        <span class="title">Link wallet</span>
                    </button>
                    <!-- Documentation -->
                    <button>Documentation</button>
                </section>
            </div>
            <section class="content">
                <slot />
            </section>
        </main>
        <!-- Mask -->
        <div class="modal-mask" v-if="showThemeSettings" @click="handleClickMask">
            <div class="modal-card" @click="(e) => e.stopPropagation()">
                <div class="modal-card-header">Theme Settings</div>
                <div class="modal-card-body">
                    <div class="modal-card-grid">
                        <div class="theme-box" @click="handleClickTheme(theme)" v-for="theme in  Object.keys(themes) "
                            :style="{ backgroundColor: themes[theme]['--primary-color'] }">
                        </div>
                    </div>
                    <!-- Save Button -->
                    <button class="btn-save" @click="handleSaveTheme">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { routes } from '../routes';
import themes from './themes';

export default {
    created() {
        document.title = 'Thunder Dome';
    },
    watch: {
        "$route.fullPath": {
            immediate: true,
            handler(fullPath) {
                if (fullPath === '/') {
                    this.currentPageName = 'About';
                    return;
                }
                this.currentPageName = routes.find(r => r.path == fullPath).name;
            }
        },
    },
    data() {
        return {
            routes, currentPageName: '', showThemeSettings: false,
            themes
        }
    },
    components: {
        RouterLink
    },
    methods: {
        handleClickThemeSettings(e) {
            e.stopPropagation();
            this.showThemeSettings = true;
        },
        handleClickMask(e) {
            e.stopPropagation();
            this.showThemeSettings = false;
            // Undo theme changes
            this.loadThemesFromStorage();
        },
        handleClickTheme(theme) {
            this.theme = theme;
            this.applyTheme();
        },
        handleSaveTheme() {
            localStorage.setItem('theme', this.theme);
            this.applyTheme();
            this.showThemeSettings = false;
        },
        loadThemesFromStorage() {
            let _theme = localStorage.getItem('theme');
            if (!_theme) {
                _theme = Object.keys(themes)[0] ?? 'blue';
                localStorage.setItem('theme', _theme);
            }
            this.theme = _theme;
            this.applyTheme();
        },
        applyTheme() {
            for (let [key, value] of Object.entries(themes[this.theme])) {
                document.documentElement.style.setProperty(key, value);
            }
        }
    },
    created() {
        this.loadThemesFromStorage();
    }
}
</script>

<style lang="scss" scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.layout {
    background-color: var(--primary-color);
    padding: 0;
    overflow: hidden;
    transition: background-color .5s ease-out;

    nav {
        position: fixed;
        left: 0;
        top: 0;
        padding-bottom: 32px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        width: 90px;
        border-right: 1px solid var(--line-color);

        .logo {
            padding: 21px 0;
            transition: all .2s ease-out;

            &:hover {
                transform: scale(1.2);
                filter: drop-shadow(0 0 5px var(--line-color));
                -webkit-filter: drop-shadow(0 0 5px var(--line-color));
            }

            img {
                max-width: 55px;
                max-height: 55px;

            }
        }

        .menu {
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: center;
            font-size: 13px;
            color: #fff;
            transition: all .2s ease-out;
            overflow: hidden;
            border-radius: 10px;
            background-color: var(--primary-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            width: 64px;
            height: 72px;

            &.active,
            &:hover {
                transform: scale(1.15);
                background-color: var(--primary-color-deeper);
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.12) inset;
                text-shadow: 0 0 2px #fff;
            }

            .icon {
                font-size: 42px;
            }
        }
    }

    main {
        height: 100%;
        padding-left: 90px;
        padding-top: 56px;
        display: flex;
        overflow: hidden;

        .title-bar {
            position: fixed;
            z-index: 1;
            top: 0;
            left: 90px;
            border-bottom: 1px solid var(--line-color);
            height: 56px;
            width: calc(100% - 90px);
            font-size: 16px;
            display: flex;
            align-items: center;
            padding: 0 20px;

            h1 {
                display: block;
                font-size: 1.25rem;
                letter-spacing: 2px;
                font-weight: bolder;
                unicode-bidi: isolate;
                color: #fff;
            }

            section.user {
                justify-content: flex-end;
                margin-left: auto;
                display: flex;
                align-items: center;
                gap: 20px;

                button {
                    background-color: var(--btn-color);
                    color: #fff;
                    cursor: pointer;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                    transition: all .2s ease-out;

                    &:hover {
                        background-color: var(--btn-hover-color);
                        text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
                        box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
                        color: #555;
                    }
                }
            }
        }

        .content {
            flex-grow: 1;
            position: relative;
            overflow: hidden;
        }
    }

    .modal-mask {
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        animation: fadeIn .5s ease-out;

        .modal-card {
            background-color: #fff;
            border-radius: 6px;
            padding: 20px;
            box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            gap: 20px;
            user-select: none;

            .modal-card-header {
                font-size: 18px;
                color: #333;
                font-weight: bold;
                text-align: center;
            }

            .modal-card-body {
                display: flex;
                flex-direction: column;
                gap: 20px;

                .modal-card-grid {
                    display: grid;
                    // 4 columns
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;

                    .theme-box {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        border: 3px solid #fff;
                        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
                        transition: all .2s ease-out;
                        cursor: pointer;

                        &:hover {
                            transform: scale(1.1);
                            box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.2);
                        }
                    }
                }

                .btn-save {
                    background-color: var(--btn-color);
                    color: #fff;
                    cursor: pointer;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                    transition: all .2s ease-out;

                    &:hover {
                        background-color: var(--btn-hover-color);
                        text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
                        box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
                        color: #eee;
                    }
                }
            }
        }
    }
}
</style>