    // Variável para armazenar os endereços predefinidos
    let enderecos = [];

    // Função para carregar os dados do arquivo JSON
    function carregarEnderecos() {
      fetch('/assets/address.json')
        .then(response => response.json())
        .then(data => {
          enderecos = data.enderecos; // Armazenar os endereços carregados
        })
        .catch(error => {
          console.error("Erro ao carregar o arquivo JSON", error);
        });
    }
    
    // Função para calcular a distância entre dois pontos geográficos usando a fórmula de Haversine
    function calcularDistancia(lat1, lon1, lat2, lon2) {
      const R = 6371; // Raio da Terra em km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c; // Distância em km
      return distancia;
    }
    
    // Função para converter graus para radianos
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    
    // Função para obter a localização do usuário e buscar o endereço mais próximo
    function obterLocalizacao() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        alert("Geolocalização não é suportada por este navegador.");
      }
    }
    
    // Função de sucesso ao obter a localização do usuário
    function success(position) {
      const latUsuario = position.coords.latitude;
      const lonUsuario = position.coords.longitude;
    
      let enderecoMaisProximo = null;
      let distanciaMinima = Infinity;
    
      // Comparar a distância do endereço do usuário com os endereços predefinidos
      enderecos.forEach(endereco => {
        const distancia = calcularDistancia(latUsuario, lonUsuario, endereco.latitude, endereco.longitude);
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          enderecoMaisProximo = endereco;
        }
      });
    
      // Exibir o resultado
      if (enderecoMaisProximo) {
        document.getElementById("resultado").innerHTML = `
          A célula mais próxima de você é: <strong>${enderecoMaisProximo.descricao}</strong> 
          com a distância de <strong>${distanciaMinima.toFixed(2)} km</strong>.
        <br>
          Procure pelo anfitrião: ${enderecoMaisProximo.anfitriao}
        <br>
          As células acontecem todas ${enderecoMaisProximo.dia} às ${enderecoMaisProximo.horario} horas
        `;
      }
    }
    
    // Função de erro ao obter a localização do usuário
    function error() {
      alert("Não foi possível obter sua localização. Por favor, permita o acesso à sua localização.");
    }
    
    // Carregar os dados dos endereços quando a página for carregada
    document.addEventListener('DOMContentLoaded', carregarEnderecos);