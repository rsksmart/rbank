<template>
  <div>
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully supplied <br> this Market with
          <template v-if="$options.filters
                  .formatToken(data.supplyBalanceInfo, data.token.decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span class="greenish" v-bind="attrs" v-on="on">
                  {{ data.supplyBalanceInfo | formatToken(data.token.decimals) }}
                </span>
              </template>
              <span>{{ data.supplyBalanceInfo | fullToken(data.token.decimals) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <span class="greenish">
              {{ data.supplyBalanceInfo | formatToken(data.token.decimals) }}
            </span>
          </template>
          <span class="greenish">{{ data.token.symbol }}</span>
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>in your wallet:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7" class="d-flex justify-center">
              <template v-if="$options.filters
                  .formatToken(tokenBalance, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <h1 v-bind="attrs" v-on="on">
                      {{ tokenBalance | formatToken(data.token.decimals) }}
                    </h1>
                  </template>
                  <span>{{ tokenBalance | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <h1>
                  {{ tokenBalance | formatToken(data.token.decimals) }}
                </h1>
              </template>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <template v-if="$options.filters
                  .formatToken(data.supplyBalanceInfo, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-if="data.supplyBalanceInfo" v-bind="attrs" v-on="on">
                      (-{{ data.supplyBalanceInfo  | formatToken(data.token.decimals) }})
                    </span>
                  </template>
                  <span>{{ data.supplyBalanceInfo | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <span v-if="data.supplyBalanceInfo">
                  (-{{ data.supplyBalanceInfo  | formatToken(data.token.decimals) }})
                </span>
              </template>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>supply balance:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7" class="d-flex justify-center">
              <template v-if="$options.filters
                  .formatToken(supplyOf, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <h1 v-bind="attrs" v-on="on">
                      {{ supplyOf | formatToken(data.token.decimals) }}
                    </h1>
                  </template>
                  <span>{{ supplyOf | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <h1>{{ supplyOf | formatToken(data.token.decimals) }}</h1>
              </template>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <template v-if="$options.filters
                  .formatToken(data.supplyBalanceInfo, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-if="data.supplyBalanceInfo" v-bind="attrs" v-on="on">
                      (+{{ data.supplyBalanceInfo | formatToken(data.token.decimals)  }})
                    </span>
                  </template>
                  <span>{{ data.supplyBalanceInfo | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <span v-if="data.supplyBalanceInfo">
                  (+{{ data.supplyBalanceInfo | formatToken(data.token.decimals)  }})
                </span>
              </template>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>borrow limit:</h3>
        </v-col>
        <v-col cols="4">
          <v-row class="ma-0 d-flex align-center">
            <v-col cols="7" class="d-flex justify-center">
              <template v-if="$options.filters
                  .formatToken(maxBorrowAllowed, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <h1 v-bind="attrs" v-on="on">
                      {{ maxBorrowAllowed | formatToken(data.token.decimals) }}
                    </h1>
                  </template>
                  <span>{{ maxBorrowAllowed | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <h1>{{ maxBorrowAllowed | formatToken(data.token.decimals) }}</h1>
              </template>
            </v-col>
            <v-col cols="5" class="itemInfo">
              <template v-if="$options.filters
                  .formatToken(data.borrowLimitInfo, data.token.decimals).toString().length > 6">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-if="data.borrowLimitInfo" v-bind="attrs" v-on="on">
                      (+{{ data.borrowLimitInfo | formatToken(data.token.decimals) }})
                    </span>
                  </template>
                  <span>{{ data.borrowLimitInfo | fullToken(data.token.decimals) }}</span>
                </v-tooltip>
              </template>
              <template v-else>
                <h1>{{ data.borrowLimitInfo | formatToken(data.token.decimals) }}</h1>
              </template>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="1">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
    </div>
    <transaction-hash :hash="data.hash"/>
    <v-row class="my-5 d-flex justify-center">
      <v-btn class="button" rounded color="#008CFF" @click="closeDialog">
        Back to Supply / Borrow
      </v-btn>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TransactionHash from '@/components/common/TransactionHash.vue';

export default {
  name: 'SupplySuccess',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tokenBalance: 0,
      liquidity: 0,
      cash: 0,
      price: 0,
      maxBorrowAllowed: 0,
      supplyOf: 0,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    getMaxAllowed(liquidity, cash) {
      const allowed = this.price > 0 ? Math.floor(liquidity / (this.price * 2)) : 0;
      return allowed >= cash ? cash : allowed;
    },
  },
  components: {
    TransactionHash,
  },
  created() {
    this.data.market.eventualToken
      .then((tok) => tok.eventualBalanceOf(this.account))
      .then((tokenBalance) => {
        this.tokenBalance = tokenBalance;
        return this.$rbank.controller.getAccountLiquidity(this.account);
      })
      .then((accountLiquidity) => {
        this.liquidity = accountLiquidity;
        return this.data.market.eventualCash;
      })
      .then((cash) => {
        this.cash = cash;
        return this.$rbank.controller.eventualMarketPrice(this.data.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.data.market.updatedSupplyOf(this.account);
      })
      .then((supplyOf) => {
        this.supplyOf = supplyOf;
        this.maxBorrowAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
