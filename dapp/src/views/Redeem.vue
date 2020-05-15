<template>
  <div class="Redeem">
    <redeem-list :redeemList="testList"/>
  </div>
</template>

<script>
import RedeemList from '@/components/redeem/RedeemList.vue';

export default {
  name: 'Redeem',
  data() {
    return {
      testList: [
        {
          icon: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
          address: '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
          quantity: 0.25,
        },
        {
          icon: 'https://developers.rsk.co/defi/img/btc-logo.svg',
          address: '0x58Be343B94f860124dC4fEe278FDCBD38C102D89',
          quantity: 3,
        },
      ],
    };
  },
  components: {
    RedeemList,
  },
};
</script>
