document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("checkButton");
    const inputField = document.getElementById("inputField");
    const answerDiv = document.getElementById("answer");
    let audioYes = new Audio('yes.mp3');
    let audioNo = new Audio('no.mp3');
    let audioMaybe = new Audio('maybe.mp3');
    let audioNoQuestion = new Audio('noquestion.mp3');
    let currentAudio = null; // Variable to store the current audio being played

    // Function to enable/disable the button based on input field value
    function toggleButton() {
        if (inputField.value.trim() === "" || !endsWithQuestionMark(inputField.value.trim())) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }

    function endsWithQuestionMark(text) {
        return text.endsWith("?");
    }

    inputField.addEventListener("input", function () {
        toggleButton();
        // Additional check when typing/question mark is removed
        if (!endsWithQuestionMark(inputField.value.trim())) {
            // Handle the case when the question mark is removed
            button.disabled = true;
        }
    });

    button.addEventListener("click", async function () {
        const question = inputField.value.trim(); // Trim whitespace from the question

        // If no question is entered or doesn't end with a question mark, play the noquestion audio and return
        if (!question || !endsWithQuestionMark(question)) {
            audioNoQuestion.play();
            return;
        }

        try {
            const response = await fetch("https://yesno.wtf/api");
            const data = await response.json();

            if (data.answer && data.image) {
                // Update the answer message
                answerDiv.innerHTML = `<img src="${data.image}" alt="${data.answer}" class="result-image"><p>${data.answer}</p>`;

                // Pause the current audio (if any)
                if (currentAudio && !currentAudio.paused) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0; // Reset audio to start for next play
                }

                // Play audio based on the result
                switch (data.answer.toLowerCase()) {
                    case 'yes':
                        currentAudio = audioYes;
                        break;
                    case 'no':
                        currentAudio = audioNo;
                        break;
                    case 'maybe':
                        currentAudio = audioMaybe;
                        break;
                    default:
                        break;
                }

                currentAudio.play(); // Play the new audio
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    // Initial check for button state
    toggleButton();
});
