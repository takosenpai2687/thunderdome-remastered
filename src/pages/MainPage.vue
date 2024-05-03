<template>
    <div class="wrapper">
        <main ref="mainRef">
            <!-- Section 1 -->
            <section class="canvas-section" ref="section1">
                <animated-canvas></animated-canvas>
            </section>
            <!-- Section 2 -->
            <section class="intro-section" ref="section2">
                <div id="line-vertical"></div>
                <div id="line-horizontal-upper"></div>
                <div id="line-horizontal-lower"></div>
                <!-- Card 1 -->
                <div class="card card-1">
                    <header>
                        <h3>Introduction to Thunder Dome</h3>
                    </header>
                    <div class="card-body">
                        <p>
                            Thunder Dome is a Full-stack Social Fi service built on the Fantom blockchain. It allows
                            users to engage with communities through tickets, which are social tokens that can be bought
                            or sold.
                        </p>
                    </div>
                </div>
                <!-- Card 2 -->
                <div class="card card-2">
                    <header>
                        <h3>Understanding Full-stack Social Fi</h3>
                    </header>
                    <div class="card-body">
                        <p>
                            Full-stack Social Fi represents an expansion from personal-focused social finance to include
                            groups and topics. In Thunder Dome, users can buy tickets to participate in and communicate
                            with communities centered around individuals, groups, or subjects.
                        </p>
                    </div>
                </div>
                <!-- Card 3 -->
                <div class="card card-3">
                    <header>
                        <h3>
                            Monetization in Thunder Dome
                        </h3>
                    </header>
                    <div class="card-body">
                        <p>
                            Regarding monetization, users can generate revenue through Thunder Dome. For individual
                            tickets, the ticket owner earns 5% of the transaction amount as profit. For group and topic
                            tickets, holders receive 5% of the transaction volume, distributed proportionally to their
                            holdings.
                        </p>
                    </div>
                </div>
            </section>
        </main>
        <activity-list></activity-list>
    </div>
</template>

<script>
import ActivityList from '../components/ActivityList.vue';
import AnimatedCanvas from '../components/AnimatedCanvas.vue';
export default {
    components: {
        ActivityList, AnimatedCanvas
    },
    methods: {
        handleWheel(e) {
            e.stopPropagation();
            const section1 = this.$refs.section1;
            const section2 = this.$refs.section2;
            const mainRef = this.$refs.mainRef;
            const parentTOp = mainRef.getBoundingClientRect().top;
            const s1Top = section1.getBoundingClientRect().top - parentTOp;
            const s2Top = section2.getBoundingClientRect().top - parentTOp;

            if (e.deltaY > 0 && s1Top <= 10 && s1Top >= 0) {
                // Scroll down
                mainRef.scrollTo({ top: section2.getBoundingClientRect().top, behavior: 'smooth' })
            } else if (e.deltaY < 0 && s2Top >= -100 && s1Top < 10) {
                // Scroll up
                mainRef.scrollTo({ top: section1.getBoundingClientRect().top, behavior: 'smooth' })
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.mainRef.addEventListener('wheel', this.handleWheel);
        });
    },
    beforeDestroy() {
        this.$refs.mainRef.removeEventListener('wheel', this.handleWheel);
    },
}
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

@keyframes floating {
    0% {
        transform: translate(-50%, -50%);
    }

    50% {
        transform: translate(-50%, -40%);
    }

    100% {
        transform: translate(-50%, -50%);
    }
}

.wrapper {
    display: flex;
    height: 100%;
    width: 100%;

    main {
        overflow: auto;
        width: calc(100% - $activity-list-width);
        height: 100%;
        background-color: transparent;

        canvas {
            width: 100%;
            height: 100%;
        }

        section {
            width: 100%;
            height: calc(100vh - 56px);
        }

        .intro-section {
            position: relative;

            #line-vertical {
                position: absolute;
                top: 25%;
                left: 75%;
                transform: translate(-50%, 0);
                width: 4px;
                height: 50%;
                background-color: #fff;
            }

            #line-horizontal-upper {
                position: absolute;
                top: 25%;
                left: 50%;
                transform: translate(-50%, 0);
                width: 50%;
                height: 4px;
                background-color: #fff;
            }

            #line-horizontal-lower {
                position: absolute;
                top: 75%;
                left: 50%;
                transform: translate(-50%, 0);
                width: 50%;
                height: 4px;
                background-color: #fff;
            }

            .card {
                position: absolute;
                transform: translate(-50%, -50%);
                color: #fff;
                width: 40%;
                background-color: var(--primary-color-deeper);
                border-radius: 1em;
                overflow: hidden;
                box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
                animation: floating 1.8s infinite ease-in-out;

                .card-body {
                    padding: 1em;
                    font-size: 1.1em;
                }

                header {
                    background-color: var(--btn-hover-color);
                    padding: 0 .5em;
                    text-align: center;
                    padding: 1em;

                    h3 {
                        font-size: 1.25em;
                        font-weight: bolder;
                        text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                    }
                }

                &.card-1 {
                    top: 25%;
                    left: 25%;
                    animation-delay: 0.25s;
                }

                &.card-2 {
                    top: 50%;
                    left: 75%;
                    animation-delay: 0.5s;
                }

                &.card-3 {
                    top: 75%;
                    left: 25%;
                    animation-delay: 0.75s;
                }
            }
        }
    }
}
</style>