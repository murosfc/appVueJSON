<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-plat">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="plataformas" item-key="id" class="elevation-1">                               
                    ##Formulario
                    <template v-slot:top>
                        <v-toolbar flat>
                        <v-toolbar-title>Plataformas cadastradas</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-divider class="mx-4" inset vertical></v-divider>            
                        <v-dialog v-model="dialog" max-width="300px" max-length="50px">
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
                                <span class="headline">Adicionar/Editar Plataforma</span>
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
                                        label="Plataforma"                                    
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
    name: "PlataformasCrud",
    data: () => {
        return {
            titulo: "Edição de plataformas",
            search: "",
            dialog: false,
            headers: [                
                {text: "Id", value: "id"},
                {text: "Plataforma", value: "nome"},
                {text: "Ações", value: "actions", sortable: false }                                
            ],
            plataformas: [],                    
            editedItem: {id: "", nome: ""},
            defaultItem: {id: "", nome: ""},
            editedIndex: -1,                     
        }           
    },
    methods: {
        inicializa() {   
            axios("http://localhost:3000/plataformas")
            .then((response)=> {
                this.plataformas = response.data;                             
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
                    "http://localhost:3000/plataformas/" + this.editedItem.id,
                    this.editedItem
                )
                .then((response) => { 
                    this.editedItem = response.data;                   
                    Object.assign(this.plataformas[this.editedIndex], this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            } else {
                //Inclusao
                this.editedItem.id=null;
                axios
                .post("http://localhost:3000/plataformas", this.editedItem)
                .then((response) => {
                    this.editedItem = response.data;                   
                    this.plataformas.push(this.editedItem);
                    this.close();
                })
                .catch((error) => console.log(error));
            }         
        },
        editItem(item) {
        this.editedIndex = this.plataformas.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
        },
        deleteItem(item) {
        const index = this.plataformas.indexOf(item);            
        confirm("Deseja apagar o item de id "+  item.id +"?") &&
            axios
            .delete("http://localhost:3000/plataformas/" + item.id)
            .then((response) => {
                console.log(response);                
                this.plataformas.splice(index, 1);                
            })
            .catch((error) => console.log(error));
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
