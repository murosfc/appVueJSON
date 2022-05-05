<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-clientes">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="alugueis" item-key="id" class="elevation-1">                          
                 ##Formulario
                <template v-slot:top>
                    <v-toolbar flat>
                    <v-toolbar-title>Clientes cadastrados</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>                    
                    <v-spacer></v-spacer>
                    </v-toolbar>
                </template>
                ##Fim Form 
                <template v-slot:[`item.tipo_id`]="{ item }">
                    {{ descricao(item.tipo_id) }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small @click="deleteItem(item)">
                        mdi-delete 
                    </v-icon>
                </template>          
                </v-data-table>                              
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
export default ({
    name: "AlugueisView",
    data: () => {
        return {
            titulo: "Exibição dos alugueis",            
            dialog: false,
            headers: [
                {text: "Id", value: "id"},
                {text: "Id do cliente", value: "id_cliente"},                
                {text: "Data de início do aluguel", value: "dataInicioAluguel"},
                {text: "Data de fim do aluguel", value: "dataFimAluguel"},
                {text: "Id do funcionário", value: "id_funcionario"},
            ],
            alugueis: [],                       
            editedItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            defaultItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            editedIndex: -1,           
        }           
    },
    methods: {
        inicializa() {            
            axios("http://localhost:3000/alugueis")
            .then((response)=> {
                this.alugueis = response.data;                             
            })                       
            .catch((error)=> console.log(error));             
        }, 
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
