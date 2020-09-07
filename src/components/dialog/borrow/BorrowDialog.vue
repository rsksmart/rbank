<template>
  <v-dialog v-model="flag" width="600" :persistent="waiting || succeed">
    <v-card class="dialog container" v-click-outside="onClickOutside">
      <template v-if="!succeed && !errorDialog">
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
            </div>
          </v-row>
        </template>
        <template>
          <component :is="currentComponent" :data="marketTokenObject"
                     @succeed="actionSucceed" @wait="waiting = true" @error="actionError"/>
        </template>
      </template>
      <template v-if="errorDialog && !succeed">
        <error-dialog @closeDialog="close"/>
      </template>
      <template v-if="succeed">
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
import ErrorDialog from '@/components/dialog/ErrorDialog.vue';

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
      flag: this.data.flag,
      currentComponent: 'BorrowInput',
      successComponent: 'BorrowSuccess',
      succeed: false,
      waiting: false,
      borrowBalanceInfo: null,
      hash: null,
      errorDialog: null,
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
      this.flag = false;
      this.currentComponent = 'BorrowInput';
      this.succeed = false;
      this.waiting = false;
      this.borrowBalanceInfo = null;
      this.hash = null;
      this.errorDialog = null;
    },
    actionError() {
      this.succeed = false;
      this.waiting = false;
      this.errorDialog = true;
    },
    actionSucceed(succeedObject) {
      this.hash = succeedObject.hash;
      this.borrowed = succeedObject.borrowed;
      this.borrowBalanceInfo = succeedObject.borrowBalanceInfo;
      this.succeed = true;
      this.waiting = false;
      this.errorDialog = false;
    },
    onClickOutside() {
      if (!this.waiting && !this.succeed) {
        this.reset();
        this.$emit('closed');
      }
    },
    close() {
      this.reset();
      this.$emit('closed');
    },
  },
  components: {
    BorrowTop,
    SuccessTop,
    BorrowSuccess,
    BorrowInput,
    RepayInput,
    RepaySuccess,
    ErrorDialog,
  },
  watch: {
    currentComponent() {
      this.successComponent = this
        .currentComponent === 'BorrowInput' ? 'BorrowSuccess' : 'RepaySuccess';
    },
  },
};
</script>
