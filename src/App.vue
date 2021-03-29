<template>
    <div id="root">
        <v-toolbar color="primary" app dark fixed>
            <v-toolbar-title>Mongo Query Builder</v-toolbar-title>                
        </v-toolbar>
        <v-app>
            <v-content>
                <!-- <v-container fluid fill-height> -->
                <query-builder></query-builder>
                <!-- </v-container>    -->
            </v-content>
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
export default {
    components: {
        'query-builder': QueryBuilder
    }
}
</script>

