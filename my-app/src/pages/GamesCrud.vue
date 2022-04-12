<template>
    <v-container>             
        <v-row class="table-title">
            <v-col cols="12">
                <h1>{{titulo}}</h1>
            </v-col>
            <v-col>
                <v-btn
                class="mx-2"
                fab
                dark
                small
                color="indigo"
                >
                <v-icon dark>
                    mdi-plus
                </v-icon>
            </v-btn>
            </v-col>
        </v-row>
        <v-row class="table-games">
            <v-col cols="12">
                <v-data-table dense :headers="headers" :items="jogos" item-key="id" class="elevation-1">
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
            headers: [
                {text: "Id", value: "id"},
                {text: "Título", value: "titulo"},
                {text: "Plataforma", value: "plataforma"},
                {text: "Valor", value: "valor"},
                {text: "Imagem", value: "imgurl"},
                {text: "Editar"}
            ],
            jogos: []            
        }           
    },
    methods: {
        inicializa() {
            axios("http://localhost:3000/games")
            .then((response)=> {
                this.jogos = response.data;
                console.log(this.jogos);
            })
            .catch((error)=> console.log(error));
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
