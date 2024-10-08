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
                    <!-- Documentation -->
                    <router-link to="/documentation">Documentation</router-link>
                    <!-- Link Wallet -->
                    <button v-if="!isLoggedIn" @click="handleClickLinkWallet">
                        <span class="title">Link wallet</span>
                    </button>
                    <!-- Avatar Button -->
                    <div class="avatar-button" v-if="isLoggedIn" @click="handleClickAvatar">
                        <img :src="avatar" class="avatar" alt="">
                    </div>
                </section>
            </div>
            <section class="content">
                <slot />
            </section>
        </main>
        <!-- Mask -->
        <div class="modal-mask" :class="{ 'blur-effect': shouldBlur }"
            v-if="showThemeSettings || showLinkWallet || showUserMenu" @click="handleClickMask">
            <!-- Show Theme Settings -->
            <div class="modal-card" v-if="showThemeSettings" @click="(e) => e.stopPropagation()">
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
            <!-- Show Link Wallet -->
            <div class="modal-card" v-if="showLinkWallet">
                <div class="modal-card-header">Connect to a Wallet</div>
                <div class="modal-card-body">
                    <div class="flex flex-col items-center justify-center gap-4">
                        <div class="w-full wallet-row flex flex-row items-center justify-start gap-4"
                            v-for="k in Object.keys(wallets)" @click="handleLinkWallet">
                            <img :src="wallets[k]" alt="avatar" class="w-12 h-12 rounded-full">
                            <span>{{ k }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Show logout -->
            <div class="logout-menu" v-if="showUserMenu">
                <button @click="handleLogout">
                    <span class="material-icon material-symbols-outlined notranslate component">logout</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';
import { routes } from '../routes';
import themes from './themes';

const avatars = ['/img/avatar-1.jpg', '/img/avatar-2.jpg', '/img/avatar-3.png'];
const wallets = {
    'MetaMask': '/img/metamask.svg',
    'Coinbase Wallet': '/img/coinbase-wallet.svg',
    'Walletconnect': '/img/walletconnect.svg'
}

export default {
    mounted() {
        document.title = 'Thunder Dome';
        // Check login
        this.isLoggedIn = JSON.parse(localStorage.getItem('loggedin') ?? 'false');
        if (this.isLoggedIn) {
            this.avatar = localStorage.getItem('avatar') ?? '';
        }
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
            themes,
            showLinkWallet: false,
            isLoggedIn: false,
            wallets,
            avatar: '',
            showUserMenu: false,
        }
    },
    computed: {
        shouldBlur() {
            if (this.showUserMenu) return false;
            return true;
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
            // Closing theme settings
            if (this.showThemeSettings) {
                this.showThemeSettings = false;
                // Undo theme changes
                this.loadThemesFromStorage();
            }
            // Closing link wallet
            if (this.showLinkWallet) {
                this.showLinkWallet = false;
            }
            // Closing user menu
            if (this.showUserMenu) {
                this.showUserMenu = false;
            }
        },
        handleClickLinkWallet() {
            this.showLinkWallet = true;
        },
        handleLinkWallet() {
            this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
            localStorage.setItem('avatar', this.avatar ?? '');
            localStorage.setItem('loggedin', JSON.stringify(true));
            this.showLinkWallet = false;
            this.isLoggedIn = true;
        },
        handleLogout() {
            this.showLinkWallet = false;
            this.avatar = '';
            this.isLoggedIn = false;
            localStorage.removeItem('avatar');
            localStorage.setItem('loggedin', JSON.stringify(false));
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
        },
        handleClickAvatar(e) {
            e.stopPropagation();
            this.showUserMenu = true;
        }
    },
    created() {
        this.loadThemesFromStorage();
    }
}
</script>

<style lang="scss" scoped>
$nav-width: 6.4rem;
$menu-width: 5em;
$toolbar-height: 4rem;

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideFromLeft {
    from {
        transform: translateX(-50%);
    }

    to {
        transform: translateX(0);
    }
}

.layout {
    background-color: var(--primary-color);
    padding: 0;
    overflow: hidden;
    transition: background-color .5s ease-out;

    nav {
        user-select: none;
        position: fixed;
        left: 0;
        top: 0;
        padding-bottom: 2rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 2rem;
        width: $nav-width;
        border-right: 1px solid var(--line-color);

        .logo {
            padding: 1rem 0;
            transition: all .25s ease-out;

            &:hover {
                transform: scale(1.15) rotate(360deg);
                filter: drop-shadow(0 0 5px var(--line-color));
                -webkit-filter: drop-shadow(0 0 5px var(--line-color));
            }

            img {
                max-width: 3.6rem;
                max-height: 3.6rem;
            }
        }

        .menu {
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: center;
            font-size: 1em;
            color: #fff;
            transition: all .5s ease-out;
            overflow: hidden;
            border-radius: 10px;
            background-color: var(--primary-color);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            width: $menu-width;
            height: $menu-width;

            &.active,
            &:hover {
                .icon {
                    transform: scale(1.2);
                    filter: drop-shadow(0 0 3px var(--line-color));
                    -webkit-filter: drop-shadow(0 0 3px var(--line-color));
                }

                background-color: var(--primary-color-deeper);
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15) inset;
                text-shadow: 0 0 2px #fff;
            }

            .icon {
                font-size: 2em;
                transition: all .2s ease-out;
            }
        }
    }

    main {
        height: 100%;
        padding-left: $nav-width;
        padding-top: $toolbar-height;
        display: flex;
        overflow: hidden;

        .title-bar {
            user-select: none;
            position: fixed;
            z-index: 1;
            top: 0;
            left: $nav-width;
            border-bottom: 1px solid var(--line-color);
            height: $toolbar-height;
            width: calc(100% - $nav-width);
            display: flex;
            align-items: center;
            padding: 0 0.5rem 0 1rem;

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
                gap: 1.2rem;

                .icon {
                    font-size: 1rem;
                }


                button,
                a {
                    background-color: var(--btn-color);
                    color: #fff;
                    cursor: pointer;
                    padding: .5rem 1rem;
                    display: flex;
                    height: 3rem;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px;
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                    font-weight: bold;
                    transition: all .2s ease-out;
                    font-size: 1rem;

                    &:hover {
                        background-color: var(--btn-hover-color);
                        text-shadow: 0 0 1px rgba(255, 255, 255, 0.2);
                        box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.5);
                        color: rgba(0, 0, 0, 0.6);
                    }

                }

                .avatar-button {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    justify-content: center;
                    padding-right: .5rem;

                    img.avatar {
                        width: 2.5rem;
                        height: 2.5rem;
                        border-radius: 50%;
                        transition: 0.2s all ease-out;
                    }

                    &:hover {
                        cursor: pointer;

                        img {
                            transform: scale(1.1);
                            box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
                        }
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
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn .5s ease-out;
        z-index: 998;
        background-color: rgba(0, 0, 0, 0.15);

        &.blur-effect {
            backdrop-filter: blur(1.2rem);
            -webkit-backdrop-filter: blur(1.2rem);
            background-color: rgba(255, 255, 255, 0.2);
        }

        .modal-card {
            background-color: #fff;
            border-radius: .5rem;
            padding: 1.25rem;
            box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            user-select: none;
            z-index: 999;

            .modal-card-header {
                font-size: 18px;
                color: #333;
                font-weight: bold;
                text-align: center;
            }

            .modal-card-body {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;

                .wallet-row {
                    border-radius: .5rem;
                    padding: 1rem;
                    border: 1px solid var(--line-color);
                    transition: all .3s ease-out;
                    cursor: pointer;
                    font-weight: bold;
                    color: #333;

                    * {
                        transition: all .2s ease-out;
                    }

                    img {
                        width: 2.5rem;
                        height: 2.5rem;
                    }

                    &:hover {
                        background-color: var(--primary-color-deeper);
                        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
                        color: #fff;

                        * {
                            transform: scale(1.1);
                        }

                        img {
                            border: 4px solid #fff;
                            box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1) inset;
                        }
                    }
                }

                .modal-card-grid {
                    display: grid;
                    // 4 columns
                    grid-template-columns: repeat(6, 1fr);
                    gap: 10px;

                    .theme-box {
                        width: 3.5rem;
                        height: 3.5rem;
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
                    padding: 0.5rem 1rem;
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
                        color: rgba(0, 0, 0, 0.6);
                    }
                }
            }
        }

        .logout-menu {
            position: fixed;
            top: $toolbar-height;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            justify-content: flex-start;
            align-items: center;
            padding: .5rem;

            button {
                padding: 0.8rem;
                color: #eee;
                background-color: var(--btn-color);
                border-radius: .2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .2rem;
                transition: all .2s ease-out;
                font-weight: bold;
                font-size: 1.1rem;

                span {
                    animation: slideFromLeft .3s ease-out;
                }

                &:hover {
                    background-color: var(--btn-hover-color);
                    text-shadow: 0 0 2px rgba(255, 255, 255, 0.5);
                    color: rgba(0, 0, 0, 0.6);
                }
            }
        }
    }
}
</style>