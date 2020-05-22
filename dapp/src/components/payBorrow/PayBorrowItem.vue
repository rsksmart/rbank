<template>
  <div class="LiquidatedItem">
    <v-card class="mt-5" outlined>
      <v-list-item @click="enableForm()">
        <v-row>
          <v-col cols="2" class="d-flex justify-end">
            <v-list-item-avatar>
              <v-img src="https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png"/>
            </v-list-item-avatar>
          </v-col>
          <v-col cols="2">
            <v-list-item-content>
              <v-list-item-title class="text-left">
                {{ tokenSymbol }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                {{ updatedBorrowBy }}
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
          <v-col cols="4">
            <v-list-item-content>
              <v-list-item-title class="text-center">
                ... %
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
        </v-row>
      </v-list-item>
    </v-card>
    <template v-if="flag">
      <pay-borrow-form @formSucceed="reset" :marketAddress="marketAddress"
                       :maxAmountAllowed="updatedBorrowBy"/>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Market from '@/handlers/market';
import Token from '@/handlers/token';
import PayBorrowForm from '@/components/market/PayBorrowForm.vue';

export default {
  name: 'PayBorrowItem',
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      market: null,
      token: null,
      updatedBorrowBy: null,
      tokenName: null,
      tokenSymbol: null,
    };
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  methods: {
    reset() {
      this.flag = false;
      this.getUpdatedBorrowBy();
    },
    enableForm() {
      this.flag = !this.flag;
    },
    getUpdatedBorrowBy() {
      this.market.getUpdatedBorrowBy(this.account)
        .then((borrowBy) => {
          this.updatedBorrowBy = Number(borrowBy);
        });
    },
  },
  components: {
    PayBorrowForm,
  },
  created() {
    this.market = new Market(this.marketAddress);
    this.market.eventualTokenAddress
      .then((tokenAddress) => {
        this.token = new Token(tokenAddress);
        return [this.token.eventualName, this.token.eventualSymbol];
      })
      .then((tokenPromises) => Promise.all(tokenPromises))
      .then(([tokenName, tokenSymbol]) => {
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.getUpdatedBorrowBy();
      });
  },
};
</script>

<style scoped>

</style>
