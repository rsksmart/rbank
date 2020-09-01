<template>
  <div class="time-balance">
    <v-row class="ma-2 px-2 admin">
      <v-col cols="6">
        <v-row class="ma-1">
          <h4>Overall market performance over time:</h4>
        </v-row>
        <v-row class="ml-1">
          <p>in USD</p>
        </v-row>
        <v-row class="mx-1">
          <v-divider/>
        </v-row>
      </v-col>
      <v-col cols="6" class="d-flex justify-end align-end">
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
      </v-col>
    </v-row>
    <v-row class="ma-0 pl-4">
      <GChart class="ma-0 pa-0" type="LineChart" :data="chartData" :options="chartOptions"/>
    </v-row>
  </div>
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
        ['Time', 'Supplied', 'Borrowed'],
        ['3', 1000, 1030],
        ['6', -1170, 660],
        ['9', 660, -1170],
        ['12', 1030, 1000],
        ['15', 1000, 1030],
        ['18', -1170, 660],
        ['21', -1170, 660],
        ['24', 660, -1170],
      ],
      chartOptions: {
        width: 750,
        height: 280,
        legend: {
          position: 'bottom',
          alignment: 'end',
        },
        fontName: 'Rubik',
        colors: ['#24BD6B', '#008CFF'],
        chartArea: {
          left: '8%',
          width: '90%',
          height: '80%',
        },
      },
      period: 'Day',
    };
  },
  methods: {
    switchData(period) {
      this.period = period;
      switch (period) {
        case 'Day':
          this.chartData = [
            ['Time', 'Supplied', 'Borrowed'],
            ['3', 1000, 1030],
            ['6', -1170, 660],
            ['9', 660, -1170],
            ['12', 1030, 1000],
            ['15', 1000, 1030],
            ['18', -1170, 660],
            ['21', -1170, 660],
            ['24', 660, -1170],
          ];
          break;
        case 'Week':
          this.chartData = [
            ['Day', 'Supplied', 'Borrowed'],
            ['01', 1000, 1030],
            ['02', -1170, 660],
            ['03', 660, -1170],
            ['04', 1030, 1000],
            ['05', 1000, 1030],
            ['06', -1170, 660],
            ['07', 660, -1170],
          ];
          break;
        case 'Month':
          this.chartData = [
            ['Day', 'Supplied', 'Borrowed'],
            ['5', 1000, 1030],
            ['10', -1170, 660],
            ['15', 660, -1170],
            ['20', 1030, 1000],
            ['25', 1000, 1030],
            ['30', -1170, 660],
          ];
          break;
        case 'Year':
          this.chartData = [
            ['Month', 'Supplied', 'Borrowed'],
            ['01', 1000, 1030],
            ['02', -1170, 660],
            ['03', 660, -1170],
            ['04', 1030, 1000],
            ['05', 1000, 1030],
            ['06', -1170, 660],
            ['07', 1000, 1030],
            ['08', -1170, 660],
            ['09', 660, -1170],
            ['10', 1030, 1000],
            ['11', 1000, 1030],
            ['12', -1170, 660],
          ];
          break;
        default:
          this.chartData = [];
      }
    },
  },
};
</script>
