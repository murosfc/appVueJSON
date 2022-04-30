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
          class="btn btn-primary" @click="verSairCarrinho()">
          <v-icon>mdi-cart</v-icon>{{cart.length}}</button>
      </div>    
    </v-row>     
    <template>
      <div class="flex-container" id="jogos-disponiveis" style="visibility: visible; display: block;">
        <div v-for="jogo in jogos" :key="jogo.id" class="flex-item">             
          <h3>{{jogo.titulo}}</h3>
          <img :src="jogo.urlimg" class="game-pic"/>
          <h4>Plataforma: {{jogo.plataforma}}</h4>
          <span>Valor do aluguel = R$ {{jogo.valor}}   </span>
          <span>
            <v-btn @click="addCart(jogo)" 
            :disabled= "checkIfInCart(jogo.id)" 
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
     <template>
      <h2 id="carrinho-vazio" style="visibility: hidden; display: none;">Carrinho vazio</h2>
      <div class="flex-container" id="carrinho-cliente" style="visibility: hidden; display: none;">
         <v-row>
            <v-col cols="12">
              <v-data-table dense :headers="headers" :items="cart" item-key="id" class="elevation-1">  
                <template #[`item.urlimg`]="{ value }">                                     
                    <img :src="value" alt="imagem do jogo" height="100"/>           
                </template>
                <template v-slot:[`item.tipo_id`]="{ item }">
                    {{ descricao(item.tipo_id) }}
                </template>
                <template v-slot:[`item.actions`]="{ item }">                    
                    <v-icon small @click="removerCarrinho(item)">
                        mdi-delete 
                    </v-icon>
                </template> 
              </v-data-table>
            </v-col>
          </v-row>
          <v-row>
            <div id="btns-checkout">
              <strong>Total do carrinho R$  {{updateTotal().toFixed(2)}}</strong>  
            </div>
          </v-row>          
          <v-row>
            <div id="btns-checkout">
              <v-btn>
                Alugar 
              </v-btn>            
              <v-btn @click="verSairCarrinho()">
                Voltar
              </v-btn>
            </div>
          </v-row> 
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
        headers: [                
          {text: "Título", value: "titulo"},
          {text: "Plataforma", value: "plataforma"},
          {text: "Imagem", value: "urlimg"},
          {text: "Valor", value: "valor"},
          {text: "Ações", value: "actions", sortable: false }                                
        ],
        jogos: [],
        cart: [],               
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
      addCart(jogo){         
        this.cart.push(Object.assign({}, jogo));          
      },
      verSairCarrinho(){
        if (document.getElementById("jogos-disponiveis").style.visibility == "visible"){
          document.getElementById("jogos-disponiveis").style.visibility = "hidden";
          document.getElementById("jogos-disponiveis").style.display = "none";          
          document.getElementById("carrinho-cliente").style.visibility = "visible";
          document.getElementById("carrinho-cliente").style.display = "block";
        }
        else {
          document.getElementById("jogos-disponiveis").style.visibility = "visible";
          document.getElementById("jogos-disponiveis").style.display = "block";
          document.getElementById("carrinho-cliente").style.visibility = "hidden";
          document.getElementById("carrinho-cliente").style.display = "none";  
        }
        if (this.cart.length == 0)
        {
          document.getElementById("carrinho-vazio").style.visibility = "visible";
          document.getElementById("carrinho-vazio").style.display = "block";
        }
        else{
          document.getElementById("carrinho-vazio").style.visibility = "hidden";
          document.getElementById("carrinho-vazio").style.display = "none";
        }
      }, 
      updateTotal(){
        var total = 0;
        for (var i=0;i<this.cart.length;i++){
          total=total + parseFloat(this.cart[i].valor);
        }
        return total;
      },
      removerCarrinho(item){
        var index = this.cart.indexOf(item);
        this.cart.splice(index, 1);                       
      },
      checkIfInCart(id){
        for (var i=0;i<this.cart.length;i++){
          if(this.cart[i].id == id){            
            return true;            
          }
        } 
        return false;          
      }
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
   #btns-checkout{
     margin-right: 0;
     margin-left: auto;
     margin-bottom: 20px;
   }      
</style>