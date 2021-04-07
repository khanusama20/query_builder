<template>
    <div id="root">
        <v-toolbar color="primary" app dark fixed>
            <v-toolbar-title>Mongo Query Builder</v-toolbar-title>                
        </v-toolbar>
        <v-app>
            <v-card class="ml-3">
                <v-content>
                    <query-builder></query-builder>
                </v-content>
            </v-card>
        </v-app>
    </div>
</template>

<style>
    #root {
        font-family: 'Roboto',sans-serif!important;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>

<script>
import QueryBuilder from './views/QueryBuilder'
// import appTree from './views/Tree'
// import QueryMaker from './views/QueryMaker'
export default {
    components: {
        'query-builder': QueryBuilder,
        // 'app-tree': appTree,
        // 'query-maker': QueryMaker
    }
}
</script>

