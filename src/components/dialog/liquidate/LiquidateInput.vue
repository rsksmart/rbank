<template>
  <div class="liquidate-input">
    <template v-if="!waiting">
      <liquidate-list
        v-if="!accountSelected"
        :data="data"
        @selected="setLiquidationAccount"
      />
      <div v-else>
        <v-row class="mx-6 px-6 mb-3">
          <h1>
            Collateral Available to liquidate:
          </h1>
        </v-row>
        <v-row class="mx-6 px-6">
          <p class="text-justify">
            As collaterals are not necessarily expressed in the same token as the market,
            you may need to liquidate them in other tokens.
          </p>
        </v-row>
        <v-row class="my-4 d-flex align-center">
          <v-col cols="4">
            <v-row class="d-flex justify-center">
              <h2>Collateral</h2>
            </v-row>
            <v-row class="d-flex justify-center">
                  <span>
                    ETH
                  </span>
            </v-row>
            <v-row class="d-flex justify-center">
              <h2>Equivalent Collateral</h2>
            </v-row>
            <v-row class="d-flex justify-center">
              <h2>145 MTN</h2>
            </v-row>
          </v-col>
          <v-divider vertical inset/>
          <v-col cols="7" class="input-col">
            <v-row class="inputBox px-3">
              <v-col cols="10">
                <v-text-field class="inputText" full-width single-line solo flat hide-details
                              type="number" v-model="amount"/>
              </v-col>
              <v-col cols="2">
                <v-btn @click="maxAmount = true" class="pa-0" text color="#008CFF">max</v-btn>
              </v-col>
            </v-row>
            <v-row class="mx-0 my-4 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>
                  You pay:
                </h4>
              </v-col>
              <v-col cols="6" class="summary-num d-flex justify-center">
                0
              </v-col>
              <v-col cols="2">
                <span>ETH</span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>
                  0 USD
                </span>
              </v-col>
            </v-row>
            <v-row class="mx-0 my-4 px-1 d-flex align-center">
              <v-col cols="2">
                <h4>
                  You get:
                </h4>
              </v-col>
              <v-col cols="6" class="summary-num d-flex justify-center">
                0
              </v-col>
              <v-col cols="2">
                <span>ETH</span>
              </v-col>
              <v-col cols="2" class="d-flex justify-end">
                <span>
                  0 USD
                </span>
              </v-col>
            </v-row>
            <v-row class="px-1 mt-6 d-flex justify-center">
              <h5>
                Would you like to
                <a href="">buy more tokens?</a>
              </h5>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="my-6 d-flex justify-center">
          <v-btn class="button" rounded color="#008CFF">
            Liquidate account
          </v-btn>
        </v-row>
      </div>
    </template>
    <template v-else>
      <loader/>
    </template>
  </div>
</template>

<script>
import LiquidateList from '@/components/dialog/liquidate/LiquidateList.vue';
import Loader from '@/components/common/Loader.vue';

export default {
  name: 'LiquidateInput',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      waiting: false,
      currentComponent: '',
      liquidationAccount: '',
      accountSelected: false,
      amount: 0,
    };
  },
  methods: {
    initForm() {

    },
    setLiquidationAccount(account) {
      this.liquidationAccount = account;
      this.initForm();
      this.accountSelected = true;
    },
    actionSucceed(succeedObj) {
      this.emit('succeed', succeedObj);
    },
  },
  components: {
    Loader,
    LiquidateList,
  },
  created() {
    this.currentComponent = 'LiquidateList';
  },
};
</script>
