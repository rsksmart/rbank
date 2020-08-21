<template>
  <div class="my-activity">
    <v-row class="upper-banner">
      <v-col>
        <v-row class="d-flex justify-center">
          <h1> Investment Dashboard</h1>
        </v-row>
        <v-row class="mx-6">
          <v-col class="ml-6 mr-0 mt-6 d-flex justify-center">
            <v-row class="my-6 d-flex justify-center">
              <div class="px-6 graphics-card">
                <v-row class="d-flex align-center">
                  <v-col cols="9">
                    <v-row class="d-flex align-center">
                      <v-col cols="6">
                        <h2>Account balance:</h2>
                      </v-col>
                      <v-col cols="4">
                        <v-row>
                          <h2>${{totalBalance}}</h2>
                        </v-row>
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <span class="mx-6">USD</span>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <div class="card-divider"></div>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <h3>Overall Earnings:</h3>
                      </v-col>
                      <v-col cols="4">
                        <v-row>
                          <h3>${{totalEarnings}}</h3>
                        </v-row>
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <span class="mx-6">USD</span>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <h4>Total Supplied:</h4>

                      </v-col>
                      <v-col cols="4">
                        <v-row>
                          <h4>${{totalSupplied}}</h4>
                        </v-row>
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <span class="mx-6">USD</span>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <h4>Total Borrowed:</h4>
                      </v-col>
                      <v-col cols="4">
                        <v-row>
                          <h4>${{totalBorrowed}}</h4>
                        </v-row>
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <span class="mx-6">USD</span>
                        </v-row>
                      </v-col>
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
              </div>
            </v-row>
          </v-col>
          <v-col class="mr-6 ml-0 mt-6 d-flex justify-center">
            <v-row class="my-6 d-flex justify-center">
              <div class="px-6 graphics-card">
                <v-row>
                  <v-col class="mx-3 px-6">
                    <v-row class="health-card-title d-flex align-center">
                      <h2>Health Factor:</h2>
                      <a class="mx-2">
                        <v-icon small>
                          info
                        </v-icon>
                      </a>
                    </v-row>
                    <v-row>
                      <div class="card-divider-health"></div>
                    </v-row>
                    <v-row class=" mt-3 health-card-text">
                      <p>Your Account has a <b>{{risk}}</b> risk of liquidation</p>
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-center">
                    <v-progress-circular
                      :rotate="270"
                      :size="150"
                      :width="25"
                      :value="healthFactor"
                      color="#6FCF97"
                    >
                      {{accountHealth}}%
                    </v-progress-circular>
                  </v-col>
                </v-row>
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mx-6">
          <v-col class="ml-6 d-flex justify-center">
            <v-row class="d-flex justify-center">
              <div class="px-6 graphics-card">
                <time-balance-graph/>
              </div>
            </v-row>
          </v-col>
          <v-col class="mr-6 d-flex justify-center">
            <v-row class="d-flex justify-center">
              <div class="px-6 graphics-card">
                <supply-borrow-graph/>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-6 d-flex justify-center">
      <tx-list/>
    </v-row>
  </div>
</template>

<script>
import SupplyBorrowGraph from '@/components/dashboard/SupplyBorrowGraph.vue';
import TimeBalanceGraph from '@/components/dashboard/TimeBalanceGraph.vue';
import TxList from '@/components/dashboard/TxList.vue';
import { mapState } from 'vuex';

export default {
  name: 'MyActivity',
  components: {
    SupplyBorrowGraph,
    TimeBalanceGraph,
    TxList,
  },
  data() {
    return {
      healthFactor: 0,
      totalBalance: 0,
      totalEarnings: 0,
      totalSupplied: 0,
      totalBorrowed: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    accountHealth() {
      return this.healthFactor.toFixed(2);
    },
    risk() {
      if (this.healthFactor >= 20) {
        if (this.healthFactor >= 50) {
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
        // eslint-disable-next-line no-return-assign
        .then((health) => this.healthFactor = health > 1 ? 100 : health * 100);
    },
  },
  created() {
    this.getData();
  },
};
</script>
