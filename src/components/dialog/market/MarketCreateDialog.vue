<template>
  <v-dialog v-model="flag" width="650" :persistent="waiting || succeed">
    <v-card class="container" v-click-outside="onClickOutside">
      <div v-show="!waiting && !errorDialog" class="marketDialog">
        <market-create-top :success="succeed"/>
        <component :is="currentComponent" :marketAddress="marketAddress" @error="actionError"
                   @created="actionSucceed" @wait="waiting = true" @close="closeDialog"/>
      </div>
      <div class="dialog" v-show="waiting">
        <loader class="my-15" v-show="waiting"/>
      </div>
      <template v-if="errorDialog">
        <error-dialog @closeDialog="closeDialog"/>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import MarketCreateTop from '@/components/dialog/market/MarketCreateTop.vue';
import MarketCreateInput from '@/components/dialog/market/MarketCreateInput.vue';
import MarketCreateSuccess from '@/components/dialog/market/MarketCreateSuccess.vue';
import Loader from '@/components/common/Loader.vue';
import ErrorDialog from '@/components/dialog/ErrorDialog.vue';

export default {
  name: 'MarketCreateDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: this.data.flag,
      succeed: false,
      waiting: false,
      marketAddress: null,
      currentComponent: 'MarketCreateInput',
      errorDialog: null,
    };
  },
  methods: {
    actionError() {
      this.waiting = false;
      this.succeed = false;
      this.errorDialog = true;
    },
    actionSucceed(succeedObject) {
      this.waiting = false;
      this.errorDialog = false;
      this.marketAddress = succeedObject.marketAddress;
      this.currentComponent = 'MarketCreateSuccess';
      this.succeed = true;
    },
    onClickOutside() {
      if (!this.waiting && !this.succeed) {
        this.flag = false;
        this.$emit('closed');
      }
    },
    closeDialog() {
      this.flag = false;
      this.$emit('closed');
    },
  },
  components: {
    MarketCreateTop,
    MarketCreateInput,
    MarketCreateSuccess,
    Loader,
    ErrorDialog,
  },
};
</script>
