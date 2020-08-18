<template>
  <div class="supply-borrow-chart pa-4">
    <v-row>
      <v-col>
        <v-row>
          <h2>My Supply-Borrow Factor:</h2>
        </v-row>
        <v-row>
          <span>
            RBank Collateral Factor:    75%
          </span>
        </v-row>
        <v-row>
          <div class="borrow-supply-divider"></div>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col cols="3">
        <v-row class="d-flex justify-center">
          <h2>Supplied</h2>
        </v-row>
        <v-row class="d-flex justify-center">
          <p>{{totalSupplied}}</p>
          <span>USD</span>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row class="d-flex justify-center">
          <GChart
            type="PieChart"
            :data="chartData"
            :options="chartOptions"
            :resizeDebounce="500"
          />
        </v-row>
      </v-col>
      <v-col cols="3">
        <v-row class="d-flex justify-center">
          <h3>Borrowed</h3>
        </v-row>
        <v-row class="d-flex justify-center">
          <p>{{totalBorrowed}}</p>
          <span>USD</span>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row class="d-flex justify-center">
          <h4>Overall Borrow limit</h4>
        </v-row>
        <v-row class="borrow-limit d-flex justify-center">
          {{totalBorrowLimit}}
        </v-row>
        <v-row class="d-flex justify-center">
          <span>USD</span>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { GChart } from 'vue-google-charts';

export default {
  name: 'SupplyBorrowGraph',
  components: {
    GChart,
  },
  data() {
    return {
      totalBorrowed: 0,
      totalSupplied: 0,
      totalBorrowLimit: 0,
      chartData: [
        ['Type', 'Value'],
        ['Supplied', 0],
        ['Borrowed', 0],
      ],
      chartOptions: {
        // valores para ser reactive y responsive
        width: 200,
        height: 200,
        legend: 'none',
        pieSliceText: 'none',
        fontName: 'Rubik',
        colors: ['#008CFF', '#828282'],
        pieHole: 0.7,
        chartArea: {
          width: '100%',
          height: '100%',
        },
      },
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    getData() {
      this.$rbank.controller.getAccountValues(this.account)
        .then(({ supplyValue, borrowValue }) => {
          this.totalBorrowed = borrowValue;
          this.totalSupplied = supplyValue;
          this.getBorrowLimit();
          this.updateDiagramData();
        });
    },
    getBorrowLimit() {
      this.totalBorrowLimit = 200;
    },
    updateDiagramData() {
      this.chartData = [
        ['Type', 'Value'],
        ['Supplied', this.totalSupplied],
        ['Borrowed', this.totalBorrowed],
      ];
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style scoped>

</style>
