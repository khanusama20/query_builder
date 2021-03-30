<template>
  <div>
    <p class="subheading font-weight-medium pl-2 pb-2 mb-0">Cursor Methods</p>
    <v-divider class="ml-2"></v-divider>
    <v-layout row wrap>
      <!-- <v-chip
        :color="method.active === true ? 'primary' : 'gray'"
        dark
        v-for="(method, id) in cursorMethods" :key="method.text+'_'+id" 
        class="text-uppercase pl-2 pr-2"
        @input="onChipClick(id, method)"
      >
        {{ method.text }}
      </v-chip> -->

      <!-- <v-checkbox
        v-model="isPopulateRequired"
        label="Populate"
        color="primary"
        hide-details
        @change="onHelpers(isPopulateRequired, 'populate')"
      ></v-checkbox> -->

      <v-flex xs6 ms6 md3 lg2>
        <v-checkbox
          v-model="isSkipRequired"
          label="Skip"
          color="primary"
          @change="onHelpers(isSkipRequired, 'skip')"
          hide-details
        ></v-checkbox>
      </v-flex>
      <v-flex xs6 ms6 md3 lg2>
        <v-checkbox
          v-model="isLimitRequired"
          label="Limit"
          color="primary"
          @change="onHelpers(isLimitRequired, 'limit')"
          hide-details
        ></v-checkbox>
        
      </v-flex>
      <v-flex xs6 ms6 md3 lg2>
        <v-checkbox
          v-model="isSortingRequired"
          label="Sort"
          color="primary"
          @change="onHelpers(isSortingRequired, 'sort')"
          hide-details
        ></v-checkbox>
      </v-flex>
      <v-flex xs6 ms6 md3 lg2 v-if="method === 'find'">
        <v-checkbox
          v-model="isCountRequired"
          label="Count"
          color="primary"
          @change="onHelpers(null, 'count')"
          hide-details
        ></v-checkbox>
      </v-flex>
      <!-- <v-flex xs6 ms6 md3 lg3>
        
      </v-flex> -->
    </v-layout>

    <v-layout row wrap align-baseline v-if="isSkipRequired === true">
      <v-flex xs12 sm12 md5 lg5 class="pa-2">
        <v-text-field
          v-model="skip"
          label="How many documents you want to skip per request"
          hint="Please mention number for skiping data eg: (1, 2, 5, 20 etc)"
          placeholder="Only numeric values are accepted"
        ></v-text-field>
      </v-flex>
        <!-- <v-flex xs12 sm12 md3 lg3>
          <v-btn color="primary" depressed>Confrim</v-btn>
        </v-flex> -->
    </v-layout>
    <v-layout row wrap align-baseline v-if="isLimitRequired === true">
      <v-flex xs12 sm12 md5 lg5 class="pa-2">
        <v-text-field
          v-model="limit"
          label="How many documents you want per request"
          hint="Please mention number for limit data eg: (1, 2, 5, 20 etc)"
          placeholder="Only numeric values are accepted"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-baseline v-if="isSortingRequired === true">
      <v-flex xs12 sm12 md5 lg5 class="pa-2">
        <v-text-field
          v-model="sortedBy"
          label="Key name or property name"
          hint="Only those fields who contains numeric values in your document eg: date, roll no etc."
        ></v-text-field>
      </v-flex>
      <v-flex xs5>
        <v-radio-group v-model="sortingOption" color="success" :mandatory="false" :row="true" @change="constructQueryPart">
          <v-radio label="Assending" value="1"></v-radio>
          <v-radio label="Dessending" value="-1"></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { CURSOR_METHODS } from '../common/data'
export default {
  props: {
    method: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      cursorMethods: CURSOR_METHODS,
      isPopulateRequired: false,
      isLimitRequired: false,
      isSkipRequired: false,
      isSortingRequired: false,
      isCountRequired: false,
      sortingOption: '1',
      limit: '',
      skip: '',
      sortedBy: '',
      partOfQuery: ''
    }
  },
  methods: {
    onChipClick (index, obj) {
      obj.active = true;
      let cloneArray = this.cursorMethods.slice(0, this.cursorMethods.length);
      cloneArray[index] = obj;
      this.cursorMethods = cloneArray;
    },
    onHelpers () {
      this.constructQueryPart();

      this.$emit('onCountCursorMethodCheck');
    },
  
    constructQueryPart () {
      this.partOfQuery = '';
      if (this.isSkipRequired === true) {
        this.partOfQuery += `.skip(${this.skip ? this.skip : '0'})`
      }
      if (this.isLimitRequired === true) {
        this.partOfQuery += `.limit(${this.limit ? this.limit : '0'})`
      }
      if (this.isSortingRequired === true) {
        this.partOfQuery += `.sort({\"${this.sortedBy ? this.sortedBy : 'KEY_NAME'}\": ${this.sortingOption}})`
      }
      if (this.isCountRequired === true) {
        this.partOfQuery += '.count()'
      }

      this.$emit('onCursorMethodActive', this.partOfQuery)
    }
  },
  watch: {
    skip () {
      this.constructQueryPart();
    },
    limit () {
      this.constructQueryPart();
    },
    sortedBy () {
      this.constructQueryPart();
    }
  }
}
</script>