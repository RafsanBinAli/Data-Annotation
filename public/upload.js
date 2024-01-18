const uploadButton = document.getElementById("upload-button-navbar");
const uploadOverlay = document.getElementById("upload-overlay");
const uploadAlert = document.getElementById("upload-alert");
const deleteButton = document.getElementById("delete");
const deletion = document.getElementById("deletion");

const allJobs = document.querySelectorAll(".card-type");
const incompleteButton = document.querySelector("#incomplete-jobs-button");
const completeButton = document.querySelector("#complete-jobs-button");

const allButton = document.querySelector("#all-jobs-button");

allButton.addEventListener("click",()=>{
    allJobs.forEach((job)=>
    {
        job.style.display="block";
    })
})

incompleteButton.addEventListener("click",()=>{
    allJobs.forEach((job)=>{
        job.style.display="none"
    })

    allJobs.forEach((job)=>{
        const completionStatus =job.getAttribute("data-completion-status");

        if(completionStatus=== "false")
        {
            job.style.display="block";
        }
    })
});
completeButton.addEventListener("click",()=>{
    allJobs.forEach((job)=>{
        job.style.display="none";
    })

    allJobs.forEach((job)=>{
        const completionStatus = job.getAttribute("data-completion-status");

        if(completionStatus==="true")
        {
            job.style.display="block";
        }
    })
})



document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const fileId = event.target.getAttribute("data-file-id");

            // Send an AJAX request to delete the card
            fetch(`/delete/${fileId}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        // Card deleted successfully


                        // Check for a custom response indicating a successful delete
                        return response.json();
                    } else {
                        // Handle errors if the delete request fails
                        console.error("Failed to delete the card.");
                    }
                })
                .then((data) => {
                    if (data.success) {
                        deletion.style.display = "block";
                        setTimeout(() => {
                            const card = event.target.closest(".card-type");
                            card.style.display = "none";
                            deletion.style.display = "none";


                            location.reload();
                        }, 1000);


                        // Hide the card
                        // Reload the page when the server indicates success



                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    });
});






uploadButton.addEventListener("click", () => {
    uploadOverlay.style.display = "block";

});

function closeUploadOverlay() {
    uploadOverlay.style.display = "none";
}



window.addEventListener("click", (event) => {
    if (event.target === uploadOverlay) {
        closeUploadOverlay();
    }
});

const uploadForm = document.getElementById("upload-form");
uploadForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(uploadForm); // Create a FormData object from the form

    fetch('/upload', {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                uploadAlert.style.display = "block"
                console.log("Message displayed.");

                // Hide the message after a delay (e.g., 1.5 seconds)
                setTimeout(() => {
                    uploadAlert.style.display = "none";


                    location.reload();
                }, 500);





                return response.text();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .then((data) => {
            // Handle the response from the server (e.g., display a success message)
            console.log(data);
            closeUploadOverlay();
        })
        .catch((error) => {
            // Handle any errors that occur during form submission
            console.error(error);
        });
});