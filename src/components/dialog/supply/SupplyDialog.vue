<template>
  <v-dialog v-model="data.flag" width="600">
    <v-card class="dialog container">
      <template v-if="!succeed">
        <component :is="topComponent" :data="marketTokenObject"/>
        <template v-if="!waiting">
          <v-row class="d-flex justify-center">
            <div class="toggle-triple my-5">
              <v-btn :class="[ currentComponent === 'LiquidateInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'LiquidateInput'">
                <span>Liquidate</span>
              </v-btn>
              <v-btn :class="[ currentComponent === 'SupplyInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'SupplyInput'">
                <span>Supply</span>
              </v-btn>
              <v-btn :class="[ currentComponent === 'WithdrawInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'WithdrawInput'">
                <span>Withdraw</span>
              </v-btn>
            </div>
          </v-row>
        </template>
        <template>
          <component :is="currentComponent" :data="marketTokenObject"
                     @succeed="actionSucceed" @wait="waiting = true"/>
        </template>
      </template>
      <template v-else>
        <success-top :data="marketTokenObject"/>
        <component :is="successComponent" :data="successObject" @closeDialog="close"/>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import SupplyTop from '@/components/dialog/supply/SupplyTop.vue';
import SuccessTop from '@/components/dialog/SuccessTop.vue';
import SupplySuccess from '@/components/dialog/supply/SupplySuccess.vue';
import SupplyInput from '@/components/dialog/supply/SupplyInput.vue';
import WithdrawInput from '@/components/dialog/withdraw/WithdrawInput.vue';
import WithdrawTop from '@/components/dialog/withdraw/WithdrawTop.vue';
import WithdrawSuccess from '@/components/dialog/withdraw/WithdrawSuccess.vue';
import LiquidateInput from '@/components/dialog/liquidate/LiquidateInput.vue';

export default {
  name: 'SupplyDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentComponent: 'SupplyInput',
      successComponent: 'SupplySuccess',
      topComponent: 'SupplyTop',
      succeed: false,
      waiting: false,
      supplyBalanceInfo: null,
      borrowLimitInfo: null,
      hash: null,
    };
  },
  computed: {
    marketTokenObject() {
      return {
        token: this.data.token,
        market: this.data.market,
      };
    },
    successObject() {
      return {
        market: this.data.market,
        token: this.data.token,
        borrowLimitInfo: this.borrowLimitInfo,
        supplyBalanceInfo: this.supplyBalanceInfo,
        hash: this.hash,
      };
    },
  },
  methods: {
    reset() {
      this.succeed = false;
      this.waiting = false;
      this.supplyBalanceInfo = null;
      this.borrowLimitInfo = null;
      this.currentComponent = 'SupplyInput';
      this.hash = null;
    },
    actionSucceed(succeedObject) {
      this.hash = succeedObject.hash;
      this.borrowLimitInfo = succeedObject.borrowLimitInfo;
      this.supplyBalanceInfo = succeedObject.supplyBalanceInfo;
      this.succeed = true;
      this.waiting = false;
      this.liquidateValue = succeedObject.liquidateValue;
      this.costValue = succeedObject.costValue;
    },
    close() {
      this.reset();
      this.$emit('closeDialog');
    },
  },
  components: {
    SupplyTop,
    SuccessTop,
    SupplySuccess,
    SupplyInput,
    WithdrawInput,
    WithdrawTop,
    WithdrawSuccess,
    LiquidateInput,
  },
  watch: {
    currentComponent() {
      if (this.currentComponent === 'SupplyInput') {
        this.successComponent = 'SupplySuccess';
        this.topComponent = 'SupplyTop';
      } else if (this.currentComponent === 'WithdrawInput') {
        this.successComponent = 'WithdrawSuccess';
        this.topComponent = 'WithdrawTop';
      }
    },
  },
};
</script>
