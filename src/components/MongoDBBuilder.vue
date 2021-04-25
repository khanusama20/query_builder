<template>
  <div>
    <v-layout row wrap class="mb-3 mt-3">
      <v-flex xs12 sm12 md12 lg12 class="pa-2">
        <v-text-field
          outline
          v-model="queryContruct.collection"
          label="Model or Schema Name"
          placeholder="Please enter name of your model or schema"
          @input="generateQuery"
          hide-details
        ></v-text-field>
      </v-flex>
    </v-layout>
    <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Query Option</p>
    <v-divider class="ml-2"></v-divider>
    <v-layout row wrap class="mt-2">
      <v-btn 
        v-for="(tab, index) in tabs"
        :color="tab.active ? 'primary' : 'white'"  
        :key="index"
        small
        @click="onTabChange(tab, index)"
      >
        {{tab.label}}
      </v-btn>
    </v-layout>
    <p class="subheading font-weight-medium pl-2 pb-2 mb-0 mt-3">Collection Methods</p>
    <v-divider class="ml-2"></v-divider>
    <v-radio-group 
      class="ml-1 mt-2"
      :mandatory="true" 
      v-model="radios"
      :row="true"
      color="red" 
      @change="onRadioChange"
    >
      <v-radio 
        v-for="(opt, id) in queryTypeOption" 
        :key="id" 
        color="#1976d2"
        :label="opt.label" 
        :value="opt.value">
      </v-radio>
    </v-radio-group>

    <!-- contentVisiblity: {
        isProjectionRequired: true,
        isFiltersRequired: true
      } -->

    <v-checkbox 
      label="Are you want to add search filters?" 
      v-model="contentVisiblity.isFiltersRequired"
      color="primary"
      @change="onCheckBoxChangedItsState('filter')"
    ></v-checkbox>

    <div v-if="contentVisiblity.isFiltersRequired === true">
      <!-- <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Logical Operator</p> -->
      <!-- <v-divider class="ml-2"></v-divider> -->

      <v-treeview :items="items">
        <template v-slot:label="{ item }">
          <div class="query-container-border pa-2 mb-2">
            <v-radio-group 
              v-model="item.operator" 
              class="ma-0 ml-1 mb-2" color="success" 
              :mandatory="false"
              hide-details 
              :row="true" 
              @change="onOperatorChange(item)"
            >
              <v-radio color="#1976d2" label="AND" value="$and"></v-radio>
              <v-radio color="#1976d2" label="OR" value="$or"></v-radio>
              <!-- <v-radio color="#1976d2" label="$and" value="$not"></v-radio>
              <v-radio color="#1976d2" label="$or" value="$nor"></v-radio> -->
              <!-- <v-radio color="#1976d2" label="NON" value=""></v-radio> -->
            </v-radio-group>
      
            <!-- <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Query Documents</p> -->
            <!-- <v-divider class="ml-2"></v-divider> -->
            <v-layout
              align-center 
              row 
              wrap 
              v-for="(model, index) in item.dynamicElementsModelInfo" 
              :key="index"
              class="query-container-border mb-2"
            >
              <v-flex xs12 sm12 md4 lg12 v-if="model.deleteThisElement === false">
                <v-layout row nowrap>
                  <v-flex xs12 sm12 md4 lg5 class="pa-2">
                    <!-- <v-text-field
                      v-model="model['pathName_'+item.id+'_'+(index + 1)]"
                      label="Path Name"
                      placeholder="Key name"
                      hide-details
                      @input="onInputChange"
                    ></v-text-field> -->
                    <input 
                      type="text"
                      class="custom_input_box"
                      @input="onInputChange" 
                      placeholder="Key name" 
                      v-model="model['pathName_'+item.id+'_'+(index + 1)]" 
                    />
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg3 class="pa-2">
                    <select 
                      v-model="model['comparison_operator_'+item.id+'_'+(index + 1)]" 
                      class="custom_input_box"
                      @change="onQueryItemChange"
                    >
                      <option 
                        v-for="(item, li) in comparisonQueryOperators" 
                        :key="li" :value="item.value"
                      >
                        {{item.text}}
                      </option>
                    </select>
                    <!-- <v-select
                      v-model="model['comparison_operator_'+item.id+'_'+(index + 1)]"
                      :items="comparisonQueryOperators"
                      item-text="text" 
                      item-value="value"
                      label="Comparison Operator"
                      single-line
                      hide-details
                      @change="onQueryItemChange"
                    ></v-select> -->
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg2 class="pa-2">
                    <!-- <v-select
                      v-model="model['data_type_'+item.id+'_'+(index + 1)]"
                      :items="dataTypes"
                      label="Data Type"
                      hide-details
                      single-line
                      @change="onQueryItemChange"
                    ></v-select> -->

                    <select 
                      v-model="model['data_type_'+item.id+'_'+(index + 1)]" 
                      class="custom_input_box"
                      @change="onQueryItemChange"
                    >
                      <option 
                        v-for="(item, li) in dataTypes" 
                        :key="'data_type'+li" :value="item"
                      >
                        {{item}}
                      </option>
                    </select>
                  </v-flex>
                  <v-flex xs12 sm12 md4 lg5 class="pa-2">
                    <!-- <v-text-field
                      v-model="model['searchBy_'+item.id+'_'+(index + 1)]"
                      label="Filter By"
                      placeholder="Search value"
                      hide-details
                      @input="onInputChange"
                    ></v-text-field> -->

                    <input 
                      type="text"
                      class="custom_input_box"
                      @input="onInputChange" 
                      placeholder="Filter By" 
                      v-model="model['searchBy_'+item.id+'_'+(index + 1)]"
                    />
                  </v-flex> 
                </v-layout>
                <v-btn color="error" dark small depressed round>remove</v-btn>
              </v-flex>
              <!-- <v-flex xs12 sm12 md4 lg2 class="text-xs-right" v-if="model.deleteThisElement === false">
                <v-btn color="error" small @click="deleteElementFromTheTree(item, model, index)">Delete</v-btn>
              </v-flex>       -->
            </v-layout>
            <v-layout row wrap>
              <v-btn color="white" small @click="addNewQueryElement(item)">Add New Field</v-btn>
              <!-- <v-btn color="primary" small @click="generateFilterQueryPart">Confirm</v-btn> -->
              <v-spacer></v-spacer>
              <v-btn color="primary" small @click="addChild(item)">Add AND/OR Group</v-btn>
            </v-layout>
          </div>
        </template>
      </v-treeview>
      <v-btn color="primary" small @click="combinedAll">Confirm</v-btn>
    </div>

    <v-alert type="warning" :value="queryOptionAlert">
      Please press confirm button to commit your changes.
    </v-alert>


    <!-- projection -->
    <div v-if="contentVisiblity.openUpdateSection === false && activeTab.projection === true">
      <v-checkbox
        label="Are you want to add projections?" 
        v-model="contentVisiblity.isProjectionRequired"
        color="primary"
        @change="onCheckBoxChangedItsState('projection')"
      ></v-checkbox>
    </div>
    
    <div v-if="contentVisiblity.isProjectionRequired === true">
      <p class="subheading font-weight-medium pl-2 pb-2 mb-0 mt-3">Projection <span class="caption">(Optional)</span></p>
      <v-divider class="ml-2"></v-divider>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12 class="pa-2">
          <v-text-field
            label="Path Name"
            v-model="projectionPathName"
            placeholder="Path name which you want to project"
            v-on:keyup.enter="addProjection"
            hide-details
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-chip close 
          v-for="(path, index) in projections" 
          :key="index"
          @input="onCloseEvent(index)"
        >
          {{path}}
        </v-chip>
      </v-layout>
    </div>

    <cursor-methods
      :method="queryContruct.method"
      v-if="contentVisiblity.showCursorMethodSection === true" 
      class="mt-3" 
      @onCursorMethodActive="concatCursorMethodsToQuery"
      @onCountCursorMethodCheck="onCountCursorMethodCheck"
    ></cursor-methods>
    <mongo-update 
      v-if="contentVisiblity.openUpdateSection === true"  
      @onQueryUpdate="onMongooseUpdateEvent"
    ></mongo-update>

    <app-toast :text="toast.text" :value="toast.value" @onToastClose="toast.value = false"></app-toast>
  </div>
</template>
<script>
import CursorMethods from './CursorMethods'
import MongoUpdate from './MongooseUpdate'
import Toast from './Toast'
import { 
  STRING_COMPARISON_OPERATORS, 
  DATA_TYPES,
  QUERY_METHOD_CATEGORY,
  QUERY_METHODS_OPTIONS 
} from '../common/data'

let randomID = (howMany = 10) => {
  let chars = "0123456789";
  let pass = "";
  let passLength = howMany;
  for (let x = 0; x < passLength; x++) {
    let i = Math.floor(Math.random() * chars.length);
    pass += chars.charAt(i);
  }
  return parseInt(pass);
}
export default {
  mounted () {
    this.queryTypeOption = this.radioOptions['find'].slice(0, this.radioOptions['find'].length);
  },
  data() {
    return {
      tabs: QUERY_METHOD_CATEGORY,
      activeTab: QUERY_METHOD_CATEGORY[1],
      radioOptions: QUERY_METHODS_OPTIONS,
      operator: '',
      dataTypes: DATA_TYPES,
      comparisonQueryOperators: STRING_COMPARISON_OPERATORS,
      queryContruct: {
        collection: '',
        method: 'find',
        operator: '',
        populate: [],
        filterBy: '',
        projection: '',
        // modificationSchema: ',{$set:{age: 34, name: ashfaq}}',
        modificationSchema: '',
        optionalParams: '',
        cursorMethods: ''
      },
      queryTypeOption: [],
      dynamicElementsModelInfo: [{
        pathName_1: '',
        searchBy_1: '',
        comparison_operator_1: '',
        data_type_1: 'String'
      }],
      radios: '',
      projections: [],
      projectionPathName: '',
      
      contentVisiblity: {
        isProjectionRequired: false,
        isFiltersRequired: false,
        openUpdateSection: false,
        showCursorMethodSection: true   // only visible in the find method, and I set find as a default so this value is true
      },
      queryOptionAlert: false,
      toast: {
        text: '',
        value: false
      },
      items: [
        {
          id: randomID(),
          operator: '$and',
          dynamicElementsModelInfo: [],
          elementCounter: 1,
          children: [],
        }
      ]
    }
  },
  methods: {
    onTabChange(tab, index) {
      for (let i = 0; i < this.tabs.length; i++) {
        if (i == index) {
          this.tabs[index].active = true;
        } else {
          this.tabs[i].active = false;
        }
      }
      this.radios = '';
      this.queryTypeOption = this.radioOptions[tab.value].slice(0, this.radioOptions[tab.value].length);

      this.activeTab = JSON.parse(JSON.stringify(tab));

      /**
       * 
       */
      switch (tab.value) {
        case 'update':
          this.contentVisiblity.openUpdateSection = false
          this.contentVisiblity.showCursorMethodSection = false;
          this.contentVisiblity.isProjectionRequired = false;

          // reset projection variable
          this.queryContruct.projection = '';
          this.queryContruct.cursorMethods = '';
          break;
        case 'find':
          this.contentVisiblity.openUpdateSection = false;
          this.contentVisiblity.showCursorMethodSection = true;
          break;
      }

      this.$emit('onChildTabChanged')
    },
    onRadioChange(event) {
      this.queryContruct.method = event;
      if (event === 'update' || event === 'updateOne' || event === 'updateMany') {
        this.contentVisiblity.openUpdateSection = true;
      } else {
        this.contentVisiblity.openUpdateSection = false;
      }
      this.$emit('onQueryMethodChanged');
      this.generateQuery();
    },
    onOperatorChange (item) {
      // this.queryContruct.operator = event;
      // this.generateQuery();

      console.log("Event  : ", item);
    },
    generateQuery () {
      if (this.queryContruct.operator) {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}({\"${this.queryContruct.operator}\": [${this.queryContruct.filterBy}]}${this.queryContruct.projection}${this.queryContruct.modificationSchema})${this.queryContruct.cursorMethods}`
      } else {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}(${this.queryContruct.filterBy ? this.queryContruct.filterBy : '{}'}${this.queryContruct.modificationSchema}${this.queryContruct.projection})${this.queryContruct.cursorMethods}`
      }
      this.$emit('onQueryUpdate', this.finalQuery);
    },

    addNewQueryElement (item) {
      if (!item.dynamicElementsModelInfo) {
        this.$set(item, "dynamicElementsModelInfo", []);
      }

      item.dynamicElementsModelInfo.push({
        ['pathName_'+item.id+'_'+item.elementCounter]: '',
        ['searchBy_'+item.id+'_'+item.elementCounter]: '',
        ['comparison_operator_'+item.id+'_'+item.elementCounter]: '',
        ['data_type_'+item.id+'_'+item.elementCounter]: 'String',
        deleteThisElement: false
      });
      
      item.elementCounter += 1;
    },

    combinedAll() {
      let mongoFilterQuery = '';
      let createQuery = function(argument, isChild = false) {
        /* body... */
        let queryString = '';
        let dynamicElementsModelInfo = argument.dynamicElementsModelInfo;
        let totalElementSize = dynamicElementsModelInfo.filter(e => e.deleteThisElement === false).length;

        for (let i = 0; i < totalElementSize; i++) {
          if (dynamicElementsModelInfo[i].deleteThisElement === false) {
            if (!dynamicElementsModelInfo[i]['comparison_operator_' + argument.id + '_' + (i + 1)]) { // when deafult select
              queryString += createPieceOfQuery(argument, i, false);
            } else {
              queryString += createPieceOfQuery(argument, i, true);
            }

            if (i < totalElementSize - 1) {
              queryString += ',';
            }
          } 
        }

        // operator will add only child first
        // Note: Root operator will append last

        if (isChild === true) {
          mongoFilterQuery += `,{\"${argument.operator}\": [${queryString}]}`
        } else {
          mongoFilterQuery += queryString
        }

        if (argument.children) {
          if (argument.children.length > 0) {
            createQuery(argument.children[0], true);
          }
        }
      }

      let createPieceOfQuery = function(argument, i, operator) {
        /* body... */

        let caseId = argument.dynamicElementsModelInfo[i]['data_type_' + argument.id + '_' + (i + 1)];
        let pathName = argument.dynamicElementsModelInfo[i][`pathName_${argument.id}_${(i+1)}`];
        let searchByValue = argument.dynamicElementsModelInfo[i][`searchBy_${argument.id}_${(i+1)}`];
        let matchingOperatory = operator ? argument.dynamicElementsModelInfo[i][`comparison_operator_${argument.id}_${(i+1)}`] : "";

        switch (caseId) {
          case 'Numeric':
            return operator === false ?
              `{\"${pathName}\": ${searchByValue}}` :
              `{\"${pathName}\": {\"${matchingOperatory}\": ${searchByValue}}}`;
            // break;

          case 'String':
            return operator === false ?
              `{\"${pathName}\": \"${searchByValue}\"}` :
              `{\"${pathName}\": {\"${matchingOperatory}\": \"${searchByValue}\"}}`;
            // break;

          case 'ObjectId':
            return operator === false ?
              `{\"${pathName}\": ObjectId(\"${searchByValue}\")}` :
              `{\"${pathName}\": {\"${matchingOperatory}\": ObjectId(\"${searchByValue}\")}}`;
            // break;
        }
      }

      // start point
      createQuery(this.items[0]);
      this.queryContruct.filterBy = `{\"${this.items[0].operator}\": [${mongoFilterQuery}]}`

      this.queryOptionAlert = false;

      this.toast = {
        text: 'Your changes are commited',
        value: true
      };
      this.generateQuery();
    },

    onCloseEvent (elementIndex) {
      this.projections.splice(elementIndex, 1);
    },
    onMongooseUpdateEvent (query) {
      this.queryContruct.modificationSchema = `,{${query}}`;
      this.generateQuery();
    },
    addProjection () {
      this.projections.push(this.projectionPathName);
      let paths = '';
      for (let i = 0; i < this.projections.length; i++) {
        paths += `\"${this.projections[i]}\": 1`;

        if (i < this.projections.length - 1) {
          paths += ','
        }
      }
      this.queryContruct.projection = `,{${paths}}`
      this.projectionPathName = '';
      this.generateQuery();
    },
    onCheckBoxChangedItsState (option) {
      switch (option) {
        case 'filter':
          // todo
          this.queryContruct.filterBy = this.queryContruct.operator = ''
          this.generateQuery();
          break;
        case 'projection':
          // todo
          this.projections = [];
          this.generateQuery();
          break;
      }
    },

    onCountCursorMethodCheck () {
      this.contentVisiblity.isProjectionRequired = false;
      this.queryContruct.projection = '';
      this.projections = [];
      this.generateQuery();
    },
    concatCursorMethodsToQuery (cursorQuery) {
      this.queryContruct.cursorMethods = cursorQuery;
      this.generateQuery();
    },

    onInputChange () {
      this.queryOptionAlert = true;
    },
    onQueryItemChange () {
      this.queryOptionAlert = true;
    },
    addChild(item) {
      if (!item.children) {
        this.$set(item, "children", []);
      }

      item.children.push({
        id: randomID(),
        operator: '$and',
        elementCounter: 1,
        dynamicElementsModelInfo: [],
        children: [],
      });
    },
    // removeDynamicElements (index) {
    //   this.dynamicElementsModelInfo.splice(index, 1);
    // }

    deleteElementFromTheTree (item, model, index) {
      // todo
      item.dynamicElementsModelInfo[index].deleteThisElement = true;
      this.queryOptionAlert = true
    }
  },
  components: {
    'cursor-methods': CursorMethods,
    'mongo-update': MongoUpdate,
    'app-toast': Toast
  }
}
</script>
<style>
  .query-container-border {
    border: 1px solid rgb(180, 180, 180)!important;
    border-radius: 5px;
  }
</style>