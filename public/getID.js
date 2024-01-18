

document.addEventListener("DOMContentLoaded", function() {
    var acceptButtons = document.querySelectorAll('#accept');
    
    

        acceptButtons.forEach(function(acceptButton) {
            
            acceptButton.addEventListener('click', function(event) {
                event.preventDefault();
                
                var fileId = acceptButton.getAttribute('data-file-id');
                console.log(fileId);
            });
        });
    });


    
    