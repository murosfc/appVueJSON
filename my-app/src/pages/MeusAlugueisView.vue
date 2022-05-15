<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-alugueis">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="alugueis" item-key="id" class="elevation-1" @click:row="showAluguel">
                
                    <template v-slot:[`item.valorTotal`]="{ item }">
                                {{ (item.valorTotal).toFixed(2) }}
                    </template> 
                    
                    <template v-slot:top>
                        <v-toolbar flat>
                        <v-toolbar-title>Meus Alugueis</v-toolbar-title>                                     
                        <v-spacer></v-spacer>
                        </v-toolbar>
                    </template>                           
                          
                </v-data-table>                              
            </v-col>
        </v-row>
        <router-view/>    
        <v-row justify="center" data-app>
            <v-dialog v-model="modalShow" max-width="700px" max-length="500px">
                <v-card>
                <v-card-title>
                    <span class="headline">Dados do aluguel</span>
                </v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <h4>Pedido número: {{aluguel.id}}</h4>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field
                            v-model="aluguel.cliente"
                            label="Cliente" 
                            disabled                                                        
                            >
                            </v-text-field>                                                                                                
                        </v-col> 
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field                        
                            v-model="aluguel.funcionario"
                            label="Funcionario"
                            disabled                                         
                            >
                            </v-text-field>                                                                                                
                        </v-col>                         
                    </v-row>
                    <v-row>
                        <v-data-table dense :headers="headerJogos" :items="jogoInThisAluguel" item-key="id" class="elevation-1"> 
                        <template v-slot:[`item.index`]="{ index }">
                            {{ index + 1 }}
                        </template>
                        <template v-slot:[`item.valor`]="{ item }">
                            {{ (item.valor).toFixed(2) }}
                        </template>                                                                      
                        </v-data-table>
                        
                    </v-row>                            
                    <v-row>
                        <v-col cols="12" sm="6" md="12">
                            <h4>Valor total do pedido: R$ {{valotTotalAluguel.toFixed(2)}}</h4>
                        </v-col>
                    </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close()">
                        Fechar
                    </v-btn>                   
                </v-card-actions>
                </v-card>
            </v-dialog> 
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
export default ({
    name: "MeusAlugueisView",
    data: () => {
        return {
            titulo: "Meus alugueis",            
            dialog: false,
            headers: [
                {text: "Número do pedido", value: "id"},                             
                {text: "Data de início do aluguel", value: "dataInicioAluguel"},
                {text: "Data de fim do aluguel", value: "dataFimAluguel"},                
                {text: "Valor aluguel", value: "valorTotal"},
            ],
            headerJogos: [
                {text: "Item", value: "index"}, 
                {text: "Jogo", value: "titulo"},                             
                {text: "Plataforma", value: "plataforma"},
                {text: "Valor", value: "valor"},               
            ],
            alugueis: [],
            todosAlugueis: [],
            funcionarios: [],
            clientes: [],
            jogoInAluguel: [],
            jogoInThisAluguel: [],
            games:[],
            modalShow: false,
            aluguel: {"id": 0, "cliente": "", "funcionario": ""},
            valotTotalAluguel: 0             
        }           
    },
    methods: {
        showAluguel(item){  
            this.aluguel.id = item.id;                   
            var cli = this.clientes.find(c => c.id == item.id_cliente);                   
            this.aluguel.cliente = cli.email;                   
            var func = this.funcionarios.find(f => f.id == item.id_funcionario);           
            this.aluguel.funcionario = func.email; 
            this.valotTotalAluguel = 0.00;                      
           
            for (var i=0; i<this.jogoInAluguel.length; i++){                
                var game = this.games.find(g => g.id == this.jogoInAluguel[i].jogo_id && this.jogoInAluguel[i].aluguel_id == item.id);
                if (game != null){
                    this.jogoInThisAluguel.push(Object.assign({}, game)); 
                    this.valotTotalAluguel = parseFloat(this.valotTotalAluguel) + parseFloat(game.valor);                    
                }                            
            } 
            this.modalShow = true;
        },
        close(){
            this. jogoInThisAluguel = [];
            this.valotTotalAluguel = 0;   
            this.modalShow = false;
        },
        inicializa() {
            axios("http://localhost:3000/alugueis")
            .then((response)=> {
                this.todosAlugueis = response.data;                             
            })                       
            .catch((error)=> console.log(error)); 
            axios("http://localhost:3000/games")
            .then((response)=> {
                this.games = response.data;                             
            })                       
            .catch((error)=> console.log(error)); 
            axios("http://localhost:3000/clientes")
            .then((response)=> {
                this.clientes = response.data;                             
            })                       
            .catch((error)=> console.log(error)); 
            axios("http://localhost:3000/funcionarios")
            .then((response)=> {
                this.funcionarios = response.data;                             
            })                       
            .catch((error)=> console.log(error)); 
            axios("http://localhost:3000/jogoInAluguel")
            .then((response)=> {
                this.jogoInAluguel = response.data;                             
            })                       
            .catch((error)=> console.log(error));

             if (this.$parent.session.funcionario){
                axios.get('http://localhost:3000/alugueis', {
                params: {
                    id_funcionario: this.$parent.dadosLogin.id                    
                }
                })
                .then((response) => {                    
                    this.alugueis = response.data;
                })                       
                .catch((error)=> console.log(error)); 
            }

            if (this.$parent.session.cliente){                
                axios.get('http://localhost:3000/alugueis', {
                params: {                   
                    id_cliente: this.$parent.dadosLogin.id
                }
                })
                .then((response) => {                    
                    this.alugueis = response.data;
                })                       
                .catch((error)=> console.log(error));             
            }            
        }            
    },
    created() {
        this.inicializa();
    }
})
</script>
<style scoped>
    .table-title{        
        color: rgb(57, 57, 201);
        text-align: center;
   }   
   .col{
        flex-grow: 0;
        margin-left: auto;
        margin-right: 0;
   } 
    .hover_img a { position:relative;}
    .hover_img a span { position:relative; display:none; z-index:99; }
    .hover_img a:hover span { display:block; }   
</style>
