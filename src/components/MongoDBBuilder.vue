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

    <div>
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
        <v-radio color="#1976d2" label="Non" value=""></v-radio>
      </v-radio-group>
    </div>
    <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Query Documents</p>
    <v-divider class="ml-2"></v-divider>
    <v-layout align-center row nowrap v-for="(model, index) in dynamicElementsModelInfo" :key="index">
      <v-flex xs12 sm12 md4 lg4 class="pa-2">
        <v-text-field
          v-model="model['pathName_'+(index + 1)]"
          label="Path Name"
          placeholder="Key name"
          hide-details
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 class="pa-2">
        <v-select
          v-model="model['data_type_'+(index + 1)]"
          :items="dataTypes"
          label="Data Type"
          hide-details
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
        ></v-select>
      </v-flex>
      <v-flex xs12 sm12 md4 lg4 class="pa-2">
        <v-text-field
          v-model="model['searchBy_'+(index + 1)]"
          label="Filter By"
          placeholder="Search value"
          hide-details
        ></v-text-field>
      </v-flex>
      <v-flex xs12 sm12 md2 lg2 class="pa-2">
        <v-btn color="white" small>Remove</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-btn color="white" small @click="addNewQueryElement">Add New</v-btn>
      <v-btn color="primary" small @click="generateFilterQueryPart">Confirm</v-btn>
    </v-layout>

    <!-- projection -->

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
      <v-chip close v-for="(path, index) in projections" :key="index">{{path}}</v-chip>
    </v-layout>
  </div>
</template>
<script>
let modelValueCounter = 2;
export default {
  data() {
    return {
      tabs: [
        // {
        //   label: 'Insert',
        //   active: false,
        //   value: 'insert',
        //   color: 'primary'
        // },
        {
          label: 'Update',
          active: false,
          value: 'update',
          color: 'primary'
        }, {
          label: 'Find',
          active: true,
          value: 'find',
          color: 'primary'
        },
        // {
        //   label: 'Delete',
        //   active: false,
        //   value: 'delete',
        //   color: 'primary'
        // },
        // {
        //   label: 'Aggregate',
        //   active: false,
        //   value: 'aggregate',
        //   color: 'primary'
        // }
      ],
      radioOptions: {
        find: [{
            label: 'Find',
            value: 'find',
            default: false,
            isLogicalOperatorRequred: true,
          }, {
            label: 'FindOne',
            value: 'findOne',
            default: false,
            isLogicalOperatorRequred: true
          }
        ],
        update: [{
            label: 'Update',
            value: 'update',
            default: false,
            isLogicalOperatorRequred: true,
          }, {
            label: 'UpdateOne',
            value: 'updateOne',
            default: false,
            isLogicalOperatorRequred: true,
          }, {
            label: 'UpdateMany',
            value: 'updateMany',
            default: false,
            isLogicalOperatorRequred: true,
          },
          // {
          //   label: 'FindByIdAndUpdate',
          //   value: 'findByIdAndUpdate',
          //   default: false,
          //   isLogicalOperatorRequred: false
          // }, 
          {
            label: 'FindOneAndUpdate',
            value: 'findOneAndUpdate',
            default: false,
            isLogicalOperatorRequred: true
          }
        ],
        insert: [
          //   {
          //   label: 'InsertMany',
          //   value: 'insertMany',
          //   default: false,
          //   isLogicalOperatorRequred: false
          // }, {
          //   label: 'Create',
          //   value: 'create',
          //   default: false,
          //   isLogicalOperatorRequred: false
          // }
        ],
        delete: [],
        aggregate: []
      },
      operator: 'non',
      dataTypes: [
        "String",
        "Numeric",
        "ObjectId"
      ],
      comparisonQueryOperators: [
        {
          text: 'Default',
          value: ''
        },
        {
          text: 'Equal',
          value: '$eq'
        },
        {
          text: 'Regex',
          value: '$regex'
        },
        {
          text: 'Greater than',
          value: '$gt'
        },
        {
          text: 'Greater than or equal ',
          value: '$gte'
        },
        {
          text: 'Less than',
          value: '$lt'
        },
        {
          text: 'Less than or equal',
          value: '$lte'
        },
        {
          text: 'Not equal',
          value: '$ne'
        }
      ],
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
        sortedBy: '',
        limit: '',
        skip: ''
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
      projectionPathName: ''
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
    },
    onRadioChange(event) {
      this.queryContruct.method = event;
      this.generateQuery();
    },
    onOperatorChange (event) {
      this.queryContruct.operator = event;
      this.generateQuery();
    },
    generateQuery () {
      if (this.queryContruct.operator) {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}({\"${this.queryContruct.operator}\": [${this.queryContruct.filterBy}]}${this.queryContruct.projection})`
      } else {
        this.finalQuery = `db.${this.queryContruct.collection ? this.queryContruct.collection : 'collection'}.${this.queryContruct.method}(${this.queryContruct.filterBy ? this.queryContruct.filterBy : '{}'}${this.queryContruct.modificationSchema}${this.queryContruct.projection})`
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
    }
  }
}
</script>