document.addEventListener('DOMContentLoaded', function() {
    let wheel = document.querySelector('.wheel');
    let popup = document.querySelector('.popup');
    let items = document.querySelectorAll('.number');
    let awardForm = document.getElementById('awardForm');
    let selectedAwardInput = document.getElementById('selected_award');
    let confettiInterval;

    // EXIBIR POPUP E CONFETTI
    function exibirPopUpPremio(premio) {
        // Exibir o pop-up com o prêmio
        popup.querySelector('p').innerText = "Parabéns " + customer_name + "! Você ganhou o prêmio: " + premio;
        popup.style.display = "block";

        // Atualizar o input oculto com o nome do prêmio
        selectedAwardInput.value = premio; // Aqui, 'selected_award'
        
        // Acionar a chuva de confete
        let canvas = document.createElement("canvas");
        canvas.classList.add('confetti-canvas'); // Adiciona uma classe para estilização

        // Define o tamanho do canvas para cobrir toda a janela
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 1.8;

        // Adicionar canvas ao corpo da página
        document.body.appendChild(canvas);

        let confetti_button = confetti.create(canvas);
        confetti_button().then(() => {
            if (document.body.contains(canvas)) { // Verifica se o canvas ainda está no body
                document.body.removeChild(canvas); // Remove após a animação
            }
        });

        // Executar a chuva de confete em intervalos regulares
        confettiInterval = setInterval(() => {
            confetti_button();
        }, 400); // intervalo da chuva de conffeti

        // Fechar o pop-up quando clicar fora dele
        window.onclick = function(event) {
            if (!popup.contains(event.target)) {
                fecharPopUp();
            }
        }
    }

    // FECHAR POPUP
    function fecharPopUp() {
        popup.style.display = "none";
        clearInterval(confettiInterval); // Parar a chuva de confete
        let canvas = document.querySelector('.confetti-canvas');
        if (canvas) {
            document.body.removeChild(canvas); // Remover o canvas do confete
        }
        enviarFormulario();
    }

    // Enviar formulário
    function enviarFormulario() {
        console.log('enviando Formulario:')
        let formData = new FormData(awardForm);

        fetch(awardForm.action, {
            method: 'POST',
            body: formData,
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar formulário');
            }
            return response.text();  // Primeiro obtenha como texto
        })
        .then(text => {
            try {
                const data = JSON.parse(text);  // Tente converter para JSON
                console.log('Resposta do servidor:', data);
    
                if (data.success) {
                    console.log('Formulário enviado com sucesso!');
                    window.location.href = data.redirect; // Redirecionar após sucesso
                } else {
                    console.error('Erro ao enviar formulário:', data.message);
                    // Mesmo em caso de erro, redirecionar
                    window.location.href = data.redirect;
                }
            } catch (e) {
                console.error('Resposta não é um JSON válido:', text);
                // Redirecionar mesmo que a resposta não seja JSON válido
                window.location.href = data.redirect;
            }
        })
        .catch(error => {
            console.error('Erro ao enviar formulário:', error.message || error);
            // Redirecionar em caso de exceção
            window.location.href = data.redirect;
        });
    }

    // GIRO DA ROLETA
    function girarRoleta() {
        // Rotação aleatória da roleta
        let value = Math.ceil(Math.random() * 3600);
        wheel.style.transform = "rotate(" + value + "deg)";

        // Calcular o ângulo final após a rotação
        let finalAngle = value % 360;
        if (finalAngle < 0) {
            finalAngle += 360; // Garantir que o ângulo final seja positivo
        }

        // Determinar o item ganho com base no ângulo final
        let anglePerItem = 360 / totalItems;
        let currentItem = Math.floor((360 - finalAngle + ((360 / totalItems) + 75) / 2) % 360 / anglePerItem);

        // Exibir o pop-up com o prêmio correspondente
        if (items[currentItem].innerText !== "Não Deu!") {
            setTimeout(function() {
                console.log('exibindo popup')
                exibirPopUpPremio(items[currentItem].innerText);
            }, 5000); // duração do giro da roleta
        } else {
            // Espera mais 5000 ms após exibir o pop-up para garantir que o pop-up seja exibido por um tempo adequado
            setTimeout(function() {
                enviarFormulario();
            }, 5000); // Tempo para exibir o pop-up
        }
    }

    // Adicionar um event listener para a tecla específica (por exemplo, "Enter")
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') { // Verifica se a tecla pressionada é "Enter"
            girarRoleta();
        }
    });
});