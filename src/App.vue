<template>
    <div id="root">
        <v-app>
            <query-builder></query-builder>
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

