<template>
  <v-list-item>
    <v-row class="my-3 tx-item">
      <v-col class="d-flex align-center">
        <v-list-item-avatar tile size="40">
          <v-img src="../../assets/rif.png"/>
        </v-list-item-avatar>
        <span>{{marketName}}</span>
      </v-col>
      <v-col class="d-flex align-center">
        <v-row class="d-flex justify-center">
          <span class="d-flex align-center">{{price | formatPrice}}</span>
          <p class="mt-4 mx-1 ">USD</p>
        </v-row>
      </v-col>
      <v-col class="d-flex align-center">
        <v-row class="d-flex justify-center">
          <span>{{apr | formatPercentage}}</span>
        </v-row>
      </v-col>
      <v-col class="d-flex align-center">
        <v-row class="d-flex justify-center">
          <template v-if="$options.filters
                  .formatToken(amount, decimals).toString().length > 6">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
              <span class="d-flex align-center" v-bind="attrs" v-on="on">
                {{amount | formatToken(decimals)}}
              </span>
              </template>
              <span>{{amount | fullToken(decimals)}}</span>
            </v-tooltip>
          </template>
          <template v-else>
            <span class="d-flex align-center">
                {{amount | formatToken(decimals)}}
              </span>
          </template>
          <p class="mt-4 mx-1 ">{{marketName}}</p>
          <v-list-item-avatar tile size="15">
            <v-img :src="operationLogo" ></v-img>
          </v-list-item-avatar>
        </v-row>
      </v-col>
    </v-row>
  </v-list-item>
</template>

<script>
import supplyIcon from '@/assets/myActivity/supplied.svg';
import borrowIcon from '@/assets/myActivity/borrowed.svg';
import repayIcon from '@/assets/myActivity/repay.svg';
import withdrawIcon from '@/assets/myActivity/withdrawn.svg';

export default {
  name: 'TxItem',
  props: {
    marketName: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    apr: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    operation: {
      type: String,
      required: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      operationLogo: null,
    };
  },
  created() {
    switch (this.operation) {
      case 'Borrow':
        this.operationLogo = borrowIcon;
        break;
      case 'Supply':
        this.operationLogo = supplyIcon;
        break;
      case 'Redeem':
        this.operationLogo = withdrawIcon;
        break;
      case 'PayBorrow':
        this.operationLogo = repayIcon;
        break;
      case 'LiquidateBorrow':
        this.operationLogo = null;
        break;
      default:
        this.operationLogo = null;
    }
  },
};
</script>
