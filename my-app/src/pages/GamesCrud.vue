<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-games">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="jogos" item-key="id" class="elevation-1">  
                <template #[`item.urlimg`]="{ value }">
                    <a :href="value">
                        link
                    </a>
                </template>                 
                 ##Formulario
                <template v-slot:top>
                    <v-toolbar flat>
                    <v-toolbar-title>Jogos cadastrados</v-toolbar-title>
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
                            <span class="headline">Adicionar/Editar Jogo</span>
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
                                    v-model="editedItem.titulo"
                                    label="Título"
                                ></v-text-field>
                                </v-col>                                
                                <v-col cols="12" sm="6" md="4">
                                <v-combobox 
                                    v-model="editedItem.plataforma"
                                    label="Plataforma"
                                    :items="plataformas">                                   
                                </v-combobox>                               
                                </v-col>
                                <v-col cols="12" sm="6" md="12">
                                <v-text-field
                                    v-model="editedItem.urlimg"
                                    label="URL da imagem"
                                    clearable
                                ></v-text-field>                                                                                                
                                </v-col>
                                 <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="editedItem.valor"
                                    label="Valor do aluguel"
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
    name: "GamesCrud",
    data: () => {
        return {
            titulo: "Edição de banco de dados de jogos",
            search: "",
            dialog: false,
            headers: [
                {text: "Id", value: "id"},
                {text: "Título", value: "titulo"},
                {text: "Plataforma", value: "plataforma"},
                {text: "Valor", value: "valor"},
                {text: "Imagem", value: "urlimg"},
                { text: "Actions", value: "actions", sortable: false }                
            ],
            jogos: [],                       
            editedItem: {id: "", titulo: "", plataforma: "", urlimg: "", valor: 20},
            defaultItem: {id: "", titulo: "", plataforma: "", urlimg: "", valor: 20},
            editedIndex: -1,
            plataformas: []
        }           
    },
    methods: {
        inicializa() {
            axios("http://localhost:3000/games")
            .then((response)=> {
                this.jogos = response.data;                
            })                       
            .catch((error)=> console.log(error));
            axios("http://localhost:3000/plataformas")
            .then((response)=> {
                this.plataformas = response.data; 
                console.log(this.plataformas)               
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
                    "http://localhost:3000/games/" + this.editedItem.id,
                    this.editedItem
                )
                .then((response) => {
                    console.log(response);
                    Object.assign(this.jogos[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            } else {
                //Inclusao
                axios
                .post("http://localhost:3000/jogos", this.editedItem)
                .then((response) => {
                    console.log(response);
                    this.jogos.push(this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            }         
        },
        editItem(item) {
        this.editedIndex = this.jogos.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
        },
        deleteItem(item) {
        const index = this.jogos.indexOf(item);
        confirm("Deseja apagar este item?") &&
            axios
            .delete("http://localhost:3000/games/" + item.id)
            .then((response) => {
                console.log(response.data);
                this.games.splice(index, 1);                
            })
            .catch((error) => console.log(error));
        } ,
        limpar(){
            this.editedItem.urlimg = "";
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
</style>
