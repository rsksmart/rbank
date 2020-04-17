<template>
  <div class="MarketsList">
    <h2>Current Markets</h2>
    <v-card
      class="mx-auto"
      max-width="50%"
      tile
    >
      <v-list
        nav
      >
        <template v-for="(market, idx) in markets">
          <v-list-item
            :key="`market-${idx}`"
            @click="setMarket(market)"
          >
            <v-list-item-content>
              <v-list-item-action>
                <v-icon>local_convenience_store</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                {{market}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import * as constants from '@/store/constants';

export default {
  name: 'MarketsList',
  computed: {
    ...mapState({
      markets: (state) => state.Controller.markets,
    }),
  },
  methods: {
    ...mapActions({
      loadMarkets: constants.CONTROLLER_LOAD_MARKETS,
    }),
    ...mapMutations({
      setProperty: constants.MARKET_SET_PROPERTY,
    }),
    setMarket(marketAddress) {
      this.setProperty({ marketAddress });
      this.$router.push({
        name: 'Market',
        params: { id: marketAddress },
      });
    },
  },
  created() {
    this.loadMarkets();
  },
};
</script>
