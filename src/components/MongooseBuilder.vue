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

    <p class="subheading font-weight-medium pl-2 pb-2 mb-0 mt-3">Query Method*</p>
    <v-divider class="ml-2"></v-divider>
    <v-radio-group 
      class="ml-1 mt-2"
      :mandatory="true" 
      v-model="radios"
      :row="true" 
      @change="onRadioChange"
      v-if="hideRadioButton == false"
    >
      <v-radio 
        v-for="(opt, id) in queryTypeOption" 
        :key="id" 
        :label="opt.label" 
        :value="opt.value">
      </v-radio>
    </v-radio-group>

    <!-- <v-radio-group class="" v-model="radios" color="success" :mandatory="false" :row="true" @change="onRadioChange">
      <v-radio label="Insert" value="insert"></v-radio>
      <v-radio label="Update" value="update"></v-radio>
      <v-radio label="Find" value="find"></v-radio>
      <v-radio label="Delete" value="delete"></v-radio>
      <v-radio label="Aggregate" value="aggregate"></v-radio>
    </v-radio-group> -->

    <div v-if="isLogicalOperatorIsRequired === true">
      <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Logical Operator</p>
      <v-divider class="ml-2"></v-divider>
      <v-radio-group 
        v-model="operator" 
        class="ml-1" color="success" 
        :mandatory="false" 
        :row="true" 
        @change="onOperatorChange"
      >
        <v-radio label="$and" value="$and"></v-radio>
        <v-radio label="$or" value="$or"></v-radio>
        <v-radio label="Non" value=""></v-radio>
      </v-radio-group>
    </div>
  
    <v-layout align-baseline row nowrap v-for="(model, index) in dynamicElementsModelInfo" :key="index">
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
        <v-btn color="red" small dark>Delete</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-btn color="white" small @click="addNewQueryElement">Add New</v-btn>
      <v-btn color="primary" small @click="generateFilterQueryPart">Confirm</v-btn>
    </v-layout>
    <div v-if="showHelperMethod === true">
      <p class="subheading font-weight-medium ma-0 mt-3 pl-2 pb-2">Helper Method</p>
      <v-divider class="ml-2"></v-divider>
      <v-layout row wrap class="pl-2">
        <v-checkbox
          v-model="isPopulateRequired"
          label="Populate"
          color="primary"
          value="yes"
          hide-details
          @change="onHelpers(isPopulateRequired, 'populate')"
        ></v-checkbox>
        <v-checkbox
          v-model="isSkipRequired"
          label="Skip"
          color="primary"
          value="yes"
          @change="onHelpers(isSkipRequired, 'skip')"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="isLimitRequired"
          label="Limit"
          color="primary"
          value="yes"
          @change="onHelpers(isLimitRequired, 'limit')"
          hide-details
        ></v-checkbox>
        <v-checkbox
          v-model="isSortingRequired"
          label="Sort"
          color="primary"
          value="yes"
          @change="onHelpers(isSortingRequired, 'sort')"
          hide-details
        ></v-checkbox>
      </v-layout>
    </div>
    <v-flex>
      <v-layout row wrap align-baseline v-if="isPopulateRequired === 'yes'">
        <v-flex xs12 sm12 md5 lg5 class="pa-2">
          <v-text-field
            label="Path Name"
            hint="Please enter path or property name which you want to populate"
            placeholder="Property name"
          ></v-text-field>
        </v-flex>
        <!-- <v-flex xs12 sm12 md3 lg3 class="pa-2">
          <v-text-field
            label="Path Name"
            hint="Please enter path or property name which you want to populate"
            placeholder="Property name"
          ></v-text-field>
        </v-flex> -->
        <v-flex xs12 sm12 md3 lg3>
          <v-btn color="primary" depressed>Confrim</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-baseline v-if="isSkipRequired === 'yes'">
        <v-flex xs12 sm12 md5 lg5 class="pa-2">
          <v-text-field
            v-model="queryContruct.skip"
            label="How many documents you want to skip per request"
            hint="Please mention number for skiping data eg: (1, 2, 5, 20 etc)"
            placeholder="Only numeric values are accepted"
          ></v-text-field>
        </v-flex>
        <!-- <v-flex xs12 sm12 md3 lg3>
          <v-btn color="primary" depressed>Confrim</v-btn>
        </v-flex> -->
      </v-layout>
      <v-layout row wrap align-baseline v-if="isLimitRequired === 'yes'">
        <v-flex xs12 sm12 md5 lg5 class="pa-2">
          <v-text-field
            v-model="queryContruct.limit"
            label="How many documents you want per request"
            hint="Please mention number for limit data eg: (1, 2, 5, 20 etc)"
            placeholder="Only numeric values are accepted"
          ></v-text-field>
        </v-flex>
        <!-- <v-flex xs12 sm12 md3 lg3>
          <v-btn color="primary" depressed>Confrim</v-btn>
        </v-flex> -->
      </v-layout>
      <v-layout row wrap align-baseline v-if="isSortingRequired === 'yes'">
        <v-flex xs12 sm12 md5 lg5 class="pa-2">
          <v-text-field
            v-model="queryContruct.sortedBy"
            label="Key name or property name"
            hint="Only those fields who contains numeric values in your document eg: date, roll no etc."
          ></v-text-field>
        </v-flex>
        <v-flex xs5>
          <v-radio-group v-model="sortingOption" color="success" :mandatory="false" :row="true" @change="onSortingOption">
            <v-radio label="Assending" value="1"></v-radio>
            <v-radio label="Dessending" value="-1"></v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>
    </v-flex>
    <mongoose-update @onQueryUpdate="onMongooseUpdateEvent"></mongoose-update>
  </div>
</template>
<script>
import MongooseUpdate from './MongooseUpdate'
let modelValueCounter = 1;
  export default {
    mounted () {
      // this.onTabChange()
      this.queryTypeOption = this.radioOptions['find'];
      for (let i = 0; i < this.queryTypeOption.length; i++) {
        if (this.queryTypeOption[i].default === true) {
          this.radios = this.queryTypeOption[i].value;
        }
      }
      // console.log("Radio Default " + this.radios);
      this.generateQuery()
    },
    data () {
      return {
        tabs: [
          {
            label: 'Insert',
            active: false,
            value: 'insert',
            color: 'primary'
          },
          {
            label: 'Update',
            active: false,
            value: 'update',
            color: 'primary'
          },
          {
            label: 'Find',
            active: true,
            value: 'find',
            color: 'primary'
          },
          {
            label: 'Delete',
            active: false,
            value: 'delete',
            color: 'primary'
          },
          {
            label: 'Aggregate',
            active: false,
            value: 'aggregate',
            color: 'primary'
          }
        ],
        hideRadioButton: false,
        showHelperMethod: true,
        radioOptions: {
          find: [
            {
              label: 'Find',
              value: 'find',
              default: true,
              isLogicalOperatorRequred: true,
            },
            {
              label: 'FindOne',
              value: 'findOne',
              default: false,
              isLogicalOperatorRequred: true
            },
            {
              label: 'FindById',
              value: 'findById',
              default: false,
              isLogicalOperatorRequred: false
            }
          ],
          update: [{
              label: 'UpdateOne',
              value: 'updateOne',
              default: false,
              isLogicalOperatorRequred: true,
            },
            {
              label: 'UpdateMany',
              value: 'updateMany',
              default: true,
              isLogicalOperatorRequred: true,
            },
            {
              label: 'FindByIdAndUpdate',
              value: 'findByIdAndUpdate',
              default: false,
              isLogicalOperatorRequred: false
            }, 
            {
              label: 'FindOneAndUpdate',
              value: 'findOneAndUpdate',
              default: false,
              isLogicalOperatorRequred: true
            }],
          insert: [{
            label: 'InsertMany',
            value: 'insertMany',
            default: false,
            isLogicalOperatorRequred: false
          }, {
            label: 'Create',
            value: 'create',
            default: false,
            isLogicalOperatorRequred: false
          }],
          delete: [],
          aggregate: []
        },
        queryTypeOption: [],
        isLogicalOperatorIsRequired: true,
        radios: 'find',
        operator: '',
        queryContruct: {
          collection: '',
          method: 'find',
          operator: '',
          populate: [],
          filterBy: '',
          // modificationSchema: ',{$set:{age: 34, name: ashfaq}}',
          modificationSchema: '',
          optionalParams: '',
          sortedBy: '',
          limit: '',
          skip: ''
        },
        searchData: {
          pathName: '',
          searchBy: '',
          data_type: 'String'
        },
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
        isPopulateRequired: 'no',
        isLimitRequired: 'no',
        isSkipRequired: 'no',
        isSortingRequired: 'no',
        sortingOption: '1',
        finalQuery: '',
        dynamicID: [],
        dynamicElementsModelInfo: []
      }
    },
    methods: {
      onTabChange (tab, index) {
        this.hideRadioButton = true;
        for (let i = 0; i < this.tabs.length; i++) {
          if (i == index) {
            this.tabs[index].active = true;
          } else {
            this.tabs[i].active = false;
          }
        }

        // Helper funtion only allow in find query
        if (tab.value === 'find') {
          this.showHelperMethod = true;
        } else {
          this.showHelperMethod = false;
        }

        this.queryTypeOption = [];
        for (let i = 0; i < this.radioOptions[tab.value].length; i++) {
          if (this.radioOptions[tab.value][i].default === true) {
            this.radios = this.radioOptions[tab.value][i].value;
            break;
          }
        }
        this.queryTypeOption = this.radioOptions[tab.value].slice(0, this.radioOptions[tab.value].length);
        console.log("QueryType : ", this.queryTypeOption);
        console.log("+ >>> " + this.radios);
        this.onRadioChange(this.radios);
      },
      onRadioChange (event) {
        this.radios = event;
        let findIndex = this.queryTypeOption.findIndex(e => e.value === event);
        if (findIndex !== -1) {
          this.isLogicalOperatorIsRequired = this.queryTypeOption[findIndex].isLogicalOperatorRequred;
        }
        this.queryContruct.method = event
        this.hideRadioButton = false;
        this.generateQuery();
      },
      onOperatorChange (event) {
        this.queryContruct.operator = event;
        this.generateQuery();
      },
      onHelpers () {
        // console.log(value+' =>> '+helper);
        this.generateQuery();
      },
      onSortingOption () {
        this.generateQuery()
      },

      // randomId(howMany = 7, key = 'abcdef0123456789') {
      //   let salt = '';
      //   for (let x = 0; x < howMany; x++) {
      //     salt += key.charAt(Math.floor(Math.random() * key.length));
      //   }
      //   return salt;
      // },

      addNewQueryElement () {

        this.dynamicElementsModelInfo.push({
          ['pathName_'+modelValueCounter]: '',
          ['searchBy_'+modelValueCounter]: '',
          ['comparison_operator_'+modelValueCounter]: '',
          ['data_type_'+modelValueCounter]: 'String'
        });

        modelValueCounter += 1;
        
        /*
        let pathRandomId = this.randomId();
        let valueRandomId = this.randomId();
        let data_typeRandomId = this.randomId();
        

        let queryElement = `
          <div class="layout row wrap">
            <div class="flex pa-2 xs12 sm12 md4 lg4">
              <div class="v-input v-text-field v-text-field--placeholder v-input--hide-details theme--light">
                <div class="v-input__control">
                  <div class="v-input__slot">
                    <div class="v-text-field__slot">
                      <label aria-hidden="true" class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">Path Name</label>
                      <input aria-label="Path Name" type="text" placeholder="Key name" id=${pathRandomId}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex pa-2 xs12 sm12 md4 lg4">
              <div role="combobox" class="v-input v-text-field v-select v-input--is-label-active v-input--is-dirty theme--light">
                <div class="v-input__control">
                  <div class="v-input__slot">
                    <div class="v-select__slot">
                      <label aria-hidden="true" class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">Data Type</label>
                      <div class="v-select__selections">
                        <div class="v-select__selection v-select__selection--comma">String</div>
                        <input aria-label="Data Type" value="String" readonly="readonly" type="text" autocomplete="on" aria-readonly="false" id=${data_typeRandomId}>
                      </div>
                      <div class="v-input__append-inner">
                        <div class="v-input__icon v-input__icon--append"><i aria-hidden="true" class="v-icon mdi mdi-menu-down theme--light"></i>
                        </div>
                      </div>
                    </div>
                    <div class="v-menu">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex pa-2 xs12 sm12 md4 lg4">
              <div class="v-input v-text-field v-text-field--placeholder v-input--hide-details theme--light">
                <div class="v-input__control">
                  <div class="v-input__slot">
                    <div class="v-text-field__slot">
                      <label aria-hidden="true" class="v-label v-label--active theme--light" style="left: 0px; right: auto; position: absolute;">Filter By</label>
                      <input aria-label="Filter By" type="text" id=${valueRandomId} placeholder="Search value">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

        let wrapperElement = document.getElementById('dynamic_query_element');
        
        this.dynamicID.push({
          pathRandomId,
          data_typeRandomId,
          valueRandomId
        });
        wrapperElement.innerHTML += queryElement;
        */

      },
      generateFilterQueryPart () {
        // searchData: {
        //   pathName: '',
        //   searchBy: ''
        // },

        // queryContruct: {
        //   collection: 'users',
        //   method: 'find',
        //   operator: '',
        //   populate: [],
        //   filterBy: '',
        //   sortedBy: '',
        //   limit: '',
        //   skip: ''
        // },
        // console.log("===> " , this.dynamicElementsModelInfo);
        let queryString = '';
        let len = this.dynamicElementsModelInfo.length;
        for (let i = 0; i < len; i++) {
          console.log(this.dynamicElementsModelInfo[i])

          if (!this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]) {   // when deafult select
            if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'Numeric') {
              queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}}`;
            } else {
              queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"}`;
            }
          } else {
            let camparison_op_string = '';
            if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'Numeric') {
              camparison_op_string = `{\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}}`;
              queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;
            } else {
              camparison_op_string = `{\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"}`;
              queryString += `{\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;
            }
          }

          if (i < len - 1) {
            queryString += ',';
          }
        }

        this.queryContruct.filterBy = queryString;
        this.generateQuery();
      },
      onMongooseUpdateEvent (query) {
        this.queryContruct.modificationSchema = `,{${query}}`;
        this.generateQuery();
      },
      generateQuery () {
        if (this.queryContruct.operator) {
          this.finalQuery = `${this.queryContruct.collection ? this.queryContruct.collection : 'Model'}.${this.queryContruct.method}({\"${this.queryContruct.operator}\": [${this.queryContruct.filterBy}]})`
        } else {
          this.finalQuery = `${this.queryContruct.collection ? this.queryContruct.collection : 'Model'}.${this.queryContruct.method}(${this.queryContruct.filterBy ? this.queryContruct.filterBy : '{}'}${this.queryContruct.modificationSchema})`
        }

        // console.log(" Value ::: " + this.isPopulateRequired) 
        if (this.isPopulateRequired === 'yes') {
          this.finalQuery += '.populate({})'
        } 
        
        if (this.isLimitRequired === 'yes') {
          this.finalQuery += `.limit(${this.queryContruct.limit ? this.queryContruct.limit : '0'})`
        }

        if (this.isSkipRequired === 'yes') {
          this.finalQuery += `.skip(${this.queryContruct.skip ? this.queryContruct.skip : '0'})`
        }

        if (this.isSortingRequired === 'yes') {
          this.finalQuery += `.sort({\"${this.queryContruct.sortedBy ? this.queryContruct.sortedBy : 'KEY_NAME'}\": ${this.sortingOption}})`
        }

        this.$emit('onQueryUpdate', this.finalQuery);
      }
    },
    components: {
      'mongoose-update': MongooseUpdate
    },
    watch: {
      ['queryContruct.sortedBy']() {
        this.generateQuery()
      },
      ['queryContruct.limit']() {
        this.generateQuery()
      },
      ['queryContruct.skip']() {
        this.generateQuery()
      }
    }
  }
</script>