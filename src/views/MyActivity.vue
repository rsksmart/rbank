<template>
  <div>
    <v-row>
      <v-col>
        <v-row>
          <h1> Investment Dashboard</h1>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-col cols="8">
                <v-row></v-row>
                <v-row></v-row>
                <v-row></v-row>
              </v-col>
              <v-col></v-col>
            </v-card>
          </v-col>
          <v-col>
            <v-row>
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
          </v-col>
        </v-row>
        <v-row></v-row>
      </v-col>
    </v-row>
    <v-row></v-row>
  </div>
</template>

<script>
export default {
  name: 'MyActivity',
};
</script>
