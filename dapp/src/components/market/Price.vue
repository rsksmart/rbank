<template>
  <v-container fluid>
    <v-row class="d-flex flex-column">
      <h2>Market price</h2>
      <a>{{ marketAddress }}</a>
    </v-row>
    <v-form ref="form" :lazy-validation="true">
      <v-row>
        <v-col cols="12">
          <v-text-field
            :value="price"
            @input="marketPrice = $event"
            label="Market Price"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          class="success"
          @click="setPrice">
          Set Price
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';

export default {
  name: 'Price',
  data() {
    return {
      marketPrice: null,
    };
  },
  props: {
    marketAddress: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  methods: {
    setPrice() {
      this.controller.setPrice(this.account, this.marketAddress, this.marketPrice)
        .then(() => {
          this.$router.push({
            name: 'Settings',
          });
        });
    },
  },
  computed: {
    ...mapState({
      account: (state) => state.Session.account,
    }),
  },
  created() {
    this.controller = new Controller();
  },
};
</script>
