<template>
  <div>
    <div class="successBox">
      <v-row class="my-5 d-flex justify-center">
        <h1 class="blueish">Success!</h1>
      </v-row>
      <v-row class="my-5 d-flex justify-center">
        <div class="text-center">
          You have successfully borrowed <br>
          <template v-if="$options.filters
           .formatToken(data.borrowBalanceInfo, data.token.decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span class="greenish" v-bind="attrs" v-on="on">
                  {{ data.borrowBalanceInfo | formatToken(data.token.decimals) }}
                </span>
              </template>
              <span>{{ data.borrowBalanceInfo | fullToken(data.token.decimals) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <span class="greenish">
              {{ data.borrowBalanceInfo | formatToken(data.token.decimals) }}
            </span>
          </template>
          <span class="greenish">{{ data.token.symbol }}</span>
           from this Market.
        </div>
      </v-row>
    </div>
    <div class="my-5 py-5">
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>borrow balance:</h3>
        </v-col>
        <v-col cols="3">
          <template v-if="$options.filters
           .formatToken(borrowBy, data.token.decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <h1 class="text-center" v-bind="attrs" v-on="on">
                  {{ borrowBy | formatToken(data.token.decimals) }}
                </h1>
              </template>
              <span>{{ borrowBy | fullToken(data.token.decimals) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <h1 class="text-center">{{ borrowBy | formatToken(data.token.decimals) }}</h1>
          </template>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex justify-end">
          <h3>in your wallet:</h3>
        </v-col>
        <v-col cols="3">
          <template v-if="$options.filters
           .formatToken(tokenBalance, data.token.decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <h1 class="text-center" v-bind="attrs" v-on="on">
                  {{ tokenBalance | formatToken(data.token.decimals) }}
                </h1>
              </template>
              <span>{{ tokenBalance | fullToken(data.token.decimals) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <h1 class="text-center">{{ tokenBalance | formatToken(data.token.decimals) }}</h1>
          </template>
        </v-col>
        <v-col cols="2">
          <span class="itemInfo">{{ data.token.symbol }}</span>
        </v-col>
        <v-col cols="2"/>
      </v-row>
      <v-row class="d-flex align-center">
        <v-col cols="2"/>
        <v-col cols="3" class="d-flex align-end justify-end">
          <h3>borrow limit:</h3>
        </v-col>
        <v-col cols="3">
          <template v-if="$options.filters
           .formatToken(maxBorrowAllowed, data.token.decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <h1 class="text-center" v-bind="attrs" v-on="on">
                  {{ maxBorrowAllowed | formatToken(data.token.decimals) }}
                </h1>
              </template>
              <span>{{ maxBorrowAllowed | fullToken(data.token.decimals) }}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <h1 class="text-center">{{ maxBorrowAllowed | formatToken(data.token.decimals) }}</h1>
          </template>
        </v-col>
        <v-col cols="2">
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
  name: 'BorrowSuccess',
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
      borrowBy: 0,
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
        return this.data.market.updatedBorrowBy(this.account);
      })
      .then((borrowBy) => {
        this.borrowBy = borrowBy;
        this.maxBorrowAllowed = this.getMaxAllowed(this.liquidity, this.cash);
      });
  },
};
</script>
