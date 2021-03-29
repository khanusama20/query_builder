<template>
  <v-container fluid>
    <v-layout row nowrap justify-center>
      <v-flex lg8 class="mb-2 pr-2">
        <v-card>
          <v-card-text>
            <v-layout row wrap style="border: 1px solid #e7e7e7c9">
              <v-btn 
                v-for="(tab, index) in tabs" 
                :key="index" :color="tab.active ? 'primary' : 'white'" 
                class="text-capitalize"
                @click="onTabChange(tab, index)"
              >
                {{tab.label}}
              </v-btn>
            </v-layout>
            <!-- <mongoose-query-builder @onQueryUpdate="onQueryUpdate" /> -->
            <mongodb-builder 
              @onQueryUpdate="onQueryUpdate" 
              @onQueryMethodChanged="applyDissabled = false" 
              @onChildTabChanged="applyDissabled = true"
            ></mongodb-builder>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="red" flat @click="resetThings">Reset</v-btn> -->
            <v-btn color="primary" flat @click="dialog = true" :disabled="applyDissabled">Apply</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- <v-flex lg4 class="pl-2">
        <v-card class="pa-3">
          <v-textarea
          name="input-7-1"
          label="Mongoose Query"
          :value="finalQuery"
        ></v-textarea>
        </v-card>        
      </v-flex> -->
    </v-layout>
    <v-dialog
      v-model="dialog"
      max-width="690"
    >
      <v-card>
        <v-card-title class="headline">Query</v-card-title>
        <v-card-text>
          <span class="body-2">{{finalQuery}}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog = false"
          >
            Close
          </v-btn>

          <!-- <v-btn
            color="green darken-1"
            flat="flat"
            @click="copyCommand"
          >
            Copy
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import MongooseQueryBuilder from '../components/MongooseBuilder'
  import MongoDBBuilder from '../components/MongoDBBuilder'
  export default {
    data () {
      return {
        tabs: [
          {
            label: 'MongoDB',
            value: 'mongodb_builder',
            active: true,
            color: 'primary'
          },
          // {
          //   label: 'Mongoose Query Builder',
          //   value: 'mongoose_builder',
          //   active: false,
          //   color: 'primary'
          // }
        ],
        finalQuery: '',
        dialog: false,
        applyDissabled: true
      }
    },
    components: {
      'mongoose-query-builder': MongooseQueryBuilder,
      'mongodb-builder': MongoDBBuilder
    },
    methods: {
      /**
       * We have two builders 1) Mongoose and 2) MongoDB
       */
      onTabChange (tab, index) {
        for (let i = 0; i < this.tabs.length; i++) {
          if (i == index) {
            this.tabs[index].active = true;
          } else {
            this.tabs[i].active = false;
          }
        }
      },
      onQueryUpdate (query) {
        this.finalQuery = query;
        // this.dialog = true;
      },
      resetThings () {
        // todo
      },
      copyCommand () {

      }
    }
  }
</script>