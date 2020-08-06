<template>
  <v-dialog v-model="data.flag" width="50%">
    <v-card class="dialog container">
      <template v-if="!succeed">
        <supply-top :data="marketTokenObject"/>
        <template v-if="!waiting">
          <v-row class="d-flex justify-center">
            <div class="toggle my-5">
              <v-btn :class="[ currentComponent === 'SupplyInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'SupplyInput'">
                <span>Supply</span>
              </v-btn>
              <v-btn :class="[ currentComponent === 'BorrowInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'BorrowInput'">
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
    },
    actionSucceed(succeedObject) {
      this.hash = succeedObject.hash;
      this.supplied = succeedObject.supplied;
      this.borrowLimitInfo = succeedObject.borrowLimitInfo;
      this.supplyBalanceInfo = succeedObject.supplyBalanceInfo;
      this.succeed = true;
      this.waiting = false;
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
  },
  watch: {
    currentComponent() {
      this.successComponent = this
        .currentComponent === 'SupplyInput' ? 'SupplySuccess' : 'BorrowSuccess';
    },
  },
};
</script>
