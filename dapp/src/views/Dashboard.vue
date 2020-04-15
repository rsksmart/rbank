<template>
  <div class="dashboard">
    <div>
      <div class="d-flex justify-end">
        <v-btn class="ma-5" outlined>Connect wallet</v-btn>
      </div>
      <div class="d-flex justify-center">
<!--<v-data-table :headers="['Bienes','Patrimonio','Deuda']" :items="['$ 2.000','$ 500','$']"-->
<!--:items-per-page="5" class="elevation-1"></v-data-table>-->
        <v-simple-table class="ma-8">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">Bienes</th>
                <th class="text-left">Patrimonio</th>
                <th class="text-left">Deuda</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${{ assets }}</td>
                <td>${{ patrimony }}</td>
                <td>${{ debt }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
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
};
</script>

<style scoped>

</style>
