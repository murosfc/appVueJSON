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
          <span>Valor do aluguel = R$ {{jogo.valor.toFixed(2)}}   </span>
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
      <div class="flex-container" id="carrinho-cliente" style="visibility: hidden; display: none;">
      <h2 id="carrinho-vazio" style="visibility: hidden; display: none;">Carrinho vazio</h2>
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
              <v-btn @click="alugar()">
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
        title: "Ongames, sua locadora digital de jogos",
        headers: [                
          {text: "Título", value: "titulo"},
          {text: "Plataforma", value: "plataforma"},
          {text: "Imagem", value: "urlimg"},
          {text: "Valor", value: "valor"},
          {text: "Ações", value: "actions", sortable: false }                                
        ],
        jogos: [],
        cart: [], 
        alugueis: [], 
        funcionarios: []                    
       }
    },
    methods: {
      inicializa() {
        axios("http://localhost:3000/games")
        .then((response)=> {
            this.jogos = response.data;                   
        })                       
        .catch((error)=> console.log(error)); 
        axios("http://localhost:3000/alugueis")
            .then((response)=> {
                this.alugueis = response.data;                                         
            })                       
            .catch((error)=> console.log(error)); 
        axios("http://localhost:3000/funcionarios")
          .then((response)=> {
            this.funcionarios = response.data;
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
      },       
      defineFuncionario(){
        var selectFunc = [];        
        var idFunc = 1;                              
        for (var i=0; i < this.funcionarios.length;i++){
          var countAlugueis = 0;
          for (var j=0; j< this.alugueis.length; j++){
            if(this.funcionarios[i].id == this.alugueis[j].id_funcionario){
              countAlugueis++;
            }
          }
          selectFunc.push({"id": parseInt(this.funcionarios[i].id), "qtAlugueis": parseInt(countAlugueis)});
        }  
        var menor = 10000000;        
        for (i=0; i < selectFunc.length; i++){
          if(selectFunc[i].qtAlugueis < menor){
            idFunc = selectFunc[i].id;
            menor = selectFunc[i].qtAlugueis;
          }          
        }
        return idFunc;     
      },      
      alugar(){
        if(!this.$parent.session.cliente){
          if(this.$parent.session.funcionario){
            alert("Apenas clientes podem alugar jogos");
          }
          this.$parent.modalShow = !this.$parent.modalShow;
        }
        else{                  
          axios("http://localhost:3000/alugueis")
            .then((response)=> {
                this.alugueis = response.data;                                         
            })                       
            .catch((error)=> console.log(error));                          
          var id_cliente = this.$parent.dadosLogin.id;
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //janeiro é 0
          var yyyy = today.getFullYear();
          var dataInicioAluguel = dd + '/' + mm + '/' + yyyy;        
          var nextWeek = new Date();
          nextWeek.setDate(today.getDate() +7 );
          dd = String(nextWeek.getDate()).padStart(2, '0');
          mm = String(nextWeek.getMonth() + 1).padStart(2, '0'); //janeiro é 0
          yyyy = nextWeek.getFullYear();
          var dataFimAluguel = dd + '/' + mm + '/' + yyyy;             
          var id_funcionario = this.defineFuncionario(); 
          var valorTotal = this.updateTotal(); 
          var novoAluguel = {"id": null, "id_cliente": id_cliente, "dataInicioAluguel": dataInicioAluguel, "dataFimAluguel": dataFimAluguel,"id_funcionario": id_funcionario, "valorTotal": valorTotal};        
          
          axios
            .post("http://localhost:3000/alugueis", novoAluguel)
            .then((response) => {
              for(var i=0;i<this.cart.length;i++){                
                var novoJogoInAluguel = {"aluguel_id": parseInt(response.data.id), "jogo_id": parseInt(this.cart[i].id)} ;
                axios
                .post("http://localhost:3000/jogoInAluguel", novoJogoInAluguel)
                .then((response) => {
                    console.log(response);          
                })
                .catch((error) => console.log(error));
              }    
              alert ("Novo aluguel registrado com sucesso.\nVálido até "+novoAluguel.dataFimAluguel);
              this.cart = [];                                    
            })
            .catch((error) => console.log(error));          
        }
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
   #btns-checkout{
     margin-right: 0;
     margin-left: auto;
     margin-bottom: 20px;
   }      
</style>