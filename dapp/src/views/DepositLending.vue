<template>
  <div class="deposit_lending">
    <div class="d-flex justify-space-around my-3">
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Depositado</div>
            <v-list-item-title class="headline">$ {{profit}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Deuda</div>
            <v-list-item-title class="headline">$ {{profit}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Poder de deuda</div>
            <v-list-item-title class="headline">$ {{profit}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
      <v-card width="20%" class="ma-5">
        <v-list-item>
          <v-list-item-content>
            <div class="overline mb-4">Intereses generados</div>
            <v-list-item-title class="headline">$ {{profit}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </div>
    <div class="d-flex justify-center my-5">
      <v-card width="90%" class="my-auto py-auto">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="headline">Health Factor</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <div class="d-flex justify-space-around mb-4">
          <v-card class="d-flex justify-center mx-2" min-width="50"
            color="light-green" flat tile max-height="50">
            <v-card-text class="d-flex justify-center pa-1">
              0 %
            </v-card-text>
          </v-card>
          <v-progress-linear
          background-color="blue-grey lighten-5"
          color="light-green darken-4"
          height="30" stripped
          :value="100-factor">
          </v-progress-linear>
          <v-card class="d-flex justify-center mx-2" min-width="50"
            color="red lighten-1" flat tile max-height="50">
            <v-card-text class="d-flex justify-center pa-1">
              {{factor}} %
            </v-card-text>
          </v-card>
        </div>
      </v-card>
    </div>
    <div class="d-flex justify-space-around my-5">
      <v-card width="25%" outlined>
        <v-list-item three-line>
          <v-list-item-avatar tile size="80">
            <v-img :src="btc_leaf.src"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right">$ {{btc_leaf.price}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-5"></v-divider>
        <v-list class="transparent">
          <v-list-item>
            <v-list-item-title>Suministrado</v-list-item-title>
            <v-list-item-subtitle class="text-right">
              {{given}}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-divider class="mx-5"></v-divider>
        <h3 class="text-center ma-2">Tasas anuales</h3>
        <div class="d-flex justify-space-around">
          <v-card width="45%" class="ma-2">
            <v-list-item>
              <v-list-item-content>
                <div class="overline mb-4 text-center">Suministro</div>
                <v-list-item-title class="headline text-center">{{giver_rate}} %
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card width="45%" class="ma-2">
            <v-list-item>
              <v-list-item-content>
                <div class="overline mb-4 text-center">Tomador</div>
                <v-list-item-title class="headline text-center">{{taker_rate}} %
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-card>
      <v-card width="25%" outlined>
        <v-list-item three-line>
          <v-list-item-avatar tile size="80">
            <v-img :src="btc.src"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="headline mb-1 text-right">$ {{btc.price}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mx-5"></v-divider>
        <v-list class="transparent">
          <v-list-item>
            <v-list-item-title>Suministrador</v-list-item-title>
            <v-list-item-subtitle class="text-right">
              {{taken}}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-divider class="mx-5"></v-divider>
        <h3 class="text-center ma-2">Tasas anuales</h3>
        <div class="d-flex justify-space-around">
          <v-card width="45%" class="ma-2">
            <v-list-item>
              <v-list-item-content>
                <div class="overline mb-4 text-center">Suministro</div>
                <v-list-item-title class="headline text-center">{{giver_rate}} %
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card width="45%" class="ma-2">
            <v-list-item>
              <v-list-item-content>
                <div class="overline mb-4 text-center">Tomador</div>
                <v-list-item-title class="headline text-center">{{taker_rate}} %
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepositLending',
  data() {
    return {
      debt: 2000,
      profit: 50000,
      factor: 66,
      btc: {
        src: 'https://www.coinopsy.com/media/img/quality_logo/bitcoin-btc.png',
        price: 50.2,
      },
      btc_leaf: {
        src: 'https://developers.rsk.co/defi/img/btc-logo.svg',
        price: 50.2,
      },
      taker_rate: 7,
      giver_rate: 5,
      given: 30000,
      taken: 2000,
    };
  },
};
</script>
