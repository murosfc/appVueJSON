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
      <div class="flex-container">
        <div v-for="jogo in jogos" :key="jogo.id" class="flex-item">             
          <h3>{{jogo.titulo}}</h3>
          <img :src="jogo.urlimg" class="game-pic"/>
          <h4>Plataforma: {{jogo.plataforma}}</h4>
          <span>Valor do aluguel = R$ {{jogo.valor}}</span> 
        </div>
      </div>
    </template>  
  </v-container> 
</template>

<script>
import axios from "axios";
require('@/assets/styles/estilo.css')
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
      },
    },
    created() {
      this.inicializa();
    }    
})
</script>
