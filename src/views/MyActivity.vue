<template>
  <div class="my-activity">
    <div class="upper-banner">
      <template v-if="showHealthWarning">
        <v-dialog v-model="showHealthWarning" width="450">
          <v-card class="container" v-click-outside="showHealthWarning = false">
            <v-row class="ma-0 py-2 d-flex justify-center">
              <v-icon color="#000000" large>report_problem</v-icon>
            </v-row>
            <v-row class="ma-0 py-2 d-flex justify-center">
              <h1 class="blackish">Watch out!</h1>
            </v-row>
            <v-row class="ma-0 pt-6 d-flex justify-center">
              <p class="text-center">Your Health Factor has dropped to
                <span class="redish"> 0%</span>!</p>
            </v-row>
            <v-row class="ma-0 px-3 d-flex justify-center">
              <p class="text-center">
                All your collaterals will be liquidated. If you wish to continue trading on RBank,
                feel free to supply new markets on the network.
              </p>
            </v-row>
          </v-card>
        </v-dialog>
      </template>
      <v-row class="d-flex justify-center">
        <h1 class="my-5"> Investment Dashboard</h1>
      </v-row>
      <v-row class="ma-0 py-6">
        <v-col class="pa-0 d-flex justify-center">
          <v-card class="graphics-card container" width="94%">
            <v-row class="ma-0 d-flex align-center">
              <v-col cols="9" class="py-0">
                <v-row class="d-flex align-center">
                  <v-col cols="6" class="px-0 text-left"><h2>Account balance:</h2></v-col>
                  <v-col cols="5" class="px-0">
                    <h2 class="text-center">{{ totalBalance | formatPrice }}</h2>
                  </v-col>
                  <v-col cols="1" class="pa-0"><span class="text-left">USD</span></v-col>
                </v-row>
                <v-row>
                  <v-divider/>
                </v-row>
                <v-row>
                  <v-col cols="6" class="px-0"><h3>Overall Earnings:</h3></v-col>
                  <v-col cols="5" class="px-0">
                    <h3 class="text-center">{{ totalEarnings | formatPrice }}</h3>
                  </v-col>
                  <v-col cols="1" class="pa-0"><span class="text-left">USD</span></v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="px-0"><h4>Total Supplied:</h4></v-col>
                  <v-col cols="5" class="px-0">
                    <h4 class="text-center">{{ totalSupplied | formatPrice }}</h4>
                  </v-col>
                  <v-col cols="1" class="pa-0"><span class="text-left">USD</span></v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" class="px-0"><h4>Total Borrowed:</h4></v-col>
                  <v-col cols="5" class="px-0">
                    <h4 class="text-center">{{ totalBorrowed | formatPrice }}</h4>
                  </v-col>
                  <v-col cols="1" class="pa-0"><span class="text-left">USD</span></v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <v-row class="d-flex justify-center">
                  <v-btn small fab dark color="#008CFF">
                    <v-icon dark color="#FFFFFF">mdi-plus</v-icon>
                  </v-btn>
                </v-row>
                <v-row class="mt-2 d-flex justify-center text-center">
                  <span>Add Funds</span>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col class="pa-0 d-flex justify-center">
          <v-card class="graphics-card d-flex align-center" width="94%">
            <v-row class="ma-0">
              <v-col cols="7">
                <v-row class="ma-0 d-flex align-center">
                  <h2>Health Factor:</h2>
                  <v-tooltip top color="#E5E5E5">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon small class="mx-5" v-bind="attrs" v-on="on">info</v-icon>
                    </template>
                    <div class="tooltip">
                      Your Health Factor represents <br> the state of your loans.
                      <span class="boldie"> Don't <br> let it drop to
                      <span class="redish"> 0% </span></span>
                      or your <br> collateral might be liquidated!
                    </div>
                  </v-tooltip>
                </v-row>
                <v-row class="ma-0">
                  <v-divider/>
                </v-row>
                <v-row class="ma-0 pt-3">
                  <p>Your Account has a <b>{{risk}}</b> risk of liquidation</p>
                </v-row>
              </v-col>
              <v-col cols="5" class="d-flex justify-center">
                <v-progress-circular :rotate="270" :size="150" :width="25"
                                     :value="healthFactor" :color="healthColor">
                  {{accountHealth}}%
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-card class="graphics-card container" width="97%">
          <supply-borrow-graph/>
        </v-card>
      </v-row>
    </div>
    <v-row class="mx-6 d-flex justify-center">
      <tx-list/>
    </v-row>
  </div>
</template>

<script>
import SupplyBorrowGraph from '@/components/dashboard/SupplyBorrowGraph.vue';
import TxList from '@/components/dashboard/TxList.vue';
import { mapState } from 'vuex';

export default {
  name: 'MyActivity',
  components: {
    SupplyBorrowGraph,
    TxList,
  },
  data() {
    return {
      healthFactor: 0,
      totalBalance: 0,
      totalEarnings: 0,
      totalSupplied: 0,
      totalBorrowed: 0,
      showHealthWarning: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    accountHealth() {
      return this.healthFactor.toFixed(2);
    },
    healthColor() {
      if (this.risk === 'high') return '#EB5757';
      if (this.risk === 'medium') return '#F2994A';
      return '#24BD6B';
    },
    risk() {
      if (this.healthFactor >= 30) {
        if (this.healthFactor >= 60) {
          return 'low';
        }
        return 'medium';
      }
      return 'high';
    },
  },
  methods: {
    getData() {
      this.$rbank.controller.getAccountValues(this.account)
        .then(({ supplyValue, borrowValue }) => {
          this.totalBorrowed = borrowValue;
          this.totalSupplied = supplyValue;
          this.totalBalance = this.totalSupplied - this.totalBorrowed;
          return this.$rbank.controller.getAccountHealth(this.account);
        })
        .then((health) => {
          this.healthFactor = health > 1 ? 100 : health * 100;
          this.showHealthWarning = this.healthFactor <= 0;
        });
    },
  },
  created() {
    this.getData();
  },
};
</script>
