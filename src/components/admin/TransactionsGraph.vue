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
          <v-btn text :class="[period === 'day' ? 'selected' : 'notSelected']"
                 @click="getChartData('day')">
            1D
          </v-btn>
          <v-btn text :class="[period === 'week' ? 'selected' : 'notSelected']"
                 @click="getChartData('week')">
            1W
          </v-btn>
          <v-btn text :class="[period === 'month' ? 'selected' : 'notSelected']"
                 @click="getChartData('month')">
            1M
          </v-btn>
          <v-btn text :class="[period === 'year' ? 'selected' : 'notSelected']"
                 @click="getChartData('year')">
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
// import * as constants from '@/store/constants';
// import { mapGetters } from 'vuex';

export default {
  name: 'TimeBalanceGraph',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chartData: [
        ['Time', 'Supplied', 'Loaned'],
        ['0', 0, 0],
      ],
      chartOptions: {
        width: 750,
        height: 250,
        legend: {
          position: 'bottom',
          alignment: 'end',
        },
        fontName: 'Rubik',
        colors: ['#24BD6B', '#008CFF'],
        chartArea: {
          left: '8%',
          width: '90%',
          height: '70%',
        },
      },
      weekLabels: [
        { key: 0, value: 'Sunday' },
        { key: 1, value: 'Monday' },
        { key: 2, value: 'Tuesday ' },
        { key: 3, value: 'Wednesday' },
        { key: 4, value: 'Thursday' },
        { key: 5, value: 'Friday' },
        { key: 6, value: 'Saturday' },
      ],
      monthLabels: [
        { key: 0, value: 'January' },
        { key: 1, value: 'February' },
        { key: 2, value: 'March ' },
        { key: 3, value: 'April' },
        { key: 4, value: 'May' },
        { key: 5, value: 'June' },
        { key: 6, value: 'July' },
        { key: 7, value: 'August' },
        { key: 8, value: 'September' },
        { key: 9, value: 'October' },
        { key: 10, value: 'November' },
        { key: 11, value: 'December' },
      ],
      period: 'week',
    };
  },
  methods: {
    mapTimeToLabel(period, date) {
      switch (period) {
        case 'day':
          return date.getHours();
        case 'week':
          return this.weekLabels[date.getDay()].value;
        case 'month':
          return date.getDate().toString();
        case 'year':
          return this.monthLabels[date.getMonth()].value;
        default:
          return this.weekLabels[date.getDay()].value;
      }
    },
    getChartData(period) {
      this.period = period;
      this.data.market.getOverallBalance(period)
        .then((overallBalance) => overallBalance
          .map(([date, supplied, loaned]) => [
            this.mapTimeToLabel(period, date),
            supplied,
            loaned,
          ]))
        .then((overallBalance) => {
          overallBalance.reverse();
          this.chartData = Array.from(new Set(overallBalance.map(JSON.stringify)), JSON.parse);
          this.chartData.unshift(['Time', 'Supplied', 'Loaned']);
        });
    },
  },
  components: {
    GChart,
  },
  created() {
    this.getChartData('week');
  },
};
</script>
