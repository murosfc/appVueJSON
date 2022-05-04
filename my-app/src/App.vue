<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <span id="adm" style="visibility: hidden; display:none;">
        <router-link to="/games">Games Crud</router-link> |
        <router-link to="/plataformas">Plataformas Crud</router-link> |
        <router-link to="/clientes">Clientes Crud</router-link> |
        <router-link to="/funcionarios">Funcionários Crud</router-link> |
      </span>
      <span id="login" style="visibility: visible; display:inline;">
        <a href="#" class="link-method" @click="modalShow = !modalShow">Login</a> |                
        <router-link to="/cadastrar">Cadastrar</router-link>
      </span>
      <span id="logout" style="visibility: hidden; display:none;">
        <a href="#" class="link-method" @click="logout()">Logout</a>
      </span>
    </nav>
    <router-view/>
    <div class="d-block text-right" id="logado" style="visibility: hidden; display: none">
      <p>Bem vindo(a) {{dadosLogin.nome}}<p>   
    </div>
  </div>  
</template>
<template>
  <div>
    <b-modal v-model="modalShow">
      <v-text-field
          v-model="dadosLogin.email"
          label="e-mail"
          required
          clearable                                    
      ></v-text-field>
      <v-text-field
          v-model="dadosLogin.pass"
          label="senha"
          required 
          clearable                                   
      ></v-text-field>    
    <b-button class="mt-3" variant="outline-danger" block @click="login()">Login</b-button>
    <b-button class="mt-2" variant="outline-warning" block @click="close()">Cancelar</b-button>  
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
export default ({
   name: "NavHome",
  data: () => {
      return {
        funcionarios: [],
        clientes: [],        
        login: {"funcionario": false, "cliente": false},
        modalShow: false,
        dadosLogin: {"email": "", "pass": "", "nome": "" },
        defaultDadosLogin: {"email": "", "pass": "", "nome": ""},    
      }
  },
  methods: {
    inicializa() {
        axios("http://localhost:3000/funcionarios")
        .then((response)=> {
            this.funcionarios = response.data;                   
        })                       
        .catch((error)=> console.log(error)); 
        axios("http://localhost:3000/clientes")
        .then((response)=> {
            this.funcionarios = response.data;                   
        })                       
        .catch((error)=> console.log(error));                       
    },
    login(){  
      if (isCliente){
        this.login.cliente = true;
        this.login.funcionario = false;
        modalShow=false;
        document.getElementById("logado").style.visibility = "visible";
        document.getElementById("jogos-disponiveis").style.display = "block";        
      }
      else if(isFuncionario){
        this.login.funcionario = true;
        this.login.cliente = false;        
        modalShow=false;
        document.getElementById("logado").style.visibility = "visible";
        document.getElementById("jogos-disponiveis").style.display = "block";    
      }
      else{
        alert("e-mail ou senha inválido");
      }
      this.updateLinks();        
    },
    logout(){
      this.login.funcionario = false;
      this.login.cliente = false;
      this.dadosLogin = this.defaultDadosLogin;
      this.updateLinks();
      document.getElementById("logado").style.visibility = "hidden";
      document.getElementById("jogos-disponiveis").style.display = "none";  
    },
    updateLinks(){
      if (this.login.funcionario){       
        document.getElementById("adm").style.visibility = "visible";
        document.getElementById("adm").style.display = "inline";
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.visibility = "visible";
        document.getElementById("logout").style.display = "inline";
      }
      else{        
        document.getElementById("adm").style.visibility = "hidden";
        document.getElementById("adm").style.display = "none";
        document.getElementById("login").style.visibility = "visible";
        document.getElementById("login").style.display = "inline";
        document.getElementById("logout").style.visibility = "hidden";
        document.getElementById("logout").style.display = "none";
      }      
    },
    isCliente(){
      var findCliente = this.clientes.find(c => c.email === this.dadosLogin.email);
      if (findCliente.senha === this.dadosLogin.pass){
        this.dadosLogin.nome = findCliente.nome;
        return true;
      }
      else return false;
    },
    isFuncionario(){
      var findFuncionario = this.clientes.find(f => f.email === this.dadosLogin.email);
      if (findFuncionario.senha === this.dadosLogin.pass){
        this.defaultDadosLogin.nome = findFuncionario.nome;
        return true;
      }
      else return false;
    },
    close(){
      modalShow=false;
      this.dadosLogin = this.defaultDadosLogin;
    }
  },  
  created() {
    this.inicializa();
  }  
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a, .link-method {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
