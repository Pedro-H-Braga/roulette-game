<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Roleta da Sorte - Farmácia XXXX</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <link rel="stylesheet" href="{{ asset('css/wheel.css')}}" type="text/css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body>
    <h1 class="gamified-title">Roleta da Sorte</h1>
    
    <!-- Botão de Retornar -->
    <div class="back-button-container">
        <a href="{{ route('award.index') }}" class="btn">
            <i class="fas fa-arrow-left"></i>
        </a>
    </div>

    <div class="poster-container">
        <div class="container">            
            <div class="spinBtn"></div>
            <div class="wheel">
                @php
                    $contador = -1;
                @endphp
                
                @foreach ($awards as $award)
                    @php
                        $contador += 1;
                        $color = $colors[$award['name']];
                    @endphp 
                    
                    <div class="number" 
                    style="--i:{{$contador}};--clr:{{$color}};--ang:{{ count($awards) }};">
                    @if($award['image'])
                    <img src="{{ $award['image'] }}" alt="{{ $award['name'] }}" class="award-image">
                    @endif
                    <span>{{ $award['name'] }}</span>
                    </div>

                @endforeach
            </div>
            <div class="popup ">
                <p></p>
            </div>
        </div>
    </div>

    <!-- Formulário oculto -->
    {!! Form::open([
        'id' => 'awardForm',
        'route' => ['award.updateQuantity'], // Aqui, apontamos para a rota correta
        'method' => 'POST',
        'style' => 'display:none;' // Oculta o formulário
    ]) !!}
        {{ Form::hidden('award_name', '', ['id' => 'selected_award']) }}
        {{ Form::hidden('movement_id', $raffleMovement->id) }}
        {{ Form::hidden('raffle_number', $raffleMovement->raffle_number) }}
        {{ Form::submit('Submit') }}
    {!! Form::close() !!}

    @php
        if (empty($raffleMovement->customer_description)) {
            throw new \Exception('O nome do cliente não pode ser nulo.');
        }
    @endphp

    <script>
        let totalItems = {{ count($awards) }};        
        let customer_name = {!! json_encode($raffleMovement->customer_description) !!};
    </script>
</body>

<script 
    src="{{ asset('wheel/wheel.js') }}">
</script>

</html>