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
        <a href="#" class="link-method" @click="login()">Login</a> |        
        <router-link to="/cadastra">Cadastrar</router-link>
      </span>
      <span id="logout" style="visibility: hidden; display:none;">
        <a href="#" class="link-method" @click="logout()">Logout</a>
      </span>
    </nav>
    <router-view/>
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
        isAdm: false,
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
      this.isAdm = !this.isAdm;  
      this.updateLinks();      
    },
    logout(){
      this.isAdm = false;
      this.updateLinks();
    },
    updateLinks(){
      if (this.isAdm){       
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
