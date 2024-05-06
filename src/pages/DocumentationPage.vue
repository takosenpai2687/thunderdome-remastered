<template>
    <div class="docs-wrapper">
        <!-- Input -->
        <div class="input-container">
            <input type="text" v-model="filterSearch" @input="handleSearch" placeholder="Search for a documentation">
        </div>
        <!-- Quick Search Buttons -->
        <div class="button-group">
            <button :class="{ active: tags[tag] }" v-for="tag in Object.keys(tags)"
                @click="handleClickFilterByTag(tag)">{{ tag }}</button>
        </div>
        <!-- All Documentations -->
        <div v-if="!searching" class="docs-flex">
            <div v-for="cat in Object.keys(docs)" :key="'doc-cat-' + cat">
                <h3>{{ cat }}</h3>
                <div class="category-card">
                    <div class="doc-row" v-for="doc in docs[cat] ?? []">
                        <router-link :to="doc.link">{{ doc.title }}</router-link>
                        <div class="doc-tags">
                            <span v-for="tag in doc.tags" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filtered Documentations -->
        <div v-if="searching" class="docs-flex">
            <div>
                <h3>Search Results</h3>
                <div class="category-card result">
                    <!-- Has Result -->
                    <div v-if="filteredDocs && filteredDocs.length > 0" class="doc-row"
                        v-for="doc in filteredDocs ?? []">
                        <router-link :to="doc.link">{{ doc.title }}</router-link>
                        <div class="doc-tags">
                            <span v-for="tag in doc.tags" :key="tag">{{ tag }}</span>
                        </div>
                    </div>
                    <!-- No Result -->
                    <div v-else>
                        <p class="text-gray-600">No documentation found</p>
                    </div>
                </div>
            </div>
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
            docs: {},
            filteredDocs: [],
            filterSearch: '',
            searching: false,
            tags: {}
        }
    },
    methods: {
        async fetchData() {
            const _docs = await axios.get('/mock/documentation.json').then(res => res.data);
            this.docs = _docs;
            const _tagNames = [...Object.values(_docs).flat().reduce((acc, doc) => {
                doc.tags.forEach(tag => {
                    if (!acc.has(tag)) {
                        acc.add(tag);
                    }
                });
                return acc;
            }, new Set())];
            _tagNames.sort();
            for (const tag of _tagNames) {
                this.tags[tag] = false;
            }
        },
        handleSearch(e) {
            // Reset tags active
            Object.keys(this.tags).forEach(tag => this.tags[tag] = false);
            const _search = this.filterSearch.trim().toLocaleLowerCase();
            this.searching = _search !== "";
            if (!this.searching) {
                return;
            }
            this.filteredDocs = Object.values(this.docs).flat().filter(doc => doc.title.toLocaleLowerCase().includes(_search));
        },
        handleClickFilterByTag(tag) {
            if (this.tags[tag]) {
                // Undo filter if already active
                this.tags[tag] = false;
                this.filteredDocs = [];
                this.searching = false;
                return;
            }
            // Do filter
            this.searching = true;
            Object.keys(this.tags).forEach(tag => this.tags[tag] = false);
            this.tags[tag] = true;
            this.filteredDocs = Object.values(this.docs).flat().filter(doc => doc.tags.includes(tag));
        }
    }
}
</script>

<style lang="scss" scoped>
$v-gap: 2rem;

.docs-wrapper {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    gap: $v-gap;

    .input-container {
        margin-top: $v-gap;
        width: 36rem;
        padding: 0.67rem 1.25rem;
        background-color: #fff;
        color: #000;
        border-radius: 19rem;
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.2) inset;

        input {
            width: 100%;
            outline: none;
            background-color: transparent;
            color: #333;
            font-size: 1.1em;
        }
    }

    .button-group {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        button {
            padding: .75rem 4rem;
            background-color: var(--btn-color);
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
            color: #fff;
            border: none;
            border-radius: .5rem;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);

            &.active {
                background-color: var(--btn-hover-color);
                box-shadow: 0 0 3px 1px var(--btn-hover-color);
            }

            &:hover {
                background-color: var(--btn-hover-color);
            }
        }
    }

    .docs-flex {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;

        h3 {
            width: 100%;
            text-align: center;
            font-size: 1.2em;
            color: #fff;
            padding: 1rem;
            user-select: none;
            font-weight: bold;
            letter-spacing: .2rem;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
            background-color: var(--btn-color);
            border-radius: 0.5rem 0.5rem 0 0;
        }

        .category-card {
            width: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
            background-color: #fff;
            padding: 1rem;
            border-radius: 0 0 0.5rem 0.5rem;

            &:not(.result) {
                height: 32rem;
            }

            &.result {
                min-height: 3.6rem;
                max-height: 32rem;
            }

            .doc-row {
                padding: 0.5rem;
                background-color: #f5f5f5;
                border-radius: 0.5rem;
                transition: all 0.3s;
                width: 20rem;
                justify-content: space-between;
                align-items: center;
                display: flex;

                .doc-tags {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;

                    span {
                        padding: 0.25rem 0.5rem;
                        background-color: var(--btn-color);
                        color: #fff;
                        border-radius: 0.2rem;
                        font-size: 0.8rem;
                        font-weight: bold;
                    }
                }

                &:hover {
                    background-color: var(--btn-color);
                    color: #fff;
                }
            }
        }

    }
}
</style>