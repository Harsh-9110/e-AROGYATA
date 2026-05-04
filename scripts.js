// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.book-btn');

    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hospitalCard = button.closest('.hospital-card');
            const availableBedsElement = hospitalCard.querySelector('.available-beds');
            let availableBeds = parseInt(availableBedsElement.textContent);

            if (availableBeds > 0) {
                availableBeds--;
                availableBedsElement.textContent = availableBeds;

                // Optionally, you could also update the slots or show a confirmation message
                alert('Bed booked successfully!');
            } else {
                alert('No beds available to book.');
            }
        });
    });
});
