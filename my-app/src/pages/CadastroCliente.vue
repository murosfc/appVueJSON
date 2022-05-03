<template>
    <v-container>             
        <v-row class="table-title" data-app>
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>      
        </v-row>
        <v-row class="table-clientes">
            <v-col cols="12">                                         
                 ##Formulario
                <template v-slot:top>                    
                    <v-dialog v-model="dialog" max-width="500px">
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
                            <span class="headline">Cadastrar</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="8">
                                <v-text-field
                                    v-model="editedItem.nome"
                                    label="Nome completo"                                    
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="editedItem.cpf"
                                    label="CPF"
                                ></v-text-field>
                                </v-col> 
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="editedItem.email"
                                    label="e-mail"
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    type="password"  
                                    v-model="editedItem.senha"
                                    label="Senha"
                                ></v-text-field>                                                                                                
                                </v-col> 
                                <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    type="password"
                                    v-model="senhaVerificar"
                                    label="Repita a senha"
                                ></v-text-field>
                                </v-col>                                                                     
                                <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="editedItem.cep"
                                    label="CEP"
                                ></v-text-field>
                                </v-col> 
                                ##Endereço preenchido correios
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="enderecoCorreios.logradouro"
                                    label="Rua"
                                    disabled
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    v-model="enderecoCorreios.bairro"
                                    label="Bairro"
                                    disabled
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                <v-text-field
                                    v-model="enderecoCorreios.localidade"
                                    label="Cidade"
                                    disabled
                                ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="2">
                                <v-text-field
                                    v-model="enderecoCorreios.uf"
                                    label="UF"
                                    disabled
                                ></v-text-field>
                                </v-col>
                                ##Fim endereço preenchido correios
                                <v-col cols="12" sm="6" md="2">
                                <v-text-field
                                    v-model="editedItem.numero"
                                    label="Número"
                                ></v-text-field>
                                </v-col> 
                                <v-col cols="12" sm="6" md="4">
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
                            Cadastrar
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-dialog>                    
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
            titulo: "Preencha os dados para realizar seu cadastro",            
            dialog: false,           
            clientes: [],                       
            editedItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            defaultItem: {id: "", cpf: "", nome: "", email: "", senha: "", cep: "", numero:"", complemeto:""},
            emailVerificar: "",
            editedIndex: -1, 
            enderecoCorreios: [],          
        }           
    },
    methods: {
        carregaClientesCadastrados() {              
            axios("http://localhost:3000/clientes")
            .then((response)=> {
                this.clientes = response.data;                             
            })                       
            .catch((error)=> console.log(error));  
            return this.clientes.lenght;           
        },
         getEnderecoCorreio(cep) { 
            var url = "https://viacep.com.br/ws/"+cep+"/json/"           
            axios(url)
            .then((response)=> {
                this.enderecoCorreios = response.data;                             
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
            var novaId = carregaClientesCadastrados() + 1;
            this.editedItem.id = novaId;
            if (this.editedIndex > -1) {               
            this.editedItem.senha = this.senhaInicial();
            axios
            .post("http://localhost:3000/clientes", this.editedItem)
            .then((response) => {
                console.log(response);                
                this.close();
                alert ("cadastrado com sucesso");
                window.open("/home");
            })
            .catch((error) => console.log(error));
            }         
        },        
        limpar(){
            this.editedItem = this.defaultItem;
        },              
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
