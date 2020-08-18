<template>
  <div class="dialog">
    <v-list-item class="pa-0">
      <v-row class="my-5 mx-0 d-flex align-center">
        <v-col cols="2">
          <v-row class="d-flex align-center">
            <v-col cols="6" class="pa-0 d-flex justify-end">
              <v-list-item-avatar tile size="40">
                <v-img src="../../assets/rif.png"/>
              </v-list-item-avatar>
            </v-col>
            <v-col cols="6" class="pa-0 d-flex justify-start">
              <v-list-item-subtitle class="item d-flex justify-start">
                {{ token.symbol }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ price | formatPrice }}<span class="ml-2 itemInfo">usd</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ apr }}%
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ totalSupplyAsDouble }}
            <span class="ml-2 itemInfo">{{ token.symbol }}</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ totalBorrowsAsDouble }}
            <span class="ml-2 itemInfo">{{ token.symbol }}</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2" class="px-0">
          <v-row class="ma-0">
            <v-col cols="10" class="pa-0 d-flex align-center">
              <v-list-item-subtitle class="item">
                {{ cashAsDouble }}
                <span class="ml-2 itemInfo">{{ token.symbol }}</span>
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="2" class="pa-0">
              <v-btn class="pa-0 ma-0" @click="dialog = !dialog" icon>
                <svg width="11" height="32" viewBox="0 0 11 32" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L9 16L1 31" stroke="#008CFF" stroke-width="2"
                        stroke-linecap="round"/>
                </svg>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-list-item>
    <v-divider/>
    <template v-if="dialog">
      <market-dialog :data="dataObject"/>
    </template>
  </div>
</template>

<script>
import MarketDialog from '@/components/dialog/market/MarketDialog.vue';

export default {
  name: 'MarketItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      price: 0,
      borrowRate: 0,
      cash: 0,
      totalSupply: 0,
      totalBorrow: 0,
      dialog: false,
    };
  },
  computed: {
    apr() {
      return this.borrowRate.toFixed(2);
    },
    cashAsDouble() {
      return (this.cash / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    totalSupplyAsDouble() {
      return (this.totalSupply / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    totalBorrowsAsDouble() {
      return (this.totalBorrow / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    dataObject() {
      return {
        flag: this.dialog,
        token: this.token,
        market: this.market,
      };
    },
  },
<<<<<<< HEAD:src/components/supplyBorrow/borrow/BorrowItem.vue
  methods: {
    reset() {
      this.dialog = false;
      this.$rbank.controller.eventualMarketPrice(this.market.address)
        .then((marketPrice) => {
          this.price = marketPrice;
          return this.market.eventualBorrowRate;
        })
        .then((borrowRate) => {
          this.borrowRate = borrowRate;
          return this.market.eventualCash;
        })
        .then((cash) => {
          this.cash = cash;
        });
      this.$emit('dialogClosed');
    },
  },
=======
>>>>>>> feature/admin:src/components/admin/MarketItem.vue
  components: {
    MarketDialog,
  },
  created() {
    this.market.eventualToken
      .then((tok) => [
        tok.eventualName,
        tok.eventualSymbol,
        tok.eventualDecimals,
      ])
      .then((results) => Promise.all(results))
      .then(([name, symbol, decimals]) => {
        this.token.name = name;
        this.token.symbol = symbol;
        this.token.decimals = decimals;
        return this.$rbank.controller.eventualMarketPrice(this.market.address);
      })
      .then((marketPrice) => {
        this.price = marketPrice;
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        return this.market.eventualCash;
      })
      .then((cash) => {
        this.cash = cash;
        return this.market.eventualUpdatedTotalSupply;
      })
      .then((updatedTotalSupply) => {
        this.totalSupply = updatedTotalSupply;
        return this.market.eventualUpdatedTotalBorrows;
      })
      .then((updatedTotalBorrows) => {
        this.totalBorrow = updatedTotalBorrows;
      });
  },
};
</script>
