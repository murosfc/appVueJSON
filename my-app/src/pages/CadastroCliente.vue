<template>    
  <v-card flat>
    <v-snackbar v-model="snackbar" absolute top right color="success">
      <span>Registration successful!</span>
      <v-icon dark> mdi-checkbox-marked-circle </v-icon>
    </v-snackbar>
    <h2>{{title}}</h2>
    <v-form ref="form" @submit.prevent="submit">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.nome"
              label="Nome completo"
              :rules="rules.naoVazio"             
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
             v-model="editedItem.cpf"
              label="CPF"
              :rules="rules.naoVazio">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.email"
              label="e-mail"
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              type="password"
              v-model="editedItem.senha"
              label="Senha"
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              type="password"
              v-model="senhaVerificar"
              label="Repita a senha"
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              v-model="editedItem.cep"
              label="CEP"
              v-on:blur="getEnderecoCorreio(editedItem.cep)"
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="enderecoCorreios.logradouro"
              label="Rua"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-text-field
              v-model="editedItem.numero"
              label="Número"
              :rules="rules.naoVazio"
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
              disabled
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="enderecoCorreios.localidade"
              label="Cidade"
              disabled
              :rules="rules.naoVazio"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="1">
            <v-text-field
              v-model="enderecoCorreios.uf"
              label="UF"
              disabled
              :rules="rules.naoVazio"
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
      emailVerificar: "",
      editedIndex: -1,
      enderecoCorreios: [],
      rules: {
        naoVazio: [(val) => (val || "").length > 0 || "This field is required"],
        
      },
    };
  },
  methods: {
    carregaClientesCadastrados() {
      axios("http://localhost:3000/clientes")
        .then((response) => {
          this.clientes = response.data;
        })
        .catch((error) => console.log(error));
      return this.clientes.lenght;
    },
    getEnderecoCorreio(cep) {
      var url = "https://viacep.com.br/ws/" + cep + "/json/";
      axios(url)
        .then((response) => {
          this.enderecoCorreios = response.data;
        })
        .catch((error) => console.log(error));
    },
    close() {
      this.dialog = true;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    submit() {
      var novaId = this.carregaClientesCadastrados() + 1;
      var cpfExiste = this.clientes.find(c => c.cpf === editedItem.cpf);
      var emailExiste = this.clientes.find(c => c.email === editedItem.email);
      if (cpfExiste.length > 0){
        alert("CPF já cadastrado");
      }
      else if (emailExiste.length > 0 ){
        alert("e-mail já cadastrado");
      }
      else{       
        this.editedItem.id = novaId;
        if (this.editedIndex > -1) {
          this.editedItem.senha = this.senhaInicial();
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
      }
    },
    limpar() {
      this.editedItem = this.defaultItem;
    },
  },
};
</script>

