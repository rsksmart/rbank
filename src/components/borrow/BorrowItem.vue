<template>
  <div class="dialog">
    <v-list-item>
      <v-row class="my-5 mx-0 d-flex align-center">
        <v-col cols="3">
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
        <v-col cols="3">
          <v-list-item-subtitle class="item">
            {{ price | formatPrice }}<span class="ml-2 itemInfo">usd</span>
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="2">
          <v-list-item-subtitle class="item">
            {{ apr }}%
          </v-list-item-subtitle>
        </v-col>
        <v-col cols="4" class="px-0">
          <v-row class="ma-0">
            <v-col cols="9" class="pa-0 d-flex align-center">
              <v-list-item-subtitle class="item">
                <template v-if="$options.filters
                  .formatToken(cash, token.decimals).toString().length > 6">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span class="d-flex align-center" v-bind="attrs" v-on="on">
                        {{ cash | formatToken(token.decimals) }}
                      </span>
                    </template>
                    <span>{{ cash | fullToken(token.decimals) }}</span>
                  </v-tooltip>
                </template>
                <template v-else>
                  <span class="d-flex align-center">
                    {{ cash | formatToken(token.decimals) }}
                  </span>
                </template>
              </v-list-item-subtitle>
            </v-col>
            <v-col cols="3" class="pa-0">
              <v-btn class="pa-0" @click="dialog = !dialog" icon>
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
      <borrow-dialog :data="dataObject" @closed="reset"/>
    </template>
  </div>
</template>

<script>
import BorrowDialog from '@/components/dialog/borrow/BorrowDialog.vue';

export default {
  name: 'BorrowItem',
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
      dialog: false,
    };
  },
  computed: {
    apr() {
      return this.borrowRate.toFixed(2);
    },
    dataObject() {
      return {
        flag: this.dialog,
        borrowRate: this.borrowRate,
        price: this.price,
        token: this.token,
        market: this.market,
      };
    },
  },
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
    handleEvent(error, event) {
      if (error) {
        console.error(error);
      } else {
        console.log(event);
      }
    },
  },
  components: {
    BorrowDialog,
  },
  mounted() {
    this.$parent.$parent.$parent.$on('reload', this.reset);
  },
  created() {
    this.market.eventualEvents
      .then((events) => {
        const allEventsEmitter = events.allEvents(this.handleEvent);
        allEventsEmitter
          .on('data', this.reset);
        allEventsEmitter
          .on('error', (error) => console.error(error));
      });
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
      });
  },
};
</script>
