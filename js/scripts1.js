// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const bookNowButtons = document.querySelectorAll('.book-now-btn');

    bookNowButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('You have booked an appointment with this doctor!');
        });
    });
});
