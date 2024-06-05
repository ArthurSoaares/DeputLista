function buscarEnderecoPorCEP(cep) {
    cep = cep.replace(/\D/g, '');
  
    if (cep.length !== 8) {
      alert("CEP inválido!");
      return;
    }
  
    const url = `https://viacep.com.br/ws/${cep}/json/`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          alert("CEP não encontrado!");
        } else {
          document.getElementById('cidade').value = data.localidade;
          document.getElementById('bairro').value = data.bairro;
          document.getElementById('rua').value = data.logradouro;
          document.getElementById('uf').value = data.uf;
        }
      })
      .catch(error => {
        console.error("Erro ao buscar CEP:", error);
        alert("Ocorreu um erro ao buscar o CEP.");
      });
  }
  
  document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault();
  const cepInput = document.getElementById('cep').value;
  buscarEnderecoPorCEP(cepInput);
  });
  document.getElementById('submitButton').addEventListener('click', createUser);

function createUser() {
    const nome = document.getElementById('nome-deputado').value;
    const sexo = document.getElementById('sexo-deputado').value;
    const partido = document.getElementById('partido-deputado').value;
    const email = document.getElementById('email-gabinete').value;
    const cep = document.getElementById('cep').value;
    const cidade = document.getElementById('cidade').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const latitude = document.getElementById('latitude').value; 
    const longitude = document.getElementById('longitude').value;
    
    

    if (nome.trim() === '') { 
        Swal.fire('Por favor, insira um nome!');
        return;
    }

    const Deputados = {
        nome: nome,
        sexo: sexo,
        partido: partido,
        email: email,
        cep: cep,
        cidade: cidade,
        bairro: bairro,
        rua: rua,
        latitude: latitude,
        longitude: longitude 
        
        };

        fetch('/backend/routes/DeputadosRoute.php', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Deputados)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Não autorizado');
            } else {
                throw new Error('Sem rede ou não conseguiu localizar o recurso');
            }
        }
        return response.json();
    })
    .then(data => {
        if(!data.status){
            Swal.fire('Deputado existe!')
        }else{
            Swal.fire('Deputado salvo!')
        } 
    })
    .catch(error => Swal.fire('Erro na requisição:', error));}
    const cepInput = document.getElementById('cep');
    const buscarButton = document.querySelector('button');
    const cidadeSpan = document.getElementById('cidade');
    const bairroSpan = document.getElementById('bairro');
    const ruaSpan = document.getElementById('rua');
    const uf = document.getElementById('uf');
    const latitudeSpan = document.getElementById('latitude');
    const longitudeSpan = document.getElementById('longitude');
    
    buscarButton.addEventListener('click', () => {
      const cep = cepInput.value;
    
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            cidadeSpan.value = data.localidade;
            bairroSpan.value = data.bairro;
            ruaSpan.value= data.logradouro;
            uf.value = data.uf;
            
            const enderecoCompleto = `${data.logradouro} ${data.localidade} ${data.uf}`;
    
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`)
            
              .then(response => response.json())
              .then(data => {
                if (data.length > 0) {
                  latitudeSpan.value = data[0].lat;
                  longitudeSpan.value = data[0].lon;
                } else {
                  latitudeSpan.value = "Não encontrado";
                  longitudeSpan.value = "Não encontrado";
                }
                console.log(fetch)
                });
              console.log(bairroSpan, ruaSpan, cidadeSpan, enderecoCompleto);
          } else {
            cidadeSpan.value = "CEP inválido";
            bairroSpan.textContent = "";
            ruaSpan.textContent = "";
            latitudeSpan.textContent = "";
            longitudeSpan.textContent = "";
          }
        });
    });
    $(document).ready(() => {
        function listarPartidos(partido) {
            let div = `<option value="${partido.id}">${partido.nome}</option>`;
            $('#select-partidos').append(div);
        }
    
        function listarDeputadosPartido(deputado) {
            let div = `<option value="${deputado.id}">${deputado.nome}</option>`;
            $('#select-deputados').append(div);
        }
    
        function exibeDadosDeputado(dados) {
            $('#redes-sociais').empty();
            $('#deputado-form').trigger("reset");
    
            if (!$('#collapse-dados').hasClass('show')) {
                new bootstrap.Collapse('#collapse-dados', {
                    toggle: true
                })
            }
    
            $('#img-deputado').attr('src', dados.ultimoStatus.urlFoto);
    
            $('#nome-deputado').val(dados.nomeCivil);
            $('#partido-deputado').val(dados.ultimoStatus.siglaPartido);
            $('#cpf-deputado').val(dados.cpf);
            $('#sexo-deputado').val(dados.sexo);
            $('#data-nascimento').val(dados.dataNascimento);
            $('#uf-nascimento').val(dados.ufNascimento);
            $('#municipio-nascimento').val(dados.municipioNascimento);
            $('#escolaridade').val(dados.escolaridade);
            $('#situacao').val(dados.ultimoStatus.situacao);
            $('#condicao-eleitoral').val(dados.ultimoStatus.condicaoEleitoral);
            
            $('#email-gabinete').val(dados.ultimoStatus.gabinete.email);
            $('#telefone-gabinete').val(dados.ultimoStatus.gabinete.telefone)
        }
    
        function apiListaPartidos(pagina) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/partidos?pagina=${pagina}`;
            fetch(url) // Usando fetch para simplificar a requisição
                .then(response => response.json())
                .then(data => {
                    if (data.dados.length > 0) {
                        data.dados.forEach(listarPartidos);
                        apiListaPartidos(pagina + 1);
                    } else {
                        $('#select-partidos')[0][0].innerText = "Selecione o partido...";
                    }
                });
        }
    
        function apiListaDeputados(idLegislatura, sigla, pagina) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=${idLegislatura}&siglaPartido=${sigla}&pagina=${pagina}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.dados.length > 0) {
                        data.dados.forEach(listarDeputadosPartido);
                        apiListaDeputados(idLegislatura, sigla, pagina + 1);
                    }
                });
        }
    
        function apiDadosDeputado(id) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    exibeDadosDeputado(data.dados);
                });
        }
    
        function apiPartido(partido) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/partidos/${partido}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    apiListaDeputados(data.dados.status.idLegislatura, data.dados.sigla, 1);
                });
        }
    
        apiListaPartidos(1);
    
        $('#select-partidos').on('change', () => {
            $('#select-deputados').empty();
            let div = `<option selected disabled>Selecione o deputado...</option>`;
            $('#select-deputados').append(div);
            apiPartido($('#select-partidos').val());
            if (!$('#collapse-deputados').hasClass('show')) {
                new bootstrap.Collapse('#collapse-deputados', {
                    toggle: true
                })
            }
        });
    
        $('#select-deputados').on('change', () => {
            apiDadosDeputado($('#select-deputados').val());
        });
    });
    $(document).ready(() => {
        function listarPartidos(partido) {
            let div = `<option value="${partido.id}">${partido.nome}</option>`;
            $('#select-partidos').append(div);
        }
    
        function listarDeputadosPartido(deputado) {
            let div = `<option value="${deputado.id}">${deputado.nome}</option>`;
            $('#select-deputados').append(div);
        }
    
        function exibeDadosDeputado(dados) {
            $('#redes-sociais').empty();
            $('#deputado-form').trigger("reset");
    
            if (!$('#collapse-dados').hasClass('show')) {
                new bootstrap.Collapse('#collapse-dados', {
                    toggle: true
                })
            }
    
            $('#img-deputado').attr('src', dados.ultimoStatus.urlFoto);
    
            $('#nome-deputado').val(dados.nomeCivil);
            $('#partido-deputado').val(dados.ultimoStatus.siglaPartido);
            $('#cpf-deputado').val(dados.cpf);
            $('#sexo-deputado').val(dados.sexo);
            $('#data-nascimento').val(dados.dataNascimento);
            $('#uf-nascimento').val(dados.ufNascimento);
            $('#municipio-nascimento').val(dados.municipioNascimento);
            $('#escolaridade').val(dados.escolaridade);
            $('#situacao').val(dados.ultimoStatus.situacao);
            $('#condicao-eleitoral').val(dados.ultimoStatus.condicaoEleitoral);
            
            dados.redeSocial.map((link) => {
                let div = `<a href="${link}" target="_blank">${link}</a> <br>`
                $('#redes-sociais').append(div);
            });
    
            $('#gabinete-nome').val(dados.ultimoStatus.gabinete.nome);
            $('#gabinete-predio').val(dados.ultimoStatus.gabinete.predio);
            $('#gabinete-sala').val(dados.ultimoStatus.gabinete.sala);
            $('#gabinete-andar').val(dados.ultimoStatus.gabinete.andar);
    
            $('#email-gabinete').val(dados.ultimoStatus.gabinete.email);
            $('#telefone-gabinete').val(dados.ultimoStatus.gabinete.telefone)
        }
    
        function apiListaPartidos(pagina) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/partidos?pagina=${pagina}`;
            let req = new XMLHttpRequest();
            let corpo;
            req.open ("GET", url);
            req.onreadystatechange = (evt) => {
                if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                    console.log(req.responseText);
                    corpo = JSON.parse(req.responseText);
                    console.log(corpo.dados);
                    let i = 0;
                    console.log(corpo.dados.length);
                    if (corpo.dados.length > 0) {
                        corpo.dados.map((partido) => {
                            listarPartidos(partido, i);
                            i++;
                        })
                        apiListaPartidos(pagina+1);
                        $('#select-partidos')[0][0].innerText = "Selecione o partido...";
                    }
                }
            }
            req.setRequestHeader("Accept", "application/json");
            req.send();
        }
    
        function apiListaDeputados(idLegislatura, sigla, pagina) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=${idLegislatura}&siglaPartido=${sigla}&pagina=${pagina}`;
            let req = new XMLHttpRequest();
            let corpo;
            req.open("GET", url);
            req.onreadystatechange = (evt) => {
                if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                    corpo = JSON.parse(req.responseText);
                    let i = 0;
                    if (corpo.dados.length > 0) {
                        corpo.dados.map((deputados) => {
                            listarDeputadosPartido(deputados, i);
                            i++;
                        })
                        apiListaDeputados(idLegislatura, sigla, pagina+1);
                    }
                }
            }
            req.setRequestHeader("Accept", "application/json");
            req.send();
        }
    
        function apiDadosDeputado(id) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`;
            let req = new XMLHttpRequest();
            let corpo;
            req.open("GET", url);
            req.onreadystatechange = (evt) => {
                if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                    corpo = JSON.parse(req.responseText);
                    exibeDadosDeputado(corpo.dados);
                }
            }
            req.setRequestHeader("Accept", "application/json");
            req.send();
        }
    
        function apiPartido(partido) {
            let url = `https://dadosabertos.camara.leg.br/api/v2/partidos/${partido}`;
            let req = new XMLHttpRequest();
            let corpo;
            req.open("GET", url);
            req.onreadystatechange = (evt) => {
                if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                    corpo = JSON.parse(req.responseText);
                    console.log(corpo.dados);
                    apiListaDeputados(corpo.dados.status.idLegislatura, corpo.dados.sigla, 1);
                }
            }
            req.setRequestHeader("Accept", "application/json");
            req.send();
        }
    
        apiListaPartidos(1);
        
        $('#select-partidos').on('change', () => {
            $('#select-deputados').empty();
            let div = `<option selected disabled>Selecione o deputado...</option>`;
            $('#select-deputados').append(div);
            apiPartido($('#select-partidos').val());
            if (!$('#collapse-deputados').hasClass('show')) {
                new bootstrap.Collapse('#collapse-deputados', {
                    toggle: true
                })
            }
        })
    
        $('#select-deputados').on('change', () => {
            console.log($('#select-deputados').val());
            apiDadosDeputado($('#select-deputados').val());
        })
    
    })
       