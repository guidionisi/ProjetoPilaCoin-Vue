const vm = new Vue({
  el: "#app",
  data: {
    isNone: false, //estado do modal isNotActiva=true adiciona a classe none que remove o modal de login
    comprarAtivo: true,
    idAtivo: null,
    cotacao: null,
    bcPila: null,
    bcReal: null,
    nome: null,
    usuarios: null,
    email: "gui@mail.com",
    senha: "1234",
  },
  filters: {
    formataCotacao(valor) {
      if (valor) return "R$ " + valor.toFixed(3).toString().replace(".", ",");
    },
    formataReal(valor) {
      if (valor) return "R$ " + valor.toFixed(2).toString().replace(".", ",");
      else return "R$ 0,00";
    },
    formataPila(valor) {
      if (valor) return "PL$ " + valor.toFixed(2).toString().replace(".", ",");
      else return "PL$ 0,00";
    },
  },
  computed: {},
  methods: {
    async getBlockchain() {
      const req = await fetch("http://localhost:3000/blockchain");
      const data = await req.json();
      //pega o último item da array blockchain
      this.cotacao = data[data.length - 1].cotacao;
      this.bcPila = data[data.length - 1].pila;
      this.bcReal = data[data.length - 1].real;
      // console.log(data);
    },
    async getUsuarios() {
      const req = await fetch("http://localhost:3000/usuarios");
      const data = await req.json();
      this.usuarios = data;
    },
    async setBlockchain() {
      console.log("BLOCKCHIAN ATUALIZADA");

      const data = {
        cotacao: this.cotacao,
        pila: this.bcPila,
        real: this.bcReal,
        dataHora: new Date(),
      };
      const dataJson = JSON.stringify(data); //transforma o objeto JS em texto Json
      const req = await fetch("http://localhost:3000/blockchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataJson,
      });
      // const res = await req.json(); //espera a resposta do após feito o fetch
    },
    async setUsuario(id) {
      console.log("USUÁRIO ATUALIZADO");
      const dadosAtualizados = {
        pila: this.usuarios[id].pila,
        real: this.usuarios[id].real,
      };
      const dataJson = JSON.stringify(dadosAtualizados); //transforma o objeto JS em texto Json
      const req = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: dataJson,
      });
      // const res = await req.json(); //espera a resposta do após feito o fetch
      // console.log(res);
    },
    inativar(e) {
      const itemClicado = e.target.classList.value;
      const tituloComprar = document.querySelector(".titulo-comprar");
      const tituloVender = document.querySelector(".titulo-vender");

      if (itemClicado === "titulo-comprar") {
        this.comprarAtivo = true;
        tituloComprar.style.opacity = "1";
        tituloVender.style.opacity = "0.3";
      } else {
        this.comprarAtivo = false;
        tituloComprar.style.opacity = "0.3";
        tituloVender.style.opacity = "1";
      }
    },
    login(event) {
      event.preventDefault();
      console.log("LOGIN");

      console.log(this.email, this.senha);

      this.usuarios.forEach((u) => {
        if (this.email === u.email && this.senha === u.senha) {
          window.localStorage.idUsuarioAtivo = JSON.stringify(u.id); //cria a chave idUsuarioAtivo no localStorage
          this.idAtivo = u.id;
          this.isNone = true;
          console.log(
            `Usuário ${u.email} (${this.email}) logado com sucesso! Id: ${this.idAtivo}`
          );
        } else {
          console.log("Falha ao fazer login. Usuário: ", u.email);
        }
      });
      return false;
    },
    logout() {
      console.log("SAIR/LOGOUT");
      localStorage.removeItem("noneClass");
      localStorage.removeItem("idUsuarioAtivo");
      this.isNone = false;
      console.log(this.isNone);
    },
    comprar(event) {
      event.preventDefault();
      console.log("COMPRAR");
      const pilasComprados = parseFloat(
        document.querySelector("#comprarAtivo").value
      );
      const cotacao = this.cotacao;
      const valorDisponivel = this.usuarios[this.idAtivo].real;
      const total = pilasComprados * cotacao;

      if (total <= valorDisponivel) {
        // console.log("Antes da compra: R$", this.usuarios[this.idAtivo].real);
        this.usuarios[this.idAtivo].real -= total;
        this.usuarios[this.idAtivo].pila += pilasComprados;
        // console.log("Total comprado R$", total);
        // console.log("Depois da compra: R$", this.usuarios[this.idAtivo].real);

        //atualizar blockchain e calcular nova cotacao
        this.bcPila -= pilasComprados;
        this.bcReal += total;
        this.cotacao =
          this.cotacao + this.cotacao * (pilasComprados / this.bcPila);
        // console.log(this.bcPila, this.bcReal, this.cotacao);

        //atualiza a blockchain e os dados monetários do usuário
        this.setBlockchain();
        this.setUsuario(this.idAtivo);
        this.addNoneKey();
      } else {
        console.log("Valor em caixa indiponível.");
      }
    },
    vender(event) {
      console.log("VENDER");
      event.preventDefault();
      const pilasVendidos = parseFloat(
        document.querySelector("#venderAtivo").value
      );
      const cotacao = this.cotacao;
      const valorDisponivel = this.usuarios[this.idAtivo].pila;
      const total = pilasVendidos * cotacao;

      if (pilasVendidos <= valorDisponivel) {
        // console.log("Antes da venda:PL$", valorDisponivel);
        this.usuarios[this.idAtivo].real += total;
        this.usuarios[this.idAtivo].pila -= pilasVendidos;
        // console.log("Total vendido R$", total);
        // console.log("Depois da venda: PL$", this.usuarios[this.idAtivo].pila);

        //atualizar blockchain e calcular nova cotacao
        this.bcPila += pilasVendidos;
        this.bcReal -= total;
        this.cotacao =
          this.cotacao - this.cotacao * (pilasVendidos / this.bcPila);
        // console.log(this.bcPila, this.bcReal, this.cotacao);

        //atualiza a blockchain e os dados monetários do usuário
        this.setBlockchain();
        this.setUsuario(this.idAtivo);
        this.addNoneKey();
      } else {
        console.log("Valor em caixa indiponível.");
      }
    },
    addNoneKey() {
      window.localStorage.noneClass = JSON.stringify(true); //cria a chave none no localStorage
    },
    checarUsuarioAtivo() {
      const id = window.localStorage.idUsuarioAtivo;
      if (id) {
        this.idAtivo = id;
      } else {
        console.log("É PRECISO FAZER LOGIN");
        this.idAtivo = 0;
      }
    },
    checarNone() {
      const isNone = window.localStorage.noneClass;
      console.log("#######", isNone);
      if (isNone) {
        this.isNone = isNone;
      }
    },
  },
  watch: {},
  created() {
    this.checarUsuarioAtivo();
    this.getUsuarios();
    this.getBlockchain();
    this.checarNone();
  },
});
