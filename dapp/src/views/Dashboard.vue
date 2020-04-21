<template>
  <div class="dashboard">
    <div>
      <markets-list/>
    </div>
    <v-divider class="ma-5"></v-divider>
    <div>
      <div class="d-flex justify-center">
        <h1>Balance</h1>
      </div>
      <div class="d-flex justify-space-around">
        <v-card class="ma-5" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                0.03
              </v-list-item-title>
              <v-list-item-subtitle>
                $ 7.59
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-img :src="btc_leaf"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
        <v-card class="ma-5" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                0.03
              </v-list-item-title>
              <v-list-item-subtitle>
                $ 7.59
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-img :src="btc"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
        <v-card class="ma-5" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">
                0.03
              </v-list-item-title>
              <v-list-item-subtitle>
                $ 7.59
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="80">
              <v-img :src="rif_t"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import MarketsList from '../components/settings/MarketsList.vue';

export default {
  name: 'Dashboard',
  data() {
    return {
      assets: 2000,
      patrimony: 500,
      debt: 500,
      btc: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
      btc_leaf: 'https://developers.rsk.co/defi/img/btc-logo.svg',
      rif: 'https://developers.rsk.co/assets/img/rif/rif-logo.png',
      rif_t: 'https://assets.coingecko.com/coins/images/7460/large/RIF.png',
    };
  },
  components: {
    MarketsList,
  },
};
</script>

<style scoped>

</style>
