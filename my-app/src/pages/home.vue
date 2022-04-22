<template> 
  <v-container>
    <h2>{{title}}</h2><br><br>
    <v-row class="logo">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logoOngames.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
    </v-row>  
    <template>
      <v-row class="jogos_disponiveis">
        <v-col cols="12"  v-for="jogo in jogos" :key="jogo.id">      
          <h3>{{jogo.titulo}}</h3>
          <img scr={jogo.imgurl}/>
          <h4>Plataforma: {{jogo.plataforma}}</h4>
          <span>Valor do aluguel = R$ {{jogo.valor}}</span> 
        </v-col>
      </v-row>
    </template>
   </v-container>
</template>
<script>
import axios from "axios";
export default ({
    name: "homePage",
    data: () => {
      return { 
        title: "Bem vindo à Ongames, sua locadora digital de jogos",
        jogos: []         
       }
    },
    methods: {
      inicializa() {
        axios("http://localhost:3000/games")
        .then((response)=> {
            this.jogos = response.data;                
        })
        .catch((error)=> console.log(error));
        console.log(this.jogos);            
      },
      created() {
        this.inicializa();
      } 
    }
})
</script>