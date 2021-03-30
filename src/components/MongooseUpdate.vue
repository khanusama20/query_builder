<template>
  <div>
    <p class="subheading font-weight-medium ma-0 mt-3 pl-2 pb-2">Operation</p>
    <v-divider class="ml-2"></v-divider>
    <v-radio-group 
      v-model="operator" 
      class="ml-1" color="success" 
      :mandatory="false" 
      :row="true" 
      @change="onOperatorChange"
    >
      <v-radio color="#1976d2" label="$set" value="$set"></v-radio>
    </v-radio-group>
    <p class="subheading font-weight-medium ma-0 mt-3 pl-2 pb-2">Create Document</p>
    <v-divider class="ml-2"></v-divider>
    <v-layout class="mt-2" row nowrap v-for="(model, index) in dynamicElementsModelInfo" :key="index">
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
        <v-text-field
          v-model="model['searchBy_'+(index + 1)]"
          label="Filter By"
          placeholder="Search value"
          hide-details
        ></v-text-field>
      </v-flex>
      <!-- <v-flex xs12 sm12 md2 lg2 class="pa-2">
        <v-btn color="red" small dark>Delete</v-btn>
      </v-flex> -->
    </v-layout>
    <v-layout row wrap>
      <v-btn color="white" small @click="addNewUpdateFields">Add New</v-btn>
      <v-btn color="primary" small @click="generateFilterQueryPart">Confirm</v-btn>
    </v-layout>
  </div>
</template>
<script>
let modelValueCounter = 2;
export default {
  data () {
    return {
      dynamicElementsModelInfo: [
        {
          pathName_1: '',
          searchBy_1: '',
          comparison_operator_1: '',
          data_type_1: 'String'
        }
      ],
      dataTypes: [
        "String",
        "Numeric",
        "ObjectId"
      ],
      operator: '$set'
    }
  },
  methods: {
    onOperatorChange () {

    },
    addNewUpdateFields () {
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
            queryString += `\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}`;
          } else {
            queryString += `\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"`;
          }
        } else {
          let camparison_op_string = '';
          if (this.dynamicElementsModelInfo[i]['data_type_'+(i+1)] === 'Numeric') {
            camparison_op_string = `\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": ${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}`;
            queryString += `\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}}`;
          } else {
            camparison_op_string = `\"${this.dynamicElementsModelInfo[i]['comparison_operator_'+(i+1)]}\": \"${this.dynamicElementsModelInfo[i]['searchBy_'+(i+1)]}\"`;
            queryString += `\"${this.dynamicElementsModelInfo[i]['pathName_'+(i+1)]}\": ${camparison_op_string}`;
          }
        }

        if (i < len - 1) {
          queryString += ',';
        }
      }

      let final_string = `\"${this.operator}\": {${queryString}}`
      this.$emit('onQueryUpdate', final_string)
    }
  }
}
</script>