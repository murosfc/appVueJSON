<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-funcionarios">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="funcionarios" item-key="id" class="elevation-1">                          
                 ##Formulario
                <template v-slot:top>
                    <v-toolbar flat>
                    <v-toolbar-title>Funcionários cadastrados</v-toolbar-title>
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
                            <span class="headline">Adicionar/Editar Funcionários</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="2">
                                <v-text-field
                                    v-model="editedItem.id"
                                    label="Id" 
                                    disabled                                   
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="8">
                                <v-text-field
                                    v-model="editedItem.nome"
                                    label="Nome"
                                ></v-text-field>
                                </v-col>                                
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.nick"
                                    label="Nickname"
                                ></v-text-field>                               
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.whatsapp"
                                    label="Whatsapp"                                    
                                ></v-text-field>                                                                                                
                                </v-col>
                                 <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.email"
                                    label="e-mail"
                                ></v-text-field>
                                </v-col>                                
                            </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                            Cancel
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                            Save
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
    name: "FuncionariosCrud",
    data: () => {
        return {
            titulo: "Edição de banco de dados de funcionários",            
            dialog: false,
            headers: [
                {text: "Id", value: "id"},
                {text: "Nome", value: "nome"},
                {text: "Nick", value: "nick"},
                {text: "Whatasapp", value: "whatsapp"},
                {text: "e-mail", value: "email"},
                {text: "Ações", value: "actions", sortable: false }                
            ],
            funcionarios: [],                       
            editedItem: {id: "", nome: "", nick: "", whatsapp: "(22)9970-00", email: "@ongames.com"},
            defaultItem: {id: "", nome: "", nick: "", whatsapp: "(22)9970-00", email: "@ongames.com"},
            editedIndex: -1,
            alugueis: [],           
        }           
    },
    methods: {
        inicializa() {            
            axios("http://localhost:3000/funcionarios")
            .then((response)=> {
                this.funcionarios = response.data;                             
            })                       
            .catch((error)=> console.log(error)); 
            axios("http://localhost:3000/alugueis")
            .then((response)=> {
                this.alugueis = response.data;                             
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
                    "http://localhost:3000/funcionarios/" + this.editedItem.id,
                    this.editedItem
                )
                .then((response) => {
                    this.editedItem = response.data;
                    Object.assign(this.funcionarios[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            } else {
                //Inclusao
                this.editedItem.id=null;
                this.editedItem.senha = this.senhaInicial();
                axios
                .post("http://localhost:3000/funcionarios", this.editedItem)
                .then((response) => {
                    console.log(response.data);
                    this.inicializa();
                    this.close();
                })
                .catch((error) => console.log(error));
            }         
        },
        editItem(item) {
        this.editedIndex = this.funcionarios.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
        },
        deleteItem(item) {        
        var temAluguel = this.alugueis.find( a => a.id_funcionario == item.id);
        if (temAluguel != null){
            alert("Este funcioário possui aluguel registrado e não pode ser excluído!");
        }
        else{            
            confirm("Deseja apagar este item de id ?" + item.id) &&
                axios
                .delete("http://localhost:3000/funcionarios/" + item.id)
                .then((response) => {
                    console.log(response.data);
                    this.inicializa();                
                })
                .catch((error) => console.log(error));
        }
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
