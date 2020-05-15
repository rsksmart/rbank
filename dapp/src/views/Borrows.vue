<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
          <v-row>
            <v-col cols="2">
              Assets
            </v-col>
            <v-col cols="4">
              Available for you
            </v-col>
            <v-col cols="4">
              APR%
            </v-col>
            <v-col cols="2">
              Action
            </v-col>
          </v-row>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col cols="12">
        <v-card elevation="12">
          <v-row>
            <v-col cols="2">
              <v-img
                :src="require('../assets/r_bank.jpg')"
                class="my-3"
                contain
                height="50"
              />
            </v-col>
            <v-col cols="4">
              $2500
            </v-col>
            <v-col cols="4">
              7%
            </v-col>
            <v-col cols="2">
              <v-btn>
                Borrow
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Borrows',
};
</script>

<style scoped>

</style>
