<template> 
  <v-container>
    <h1>{{title}}</h1><br><br>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logoOngames.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
    </v-row>
   </v-container>
    
</template>
<script>
export default{
    name: "homePage",
    data: () => ({ 
        title: "Bem vindo à Ongames, sua locadora digital de jogos"           
    }),
    methods: {
    }
}
</script>