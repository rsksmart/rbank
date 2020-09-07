<template>
  <v-dialog v-model="flag" width="350" :persistent="waiting || success">
    <v-card class="dialog container" v-click-outside="onClickOutside">
      <template v-if="!waiting && !success && !error">
        <div>
          <v-row class="mt-2 d-flex align-center">
            <v-col cols="3" class="ml-2 d-flex justify-end">
              <v-img class="ml-5" src="../../../assets/rif.png" contain height="70"/>
            </v-col>
            <v-col cols="3" class="d-flex justify-center">
              <h1 class="ma-0">{{ data.token.symbol }}</h1>
            </v-col>
            <v-col/>
            <v-col cols="3" class="mr-5">
              <v-row>
                <h2>price:</h2>
              </v-row>
              <v-row class="item d-flex justify-start">
                <span>{{ price | formatPrice }}</span><span class="ml-2 itemInfo">usd</span>
              </v-row>
            </v-col>
          </v-row>
        </div>
        <div class="marketDialog">
          <v-row class="mx-5">
            <h3>Input new price:</h3>
          </v-row>
          <v-row class="mx-5">
            <v-text-field class="bigger-data-input" full-width single-line solo flat
                          type="number" v-model="newPrice" required
                          :rules="[rules.required, rules.integer]"/>
          </v-row>
          <v-row class="mb-1 d-flex justify-center">
            <v-btn class="button" color="#008CFF" :disabled="!validForm" @click="setPrice">
              Modify market price
            </v-btn>
          </v-row>
        </div>
      </template>
      <template v-else>
        <error-dialog v-if="error" @closeDialog="closeMarketPrice"/>
        <loader v-if="waiting"/>
        <market-price-success v-if="success" :price="newPrice" @closed="closeMarketPrice"/>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import Loader from '@/components/common/Loader.vue';
import MarketPriceSuccess from '@/components/dialog/market/MarketPriceSuccess.vue';
import ErrorDialog from '@/components/dialog/ErrorDialog.vue';

export default {
  name: 'MarketPriceDialog',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: this.data.flag,
      waiting: false,
      success: false,
      price: 0,
      newPrice: 0,
      error: false,
      rules: {
        required: () => !!Number(this.newPrice) || 'Required.',
        integer: () => !this.newPrice.toString().includes('.') || 'Not decimal positions allowed.',
      },
    };
  },
  computed: {
    validForm() {
      return typeof this.rules.required() !== 'string'
        && typeof this.rules.integer() !== 'string';
    },
  },
  methods: {
    onClickOutside() {
      if (!this.waiting && !this.success) {
        this.flag = false;
        this.$emit('closed');
      }
    },
    closeMarketPrice() {
      this.flag = false;
      this.$emit('closed');
    },
    setPrice() {
      this.waiting = true;
      this.$rbank.controller.setMarketPrice(this.data.market.address, this.newPrice)
        .then(() => {
          this.waiting = false;
          this.success = true;
          this.$emit('priceSet');
        })
        .catch(() => {
          this.waiting = false;
          this.success = false;
          this.error = true;
        });
    },
  },
  components: {
    Loader,
    MarketPriceSuccess,
    ErrorDialog,
  },
  created() {
    this.$rbank.controller.eventualMarketPrice(this.data.market.address)
      .then((marketPrice) => {
        this.price = marketPrice;
      });
  },
};
</script>
