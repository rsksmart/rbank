<template>
  <v-card>
    <v-row class="pa-4">
      <v-col cols="8">
        <v-row>
          <h1>My Overall Balance Over Time:</h1>
        </v-row>
        <v-row>
          <span>
            Earnings in USD
          </span>
        </v-row>
        <v-row>
          <div class="divider-balance-graph"></div>
        </v-row>
      </v-col>
      <v-col class="d-flex align-center">
        <v-row class="d-flex justify-center">
          <div class="toggle-tb d-flex align-center">
            <v-btn text :class="[period === 'Day' ? 'selected' : 'notSelected']"
                   @click="switchData('Day')">
              1D
            </v-btn>
            <v-btn text :class="[period === 'Week' ? 'selected' : 'notSelected']"
                   @click="switchData('Week')">
              1W
            </v-btn>
            <v-btn text :class="[period === 'Month' ? 'selected' : 'notSelected']"
                   @click="switchData('Month')">
              1M
            </v-btn>
            <v-btn text :class="[period === 'Year' ? 'selected' : 'notSelected']"
                   @click="switchData('Year')">
              1Y
            </v-btn>
          </div>
        </v-row>
<!--        <v-row class="period-picker pa-0 d-flex justify-center">-->
<!--          <v-col cols="3" class="pa-0 ma-0 d-flex align-center">-->
<!--            <v-row class="d-flex justify-center">-->
<!--              <a @click="switchData('Day')">1D</a>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--          <v-col cols="3" class="pa-0 ma-0 d-flex align-center">-->
<!--            <v-row class="d-flex justify-center">-->
<!--              <a @click="switchData('Week')">1W</a>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--          <v-col cols="3" class="pa-0 ma-0 d-flex align-center">-->
<!--            <v-row class="d-flex justify-center">-->
<!--              <a @click="switchData('Month')">1M</a>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--          <v-col cols="3" class="pa-0 ma-0 d-flex align-center">-->
<!--            <v-row class="d-flex justify-center">-->
<!--              <a @click="switchData('Year')">1Y</a>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--        </v-row>-->
      </v-col>
    </v-row>
    <v-row>
      <GChart
        type="LineChart"
        :data="chartData"
        :options="chartOptions"
        :resizeDebounce="500"
      />
    </v-row>
  </v-card>
</template>

<script>
import { GChart } from 'vue-google-charts';

export default {
  name: 'TimeBalanceGraph',
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [
        ['Date', 'Balance'],
        ['2014', 1000],
        ['2015', -1170],
        ['2016', 660],
        ['2017', 1030],
        ['2018', 1000],
        ['2019', -1170],
        ['2020', 660],
        ['2021', 1030],
      ],
      chartOptions: {
        // valores para ser reactive y responsive
        width: 500,
        height: 300,
        legend: 'none',
        fontName: 'Rubik',
        colors: ['#24BD6B'],
      },
      period: 'Day',
    };
  },
  methods: {
    switchData(period) {
      this.period = period;
      switch (period) {
        case 'Day':
          break;
        case 'Week':
          this.chartData = [
            ['Date', 'Balance'],
            ['1', 1000],
            ['2', -1170],
            ['3', 660],
            ['4', 12],
            ['5', 500],
            ['6', -1170],
            ['7', 30],
            ['8', 10],
          ];
          break;
        case 'Moth':
          break;
        case 'Year':
          break;
        default:
          this.chartData = [];
      }
    },
  },
};
</script>

<style scoped>

</style>
