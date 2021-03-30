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
      <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Logical Operator</p>
      <v-divider class="ml-2"></v-divider>
      <v-radio-group 
        v-model="operator" 
        class="ml-1" color="success" 
        :mandatory="false" 
        :row="true" 
        @change="onOperatorChange"
      >
        <v-radio color="#1976d2" label="$and" value="$and"></v-radio>
        <v-radio color="#1976d2" label="$or" value="$or"></v-radio>
        <!-- <v-radio color="#1976d2" label="$and" value="$not"></v-radio>
        <v-radio color="#1976d2" label="$or" value="$nor"></v-radio> -->
        <v-radio color="#1976d2" label="Non" value=""></v-radio>
      </v-radio-group>
    
      <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Query Documents</p>
      <v-divider class="ml-2"></v-divider>
      <v-layout align-center row wrap v-for="(model, index) in dynamicElementsModelInfo" :key="index">
        <v-flex xs12 sm12 md4 lg4 class="pa-2">
          <v-text-field
            v-model="model['pathName_'+(index + 1)]"
            label="Path Name"
            placeholder="Key name"
            hide-details
            @input="onInputChange"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 class="pa-2">
          <v-select
            v-model="model['data_type_'+(index + 1)]"
            :items="dataTypes"
            label="Data Type"
            hide-details
            @change="onQueryItemChange"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 class="pa-2">
          <v-select
            v-model="model['comparison_operator_'+(index + 1)]"
            :items="comparisonQueryOperators"
            item-text="text" 
            item-value="value"
            label="Comparison Operator"
            hide-details
            @change="onQueryItemChange"
          ></v-select>
        </v-flex>
        <v-flex xs12 sm12 md4 lg4 class="pa-2">
          <v-text-field
            v-model="model['searchBy_'+(index + 1)]"
            label="Filter By"
            placeholder="Search value"
            hide-details
            @input="onInputChange"
          ></v-text-field>
        </v-flex>
        <v-flex xs12 sm12 md2 lg2 class="pa-2">
          <v-btn color="white" small disabled>Remove</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-btn color="white" small @click="addNewQueryElement">Add New</v-btn>
        <v-btn color="primary" small @click="generateFilterQueryPart">Confirm</v-btn>
      </v-layout>
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
let modelValueCounter = 2;
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
      }
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
    onOperatorChange (event) {
      this.queryContruct.operator = event;
      this.generateQuery();
    },
    generateQuery () {
      if (this.queryContruct.operator) {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}({\"${this.queryContruct.operator}\": [${this.queryContruct.filterBy}]}${this.queryContruct.projection}${this.queryContruct.modificationSchema})${this.queryContruct.cursorMethods}`
      } else {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}(${this.queryContruct.filterBy ? this.queryContruct.filterBy : '{}'}${this.queryContruct.modificationSchema}${this.queryContruct.projection})${this.queryContruct.cursorMethods}`
      }
      this.$emit('onQueryUpdate', this.finalQuery);
    },

    addNewQueryElement () {
      this.dynamicElementsModelInfo.push({
        ['pathName_'+modelValueCounter]: '',
        ['searchBy_'+modelValueCounter]: '',
        ['comparison_operator_'+modelValueCounter]: '',
        ['data_type_'+modelValueCounter]: 'String'
      });
      modelValueCounter += 1;
    },

    generateFilterQueryPart () {

      // hide alert box
      this.queryOptionAlert = false;

      this.toast = {
        text: 'Your changes are commited',
        value: true
      };

      let queryString = '';
      let len = this.dynamicElementsModelInfo.length;
      for (let i = 0; i < len; i++) {
        console.log(this.dynamicElementsModelInfo[i])

        if (!this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]) {   // when deafult select
          if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'Numeric') {
            queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}}`;
          } 
          
          else if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'String') {
            queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"}`;
          } 
          
          else if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'ObjectId') {
            queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ObjectId(\"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\")}`;
          }
        } else {
          let camparison_op_string = '';

          /**
           * For Numeric Values
           */
          if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'Numeric') {
            camparison_op_string = `{\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}}`;
            // queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;
          } 
          
          /**
           * For String
           */
          else if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'String') {
            camparison_op_string = `{\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"}`;
            // queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;
          }
          
          /**
           * For ObjectId
           */
          else if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'ObjectId') {
            alert('ffff')
            camparison_op_string = `{\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": ObjectId(\"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\")}`;
          }

          queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;

        } 

        if (i < len - 1) {
          queryString += ',';
        }
      }
      
      this.queryContruct.filterBy = queryString;
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
    }
    // removeDynamicElements (index) {
    //   this.dynamicElementsModelInfo.splice(index, 1);
    // }
  },
  components: {
    'cursor-methods': CursorMethods,
    'mongo-update': MongoUpdate,
    'app-toast': Toast
  }
}
</script> 