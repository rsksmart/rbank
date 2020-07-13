<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5" outlined>
      <v-list-item @click="enableForm()">
        <v-row>
          <v-col cols="2" class="d-flex justify-end">
            <v-list-item-avatar>
              <v-img :src="rif"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="2">
            <v-list-item-content>
              <v-list-item-title class="text-left">
                {{ token.symbol }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                {{ maxRedeemAmount }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                {{ apr }} %
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <redeem-form @formSucceed="reset" :data="formObject"/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import rifImage from '@/assets/rif.png';
import RedeemForm from '@/components/market/RedeemForm.vue';

export default {
  name: 'RedeemItem',
  props: {
    market: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      token: {
        name: null,
        symbol: null,
        decimals: 0,
      },
      userSupply: null,
      borrowRate: 0,
      cash: 0,
      rif: rifImage,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
    maxRedeemAmount() {
      const allowed = this.cash > this.userSupply
        ? this.userSupply : this.cash;
      return (allowed / (10 ** this.token.decimals))
        .toFixed(this.token.decimals);
    },
    apr() {
      return this.borrowRate.toFixed(2);
    },
    formObject() {
      return {
        market: this.market,
        token: this.token,
        cash: this.cash,
        max: Number(this.maxRedeemAmount) * (10 ** this.token.decimals),
        userSupply: this.userSupply,
      };
    },
  },
  methods: {
    reset() {
      this.flag = false;
      this.getUserSupply();
      this.getMarketCash();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    async getUserSupply() {
      await this.market.updatedSupplyOf(this.account)
        .then((supply) => {
          this.userSupply = supply;
        });
    },
    async getMarketCash() {
      await this.market.eventualCash
        .then((cash) => {
          this.cash = cash;
        });
    },
  },
  components: {
    RedeemForm,
  },
  created() {
    this.market.token
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
        return this.market.eventualBorrowRate;
      })
      .then((borrowRate) => {
        this.borrowRate = borrowRate;
        this.getUserSupply();
        this.getMarketCash();
      });
  },
};
</script>
