<template>    
  <v-card flat>    
    <h2>{{titulo}}</h2><br><br>
    <v-form ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.nome"
              label="Nome completo"
              :rules="rules.naoVazio" 
              required            
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
             v-model="editedItem.cpf"
              label="CPF"
              :rules="rules.cpf"
              required >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.email"
              label="e-mail"
              :rules="rules.email"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              type="password"
              v-model="editedItem.senha"
              label="Senha"
              :rules="rules.password"
              required              
            ></v-text-field>
          </v-col>         
          <v-col cols="12" sm="2">
            <v-text-field
              type="password"
              v-model="senhaVerificar"
              label="Repita a senha"
              :rules="rules.confirmPassword"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.cep"
              label="CEP"
              v-on:blur="getEnderecoCorreio(editedItem.cep)"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="enderecoCorreios.logradouro"
              label="Rua"
              :disabled="cepNaoEcontrado"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-text-field
              v-model="editedItem.numero"
              label="Número"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.complemento"
              label="Complemento"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="enderecoCorreios.bairro"
              label="Bairro"
              :disabled="cepNaoEcontrado"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="enderecoCorreios.localidade"
              label="Cidade"
              :disabled="cepNaoEcontrado"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-text-field
              v-model="enderecoCorreios.uf"
              label="UF"
              :disabled="cepNaoEcontrado"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
        <v-btn text @click="limpar"> Cancelar </v-btn>

        <v-btn :disabled="!formIsValid" text color="primary" type="submit">
          Registrar
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  name: "ClienteCrud",
  data: () => {
    return {
      titulo: "Preencha os dados para realizar seu cadastro",
      clientes: [],
      editedItem: {
        id: "",
        cpf: "",
        nome: "",
        email: "",
        senha: "",
        cep: "",
        numero: "",
        complemento: "",
      },
      defaultItem: {
        id: "",
        cpf: "",
        nome: "",
        email: "",
        senha: "",
        cep: "",
        numero: "",
        complemento: "",
      },
      cepNaoEcontrado: true,
      senhaVerificar: "",      
      enderecoCorreios: [],
      rules: {
        naoVazio: [(val) => (val || "").length > 0 || "Preenchimento obrigatório"], 
        cpf: [[(val) => (val || "").length > 0 || "Preenchimento obrigatório"], v => /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}?[0-9]{2})$/.test(v) || 'CPF inválido'], 
        emailRules: [[(val) => (val || "").length > 0 || "Preenchimento obrigatório"], v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail inválido'],
        password: [(val) => (val || "").length > 5 || 'Senha precisa ter no mínimo 6 caracteres'], 
        confirmPassword: [[v => !!v || "Obrigatório confirmar senha"], v => !v == this.editedItem.senha || 'As senhas precisam ser iguais'],
      },
    };
  }, 
  computed: {
    formIsValid () {
      return (
        this.editedItem.cpf &&
        this.editedItem.nome &&
        this.editedItem.email &&
        this.editedItem.senha &&
        this.senhaVerificar &&
        this.editedItem.cep &&
        this.editedItem.numero
      )},
  },
  methods: {
    carregaClientesCadastrados() {
      axios("http://localhost:3000/clientes")
        .then((response) => {
          this.clientes = response.data;
        })
        .catch((error) => console.log(error));      
    },
    getEnderecoCorreio(cep) {
      var url = "https://viacep.com.br/ws/" + cep + "/json/";
      axios(url)
        .then((response) => {
          this.enderecoCorreios = response.data;
        })
        .catch((error) => console.log(error));
        if (Object.keys(this.enderecoCorreios).length === 0){
          this.cepNaoEcontrado = false;
        }
        else {
          this.cepNaoEcontrado = true;
        }
    },
    close() {
      this.dialog = true;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    submit() {
      this.carregaClientesCadastrados();      
      var cpfExiste = this.clientes.find(c => c.cpf === this.editedItem.cpf);
      var emailExiste = this.clientes.find(c => c.email === this.editedItem.email);      
      if (cpfExiste != null){
        alert("CPF já cadastrado");
      }
      else if (emailExiste != null ){
        alert("e-mail já cadastrado");
      }      
      else{                     
        this.editedItem.id = null;        
        axios
          .post("http://localhost:3000/clientes", this.editedItem)
          .then((response) => {
            this.editedItem = response.data;
            this.close();
            alert("cadastrado com sucesso");
            window.open("/");
          })
          .catch((error) => console.log(error));        
      }
    },
    limpar() {
      this.editedItem = this.defaultItem;
    },    
  },
};
</script>

