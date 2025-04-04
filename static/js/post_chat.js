$(document).ready(function () {
    $('#toggle-suggestions').click(function () {
        $('#suggestions-section').slideToggle('fast');

        // Rotate the arrow icon
        $('#toggle-icon').toggleClass('rotate-180');
    });
});

// Handle Enter key press
$('#user-input').on('keypress', function(event) {
    if (event.which === 13) {
        $('#send-btn').click();
    }
});

// Handle suggestions button click
$('.suggestion-btn').on('click', function() {
    const suggestion = $(this).data('suggestion');
    $('#user-input').val(suggestion);
    $('#send-btn').click();
});











function appendMessage(message, type) {
    const messageDiv = $('<div>').addClass('chat-message').addClass(type).addClass('mb-4 p-3 rounded-lg');
    if (type === 'user') {
        messageDiv.addClass('bg-[#444654] text-white text-right');
        messageDiv.text(message); // Display the user's message directly
    } else {
        messageDiv.addClass('text-white text-left');

        // Typing effect for the bot's message
        let index = 0;
        messageDiv.text('');
        $('#chat-box').append(messageDiv);
        $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);

        function typeWriter() {
            if (index < message.length) {
                messageDiv.append(message.charAt(index));
                index++;
                setTimeout(typeWriter, 50); // Adjust typing speed here
            }
        }

        typeWriter(); // Start the typing effect
    }

    $('#chat-box').append(messageDiv);
    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
}





$('#send-btn').on('click', function() {
    const userMessage = $('#user-input').val().trim();
    if (userMessage) {
        $('#chat-box').show(); // Show the chat box when the first message is sent
        appendMessage(userMessage, 'user');  // Display the user's message directly
        $('#user-input').val('');

        $.ajax({
            url: '/chat',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: userMessage }),
            success: function(data) {
                const botResponse = data.response;
            
                $('#chat-box').show();
            
                const avatar = $('<img>')
                    .attr('src', '/static/assets/logo.jpg')
                    .addClass('w-10 h-10 rounded-full mr-3');
            
                const containerDiv = $('<div>').addClass('flex items-start mb-4');
                const messageDiv = $('<div>').addClass('chat-message bot p-3 rounded-lg bg-[#343541] text-white text-left max-w-[75%]');
            
                // Create a temporary div to parse HTML content
                const tempDiv = $('<div>').html(botResponse);
            
                // Check for iframe
                const iframeTag = tempDiv.find('iframe');
                if (iframeTag.length > 0) {
                    // Make the messageDiv wider/taller for iframe content
                    messageDiv
                        .removeClass('max-w-[75%]')
                        .addClass('w-full');
                
                    iframeTag.addClass('w-full h-64 rounded-lg mt-2'); // Adjust height if needed
                    messageDiv.append(iframeTag);
                
                    const text = tempDiv.text().trim();
                    if (text) {
                        const textDiv = $('<p>').text(text);
                        messageDiv.prepend(textDiv);
                    }
                
                    containerDiv.append(avatar).append(messageDiv);
                    $('#chat-box').append(containerDiv);
                    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
                }
                
                else if (botResponse.includes('<img')) {
                    const imgTag = tempDiv.find('img');
                    const imgSrc = imgTag.attr('src') || data.image_url;
                
                    if (imgSrc) {
                        const imgElement = $('<img>').attr('src', imgSrc).addClass('w-full rounded-lg mt-2');
                        messageDiv.append(imgElement);
                    }
                
                    const text = tempDiv.text().trim();
                    if (text) {
                        const textDiv = $('<p>').text(text);
                        messageDiv.prepend(textDiv);
                    }
                
                    containerDiv.append(avatar).append(messageDiv);
                    $('#chat-box').append(containerDiv);
                    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
                }
                
                // Fallback: Text-only with typing effect
                else {
                    let index = 0;
                    messageDiv.text('');
                    containerDiv.append(avatar).append(messageDiv);
                    $('#chat-box').append(containerDiv);
                    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
            
                    function typeWriter() {
                        if (index < botResponse.length) {
                            messageDiv.append(botResponse.charAt(index));
                            index++;
                            setTimeout(typeWriter, 40);
                        }
                    }
            
                    typeWriter();
                }
            },
            error: function(error) {
                console.error('Error:', error);
                appendMessage("Sorry, something went wrong. Please try again.", 'bot');
            }
            
            
        });
        
    }
});