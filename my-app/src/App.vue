<template>
  <div id="app">     
    <nav>
      <router-link to="/">Home</router-link> |
      <span id="adm" style="visibility: hidden; display:none;">
        <router-link to="/games">Games Crud</router-link> |
        <router-link to="/plataformas">Plataformas Crud</router-link> |
        <router-link to="/clientes">Clientes Crud</router-link> |
        <router-link to="/funcionarios">Funcionários Crud</router-link> |
        <router-link to="/alugueis">Alugueis</router-link> |               
      </span>
      <span id="login" style="visibility: visible; display:inline;">
        <a href="#" class="link-method" @click="modalShow = !modalShow">Login</a> |                
        <router-link to="/cadastrar">Cadastrar</router-link>
      </span>
      <span id="logout" style="visibility: hidden; display:none;"> 
        <router-link to="/meusalugueis">Meus Alugueis</router-link> |       
        <a href="#" class="link-method" @click="logout()">Logout</a>
      </span>
    </nav>   
    <div class="d-block text-right" id="logado" style="visibility: hidden; display: none">
      <p>Bem vindo(a) {{dadosLogin.nome}}</p>   
    </div>   

    <router-view/>    
    <v-row justify="center" data-app>
          <v-dialog v-model="modalShow" max-width="700px" max-length="500px">
            <v-card>
            <v-card-title>
                <span class="headline">Acesso ao sistema</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="acesso.email"
                      label="e-mail"                                                          
                    >
                    </v-text-field>                                                                                                
                  </v-col> 
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      type="password"
                      v-model="acesso.senha"
                      label="Senha"                                    
                    >
                    </v-text-field>                                                                                                
                  </v-col>                         
                </v-row>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()">
                Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="login()">
                Entrar
                </v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog> 
    </v-row>
  </div>  
</template>


<script>
import axios from "axios";
export default ({
   name: "NavHome",
  data: () => {
      return {
        acesso: {senha:'', email:''},        
        modalShow: false,
        funcionarios: [],
        clientes: [],        
        session: {"funcionario": false, "cliente": false},        
        dadosLogin: {"id": 0, "email": "", "nome": "" },
        defaultDadosLogin: {"id": 0, "email": "", "nome": ""},    
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
            this.clientes = response.data;                   
        })                       
        .catch((error)=> console.log(error));                       
    },
    isCliente(){
      var findCliente = this.clientes.find(c => c.email === this.acesso.email);      
      if (typeof findCliente === 'undefined'){        
        return false;
      }
      else if (findCliente.senha === this.acesso.senha){          
        this.session.funcionario = false;
        this.session.cliente = true;
        this.dadosLogin.id = findCliente.id;
        this.dadosLogin.nome = findCliente.nome;          
        this.dadosLogin.email = findCliente.email;
        return true;
      }
      return false;
    },
    isFuncionario(){
      var findFuncionario = this.funcionarios.find(f => f.email === this.acesso.email);                
      if (typeof findFuncionario === 'undefined'){
        return false;
      }
      else if (findFuncionario.senha === this.acesso.senha){          
        this.session.cliente = false;
        this.session.funcionario = true;
        this.dadosLogin.id = findFuncionario.id;
        this.dadosLogin.nome = findFuncionario.nome;
        this.dadosLogin.email = findFuncionario.email;          
        return true;
      }       
      return false;
    },
    login(){  
      if (this.isCliente()){               
        document.getElementById("logado").style.visibility = "visible";
        document.getElementById("logado").style.display = "block";
        this.modalShow = !this.modalShow;
        this.updateLinks();        
      }
      else if(this.isFuncionario()){             
        document.getElementById("logado").style.visibility = "visible";
        document.getElementById("logado").style.display = "block";
        this.modalShow = !this.modalShow;
        this.updateLinks();            
      }
      else{
        alert("e-mail ou senha inválido");
      }                   
    },
    logout(){
      window.open("/", '_blank');
      this.session.funcionario = false;
      this.session.cliente = false;
      this.dadosLogin = this.defaultDadosLogin;      
      this.updateLinks();
      document.getElementById("logado").style.visibility = "hidden";
      document.getElementById("logado").style.display = "none";      
      document.getElementById("jogos-disponiveis").style.display = "none";       
    },
    updateLinks(){     
      if (this.session.funcionario){
        document.getElementById("adm").style.visibility = "visible";
        document.getElementById("adm").style.display = "inline";
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.visibility = "visible";
        document.getElementById("logout").style.display = "inline";           
      }
      else {        
        document.getElementById("adm").style.visibility = "hidden";
        document.getElementById("adm").style.display = "none";
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("login").style.display = "none";
        document.getElementById("logout").style.visibility = "visible";
        document.getElementById("logout").style.display = "inline";   
      }      
    },    
    close(){
      this.modalShow=false;
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
