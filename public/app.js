


var socket = io('http://localhost:3000')

function renderMyMessage(message){
    $('.messages').append('<div id="remetente" class="remetente"><div class="message user1"><strong>'+ message.author+'</strong>: ' + message.message +'</div></div>')
}
function renderMessage(message){
    $('.messages').append('<div id="emitente" class="emitente"><div class="message user2"><strong>'+ message.author+'</strong>: ' + message.message +'</div></div>')
}

socket.on('previousMessages', function(messages){
    for (message of messages){
        renderMessage(message)
    }
})

socket.on('receivedMessage', function(message) {
    renderMessage(message)
})

$('#chat').submit(function(event){
    event.preventDefault();

    console.log($('selector'))

    var author =  'usuario'

    var message = $('input[name=message]').val();
        var messageObject = {
            author,
            message,
        };

        renderMyMessage(messageObject)

        socket.emit('sendMessage', messageObject)
}
)