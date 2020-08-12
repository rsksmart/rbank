<template>
  <div class="admin">
    <v-row class="d-flex justify-center">
      <h1>Add, Edit and Manage your markets</h1>
    </v-row>
    <div class="d-flex justify-center">
      <v-card flat width="950" class="list">
        <v-row class="ma-0 d-flex justify-space-between">
          <v-col>
            <v-row>
              <h2>My Markets</h2>
            </v-row>
            <v-row>
              <p>Last updated: 09/07/2020 16:44 GMT-5</p>
            </v-row>
          </v-col>
          <v-col>
            <v-row class="d-flex align-center justify-end">
              <h3>Add new Market</h3>
              <v-btn class="ml-5" fab dark small color="#008CFF">
                <v-icon>add</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <market-list/>
      </v-card>
    </div>
  </div>
</template>

<script>
import MarketList from '@/components/admin/MarketList.vue';

export default {
  name: 'Admin',
  components: {
    MarketList,
  },
};
</script>
