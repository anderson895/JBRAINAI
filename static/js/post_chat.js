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
                console.log(data);
                const botResponse = data.response;
            
                $('#chat-box').show(); // In case it isn't shown yet
            
                // Create a container for bot response
                const messageDiv = $('<div>').addClass('chat-message bot mb-4 p-3 rounded-lg bg-[#343541] text-white text-left');
            
                // Check if the response contains an <img> tag
                if (botResponse.includes('<img')) {
                    // Extract image URL using regex or use data.image_url if available
                    const tempDiv = $('<div>').html(botResponse);
                    const imgTag = tempDiv.find('img');
                    const imgSrc = imgTag.attr('src') || data.image_url;
            
                    if (imgSrc) {
                        const imgElement = $('<img>').attr('src', imgSrc).addClass('w-full rounded-lg mt-2');
                        messageDiv.append(imgElement);
                    }
            
                    // Also add any accompanying text (not part of <img>)
                    const text = tempDiv.text().trim();
                    if (text) {
                        const textDiv = $('<p>').text(text);
                        messageDiv.prepend(textDiv);
                    }
                } else {
                    // Typing effect for text-only messages
                    let index = 0;
                    messageDiv.text('');
                    $('#chat-box').append(messageDiv);
                    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
            
                    function typeWriter() {
                        if (index < botResponse.length) {
                            messageDiv.append(botResponse.charAt(index));
                            index++;
                            setTimeout(typeWriter, 40);
                        }
                    }
            
                    typeWriter();
                    return; // Don't double-append
                }
            
                $('#chat-box').append(messageDiv);
                $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
            },
            error: function(error) {
                console.error('Error:', error);
                appendMessage("Sorry, something went wrong. Please try again.", 'bot');
            }
        });
    }
});