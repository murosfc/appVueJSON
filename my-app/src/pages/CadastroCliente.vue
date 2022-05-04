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
              :rules="rules.naoVazio"
              required >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.email"
              label="e-mail"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              type="password"
              v-model="editedItem.senha"
              label="Senha"
              :rules="rules.naoVazio"
              required 
            ></v-text-field>
          </v-col>
          <span id="regra-senha"><small>O password precisa conter:
            mínimo 6 e máximo 20 caracteres, pelo menos uma letra maiúscula, uma letra minúscula e um caractere especial.</small></span>
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
        complemeto: "",
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
        emailRules: [v => !!v || 'Preenchimento obrigatório',
          v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail inválido'],
        confirmPassword: [[[v => !!v || "Obrigatório confirmar senha"],
        (this.editedItem.senha === this.senhaVerificar) || 'As senhas precisam ser iguais'], 
        v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,20}$/.test(v) || 'e-mail precisa serguir as regras de seguraça'],
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
      return this.clientes.length;
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
      this.carregaClientesCadastrados()
      var novaId =  0;
      var cpfExiste = this.clientes.find(c => c.cpf === this.editedItem.cpf);
      var emailExiste = this.clientes.find(c => c.email === this.editedItem.email);      
      if (cpfExiste != null){
        alert("CPF já cadastrado");
      }
      else if (emailExiste != null ){
        alert("e-mail já cadastrado");
      }      
      else{
        while (novaId < this.clientes.length){
          novaId++;
        }             
        this.editedItem.id = novaId;
        console.log(this.editedItem);
        axios
          .post("http://localhost:3000/clientes", this.editedItem)
          .then((response) => {
            console.log(response);
            this.close();
            alert("cadastrado com sucesso");
            window.open("/home");
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

