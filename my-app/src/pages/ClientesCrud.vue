<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-clientes">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="clientes" item-key="id" class="elevation-1">                          
                 ##Formulario
                <template v-slot:top>
                    <v-toolbar flat>
                    <v-toolbar-title>Clientes cadastrados</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>                    
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="700px" max-length="500px">
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                            class="mx-2"
                            fab
                            dark
                            small
                            color="indigo"
                            v-bind="attrs"
                            v-on="on"
                        >
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                        </v-btn>
                        </template>
                        <v-card>
                        <v-card-title>
                            <span class="headline">Adicionar/Editar Clientes</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="2">
                                <v-text-field
                                    v-model="editedItem.id"
                                    label="Id"                                    
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="8">
                                <v-text-field
                                    v-model="editedItem.cpf"
                                    label="CPF"
                                ></v-text-field>
                                <v-text-field
                                    v-model="editedItem.nome"
                                    label="Nome"
                                ></v-text-field>
                                </v-col>                                
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.email"
                                    label="Email"
                                ></v-text-field>                               
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.senha"
                                    label="Senha"                                    
                                ></v-text-field>                                                                                                
                                </v-col>
                                 <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.cep"
                                    label="CEP"
                                ></v-text-field>
                                <v-text-field
                                    v-model="editedItem.numero"
                                    label="Número"
                                ></v-text-field>
                                <v-text-field
                                    v-model="editedItem.complemento"
                                    label="Complemento"
                                ></v-text-field>
                                </v-col>                                
                            </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                            Cancelar
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                            Salvar
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>
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
    name: "ClienteCrud",
    data: () => {
        return {
            titulo: "Edição de banco de dados de clientes",            
            dialog: false,
            headers: [
                {text: "Id", value: "id"},
                {text: "CPF", value: "cpf"},
                {text: "Nome", value: "nome"},
                {text: "e-mail", value: "email"},
                {text: "Senha", value: "senha"},
                {text: "CEP", value: "cep"},
                {text: "Número", value: "numero"},
                {text: "Complemento", value: "complemento"},

                {text: "Ações", value: "actions", sortable: false }                
            ],
            clientes: [],                       
            editedItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            defaultItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            editedIndex: -1,           
        }           
    },
    methods: {
        inicializa() {            
            axios("http://localhost:3000/clientes")
            .then((response)=> {
                this.clientes = response.data;                             
            })                       
            .catch((error)=> console.log(error));             
        },
        close(){
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;                
            }, 300);
        },
        save() {
            if (this.editedIndex > -1) {
                //alteracao
                axios
                .put(
                    "http://localhost:3000/clientes/" + this.editedItem.id,
                    this.editedItem
                )
                .then((response) => {
                    console.log(response);
                    Object.assign(this.clientes[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            } else {
                //Inclusao
                this.editedItem.senha = this.senhaInicial();
                axios
                .post("http://localhost:3000/clientes", this.editedItem)
                .then((response) => {
                    console.log(response);
                    this.clientes.push(this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            }         
        },
        editItem(item) {
        this.editedIndex = this.clientes.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
        },
        deleteItem(item) {
        const index = this.clientes.indexOf(item);
        confirm("Deseja apagar este item de id ?" + item.id) &&
            axios
            .delete("http://localhost:3000/clientes/" + item.id)
            .then((response) => {
                console.log(response.data);
                this.clientes.splice(index, 1);                
            })
            .catch((error) => console.log(error));
        } ,
        senhaInicial() {
            var tamanho = 8;
            var stringAleatoria = '';
            var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$&?[]{}()';
            for (var i = 0; i < tamanho; i++) {
                stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return stringAleatoria;
        },
        limpar(){
            this.editedItem.urlimg = "";
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
