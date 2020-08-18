<template>
  <div class="mx-6 landing container">
    <v-row class="mx-6 my-6 d-flex align-center">
      <v-col class="mx-6">
        <v-row>
          <h1> Join the Open Finance revolution on the RSK Network</h1>
        </v-row>
        <v-row class="my-3 simple-text">
          Enjoy the possibilities that Open Finance offers in a safe, clear and understandable way.
        </v-row>
        <v-row class="d-flex flex-row">
          <v-btn class="button" rounded color="#008CFF" @click="toMyActivity">
            Go to RBank Ðapp</v-btn>
        </v-row>
      </v-col>
      <v-col class="d-flex justify-center">
        <img class="landing-1" src="../assets/landing/Ellipse_20.png" alt="">
      </v-col>
    </v-row>
    <v-row class="my-6 py-6 d-flex justify-center">
      <div class="divider my-6"></div>
    </v-row>
    <v-row class="mx-6 my-6 d-flex align-center">
      <v-col class="d-flex justify-center">
        <img src="../assets/landing/stats_and_graphs.png" alt="">
      </v-col>
      <v-col>
        <v-row class="text-right">
          <h3> Experience the basics of lending and borrowing assets</h3>
        </v-row>
        <v-row class=" my-6 text-right simple-text-2">
          explore what you can do with your crypto assets and be part of the change to a more
          financially inclusive world
        </v-row>
        <v-row class="d-flex flex-row-reverse">
          <v-btn class="button" rounded color="#008CFF" @click="toMyActivity">
           Explore the RBank Ðapp
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="my-6 py-6 d-flex justify-center">
      <div class="divider my-6"></div>
    </v-row>
    <v-row class="mx-6 py-4">
      <v-col>
        <v-row class="d-flex justify-center">
          <h2>As easy as 1, 2, 3.</h2>
        </v-row>
        <v-row class="my-6 simple-text-2 d-flex justify-center">
          Connect your wallet and start earning money in a few steps.
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mx-6 my-6 text-center">
      <v-col>
        <v-row class="d-flex justify-center mx-6">
          <h4>1. Connect</h4>
        </v-row>
        <v-row class="d-flex justify-center mx-6">
          We support Metamask and Nifty Wallet. More soon to come!
        </v-row>
      </v-col>
      <v-col>
        <v-row class="d-flex justify-center mx-6">
          <h4>2. Supply and Borrow</h4>
        </v-row>
        <v-row class="d-flex justify-center mx-6">
          Use our simple interphase to supply or borrow from markets in a few clicks.
        </v-row>
      </v-col>
      <v-col>
        <v-row class="d-flex justify-center mx-6">
          <h4>3. Earn</h4>
        </v-row>
        <v-row class="d-flex justify-center mx-6">
          We support Metamask and Nifty Wallet. More soon to come!
        </v-row>
      </v-col>
    </v-row>
    <v-row class="my-6 py-6 d-flex justify-center">
      <div class="divider my-6"></div>
    </v-row>
    <v-row class="mx-6 my-6">
      <v-col>
        <v-row class="d-flex justify-center">
          <h2>Say goodbye to unexpected collateral liquidations.</h2>
        </v-row>
        <v-row class="my-4 d-flex justify-center">Introducing your Health Factor,
          a way for you to keep an eye on the state of your loans.
        </v-row>
        <v-row class="my-6 py-6 d-flex justify-center">
          <v-card class="health-card">
            <v-row>
              <v-col class="mx-3 px-6">
                <v-row class="health-card-title">
                  Health Factor:
                </v-row>
                <v-row>
                  <div class="divider-card"></div>
                </v-row>
                <v-row class="health-card-text">
                  Your Account has a low risk of liquidation
                </v-row>
              </v-col>
              <v-col class="d-flex justify-center">
                <v-progress-circular
                  :rotate="270"
                  :size="100"
                  :width="15"
                  :value="95"
                  color="#6FCF97"
                >
                  <span>95%</span>
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-card>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-btn class="button" rounded color="#008CFF" @click="toMyActivity">
            join Rbank Today
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="my-6 py-6 d-flex justify-center">
      <div class="divider my-6"></div>
    </v-row>
    <v-row class="mx-6 my-6 d-flex align-center">
      <v-col class="px-4">
        <v-row class="text-left">
          <h3>Build your own DeFi App with our RBank Library for Developers</h3>
        </v-row>
        <v-row class="my-6 text-left">
          We have created a comprehensible library for the upcoming DeFi Developer.
          Available on GitHub.
        </v-row>
        <v-row>
          <v-btn class="button" rounded color="#008CFF" @click="toMyActivity">
            View RBank Library
          </v-btn>
        </v-row>
      </v-col>
      <v-col class="d-flex justify-center">
        <img src="../assets/landing/Ellipse_29.png" alt="">
      </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  name: 'Landing',
  methods: {
    toMyActivity() {
      this.$router.push({ name: 'MyActivity' });
    },
  },
};
</script>
