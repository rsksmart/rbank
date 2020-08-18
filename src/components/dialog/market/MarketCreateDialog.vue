<template>
  <v-dialog v-model="data.flag" width="650">
    <v-card class="marketDialog container">
      <div v-show="!waiting">
        <market-create-top :success="succeed"/>
        <component :is="currentComponent" :marketAddress="marketAddress"
                   @created="actionSucceed" @wait="waiting = true" @close="closeDialog"/>
      </div>
      <div v-show="waiting">
        <loader v-show="waiting"/>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import MarketCreateTop from '@/components/dialog/market/MarketCreateTop.vue';
import MarketCreateInput from '@/components/dialog/market/MarketCreateInput.vue';
import MarketCreateSuccess from '@/components/dialog/market/MarketCreateSuccess.vue';
import Loader from '@/components/common/Loader.vue';

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
      succeed: false,
      waiting: false,
      marketAddress: null,
      currentComponent: 'MarketCreateInput',
    };
  },
  methods: {
    actionSucceed(succeedObject) {
      this.waiting = false;
      this.marketAddress = succeedObject.marketAddress;
      this.currentComponent = 'MarketCreateSuccess';
      this.succeed = true;
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
  },
  components: {
    MarketCreateTop,
    MarketCreateInput,
    MarketCreateSuccess,
    Loader,
  },
};
</script>
