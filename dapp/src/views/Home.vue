<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/r_bank.jpg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col class="mb-4">
        <v-card class="mx-auto"
                color="#385F73"
                dark
                max-width="600">
          <v-card-text class="headline font-weight-bold">
            Descentralized Finance for Bitcoiners.
            <br>
            The most secure and trustable blockchain in the world now available for loans and
            borrowing.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-12 mb-12">
        <v-card class="mx-auto"
                max-width="600">
          <v-card-text class="headline font-weight-bold text-center">
            Con R bank, puedes obtener obtener rendimiento de tu dinero, de una forma
            descentralizada.
          </v-card-text>
          <v-card-text class="text-center">
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="mb-5" cols="12">
        <v-row class="mb-3" justify="center">
          <v-col class="mx-8" cols="5">
            <v-img
              :src="require('../assets/s1.jpg')"
              class="my-3"
              contain
              height="200"
            />
            <div class="px-12 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </v-col>
          <v-col class="mx-8" cols="5">
            <v-img
              :src="require('../assets/s2.jpg')"
              class="my-3"
              contain
              height="200"
            />
            <div class="px-12 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </v-col>
          <v-col class="mx-8" cols="5">
            <v-img
              :src="require('../assets/s3.jpg')"
              class="my-3"
              contain
              height="200"
            />
            <div class="px-12 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </v-col>
          <v-col class="mx-8" cols="5">
            <v-img
              :src="require('../assets/s4.jpg')"
              class="my-3"
              contain
              height="200"
            />
            <div class="px-12 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  name: 'Home',
};
</script>
