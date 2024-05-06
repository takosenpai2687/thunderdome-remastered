<template>
    <div class="guide-wrapper">
        <div class="guide-panel">
            <iframe class="youtube-iframe" src="https://www.youtube.com/embed/CiKULopMtKk?si=LIlN1ROkYjvwnWFB"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div class="faq-panel">
            <div class="faq-header">Frequently Asked Questions</div>
            <div class="faq-items-list">
                <div class="faq-item" :key="'faq-' + i" v-for="(faq, i) in faqs">
                    <p class="faq-question">{{ faq.Q }}</p>
                    <p class="faq-answer">{{ faq.A }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    mounted() {
        this.fetchData();
    },
    data() {
        return {
            faqs: []
        }
    },
    methods: {
        async fetchData() {
            const _faqs = await axios.get('/mock/faq.json').then(res => res.data);
            this.faqs = new Array(5).fill(_faqs).flat();
        }
    }
}
</script>

<style lang="scss" scoped>
$faq-panel-width: 40%;

@keyframes jelly-bounce {
    0% {
        transform: scale(1);
    }

    25% {
        transform: scale(1.02);
    }

    50% {
        transform: scale(0.98);
    }

    75% {
        transform: scale(1.02);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes slideInFromBottom {
    0% {
        transform: translateY(100%);
    }

    100% {
        transform: translateY(0);
    }

}

.guide-wrapper {
    display: flex;
    height: 100%;

    .guide-panel {
        width: calc(100% - $faq-panel-width);
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .youtube-iframe {
            width: 80%;
            height: 80%;
            object-fit: cover;
            border-radius: 1rem;
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.15);
            animation: jelly-bounce 1s ease-out;
        }
    }

    .faq-panel {
        border-left: 1px solid var(--line-color);
        width: $faq-panel-width;

        .faq-header {
            font-size: 1.25rem;
            font-weight: bolder;
            padding: 1rem;
            border-bottom: 1px solid var(--line-color);
            color: #fff;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
            user-select: none;
        }


        .faq-items-list {
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            align-items: center;
            justify-content: flex-start;
            height: 100%;
            overflow-y: scroll;

            .faq-item {
                padding: 1rem;
                background-color: var(--primary-color);
                transition: all .3s ease-out;
                box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.15);
                border-radius: 1rem;
                color: #fff;
                animation: slideInFromBottom .3s ease-out;

                &:hover {
                    background-color: var(--primary-color-deeper);
                }

                .faq-question {
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
                    margin-bottom: 1rem;
                }

                .faq-answer {
                    font-size: 1rem;
                    text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
                }
            }
        }
    }
}
</style>