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
    <v-row>
      <div class="cart">
      <label>Carrinho: </label>
      <button 
        type="button"
        class="btn btn-primary" @click="verCarrinho()">
        <v-icon>mdi-cart</v-icon>{{cart.length}}</button>
      </div>    
    </v-row>  
    <template>
      <div class="flex-container">
        <div v-for="jogo in jogos" :key="jogo.id" class="flex-item">             
          <h3>{{jogo.titulo}}</h3>
          <img :src="jogo.urlimg" class="game-pic"/>
          <h4>Plataforma: {{jogo.plataforma}}</h4>
          <span>Valor do aluguel = R$ {{jogo.valor}}   </span>
          <span>
            <v-btn @click="addCart(jogo)" 
            :disabled="clicked[jogo.id].status"
            class="add-cart"
            icon              
            color="red"                                
            >
            <v-icon>mdi-cart-arrow-down</v-icon>
          </v-btn>
          </span>            
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
        jogos: [],
        cart: [], 
        clicked: [
          {
            "id": 0,
            "status": false
          }
        ],        
       }
    },
    methods: {
      inicializa() {
        axios("http://localhost:3000/games")
        .then((response)=> {
            this.jogos = response.data;            
            for (var i=0;i<this.jogos.length;i++){
              const obj = [];
              obj['id']= i;
              obj['status'] = false;
              this.clicked.push(obj);
            }                
        })                       
        .catch((error)=> console.log(error));                        
      },
      addCart(jogo){    
        this.clicked[jogo.id].status = true;
        this.cart.push(Object.assign({}, jogo));          
      },
      verCarrinho(){
        //adicionar método
      },
    },    
    created() {
      this.inicializa();
    }    
})
</script>
<style scoped>
   .cart{
     margin-right: 0;
     margin-left: auto;
     margin-bottom: 20px;
   }   
</style>