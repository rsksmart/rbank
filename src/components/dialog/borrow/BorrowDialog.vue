<template>
  <v-dialog v-model="data.flag" width="600">
    <v-card class="dialog container">
      <template v-if="!succeed">
        <borrow-top :data="marketTokenObject"/>
        <template v-if="!waiting">
          <v-row class="d-flex justify-center">
            <div class="toggle my-5">
              <v-btn :class="[ currentComponent === 'BorrowInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'BorrowInput'">
                <span>Borrow</span>
              </v-btn>
              <v-btn :class="[ currentComponent === 'RepayInput' ? 'selected' : 'notSelected']"
                     text @click="currentComponent = 'RepayInput'">
                <span>Repay</span>
              </v-btn>
            </div>e este fin no hay partidos entonces
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
import BorrowTop from '@/components/dialog/borrow/BorrowTop.vue';
import SuccessTop from '@/components/dialog/SuccessTop.vue';
import BorrowSuccess from '@/components/dialog/borrow/BorrowSuccess.vue';
import BorrowInput from '@/components/dialog/borrow/BorrowInput.vue';
import RepayInput from '@/components/dialog/repay/RepayInput.vue';
import RepaySuccess from '@/components/dialog/repay/RepaySuccess.vue';

export default {
  name: 'BorrowDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentComponent: 'BorrowInput',
      successComponent: 'BorrowSuccess',
      succeed: false,
      waiting: false,
      borrowBalanceInfo: null,
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
        borrowBalanceInfo: this.borrowBalanceInfo,
        hash: this.hash,
      };
    },
  },
  methods: {
    reset() {
      this.currentComponent = 'BorrowInput';
      this.succeed = false;
      this.waiting = false;
      this.borrowBalanceInfo = null;
      this.hash = null;
    },
    actionSucceed(succeedObject) {
      this.hash = succeedObject.hash;
      this.borrowed = succeedObject.borrowed;
      this.borrowBalanceInfo = succeedObject.borrowBalanceInfo;
      this.succeed = true;
      this.waiting = false;
    },
    close() {
      this.reset();
      this.$emit('closeDialog');
    },
  },
  components: {
    BorrowTop,
    SuccessTop,
    BorrowSuccess,
    BorrowInput,
    RepayInput,
    RepaySuccess,
  },
  watch: {
    currentComponent() {
      this.successComponent = this
        .currentComponent === 'BorrowInput' ? 'BorrowSuccess' : 'RepaySuccess';
    },
  },
};
</script>
