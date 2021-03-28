<template>
  <div>
    <v-row  v-for="n in 8" :key="n" class="align-center justify-center">
      <v-col cols="9">
        <v-skeleton-loader
          :boilerplate="false"
          :elevation="0"
          type="list-item-two-line"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="3">
        <v-skeleton-loader
          width="18px"
          height="20px"
          :boilerplate="false"
          :elevation="0"
          type="image"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- <v-skeleton-loader
      class="mb-2"
      :boilerplate="false"
      :elevation="0"
      type="list-item-avatar-two-line"
    ></v-skeleton-loader> -->

  </div>
</template>
