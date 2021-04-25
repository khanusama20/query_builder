<template>
    <div id="root">
        <v-toolbar color="primary" app dark fixed>
            <v-toolbar-title>Mongo Query Builder</v-toolbar-title>                
        </v-toolbar>
        <v-app>
            <!-- <v-card class="ml-3"> -->
                <v-content>
                    <query-builder @onQueryGenerated="onQueryGenerated"></query-builder>
                </v-content>
            <!-- </v-card> -->

            <v-footer>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card>
                            <v-card-title primary-title>
                                Histories:
                            </v-card-title>
                            <v-card-text>
                                <p class="mb-1" v-for="(text, li) in queryHistory" :key="'hs'+li">{{text}}</p>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-footer>
        </v-app>
    </div>
</template>

<style>
    #root {
        font-family: 'Roboto',sans-serif!important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .custom_input_box {
        border: 1px solid #b8b8b8;
        border-radius: 5px;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 3px;
        padding-bottom: 3px;
        outline: none;
        font-size: 14px;
    }
</style>

<script>
import QueryBuilder from './views/QueryBuilder'
export default {
    components: {
        'query-builder': QueryBuilder
    },
    data () {
        return {
            queryHistory: []
        }
    },
    methods: {
        onQueryGenerated (queryText) {
            this.queryHistory.push(queryText)
        }
    }
}
</script>

