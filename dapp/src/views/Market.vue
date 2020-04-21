<template>
  <div>
    <h1>Market {{id}}</h1>
    <v-container fluid>
      <v-row>
        <h2>Market price</h2>
      </v-row>
      <v-form ref="form" :lazy-validation="true">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="price"
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Controller from '@/handlers/controller';

export default {
  name: 'Market',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      controller: null,
      price: null,
    };
  },
  computed: {
    ...mapState({
      from: (state) => ({ from: state.Session.account }),
    }),
  },
  methods: {
    setPrice() {
      this.controller.setPrice(this.from, this.id, this.price);
    },
  },
  created() {
    this.controller = new Controller();
    this.controller.getPrice(this.id)
      .then((price) => {
        this.price = price;
      });
  },
};
</script>
