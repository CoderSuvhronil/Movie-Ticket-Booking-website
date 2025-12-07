// Global variables
let currentUser = null;
let selectedMovie = null;
let selectedTheater = null;
let selectedSeats = [];
let seatPrice = 200;

// Sample movie data
const movies = [
    { title: 'Saiyaara', language: 'hindi', genre: 'Romance', duration: '2h 15m', image: 'https://media-cache.cinematerial.com/p/500x/mwbgqsi1/saiyaara-indian-movie-poster.jpg?v=1753463453' },
    { title: 'Pathaan', language: 'hindi', genre: 'Action', duration: '2h 26m', image: 'https://i.pinimg.com/736x/6a/6d/b9/6a6db9a959576836fd5c42c8bc41d565.jpg' },
    { title: 'Jawaan', language: 'hindi', genre: 'Action', duration: '2h 49m', image: 'https://s3.ap-southeast-1.amazonaws.com/images.deccanchronicle.com/dc-Cover-sn4rud7dsil9l7enke2va06207-20230906130859.Medi.jpeg' },
    { title: 'Dunki', language: 'hindi', genre: 'Drama', duration: '2h 41m', image: 'https://stat4.bollywoodhungama.in/wp-content/uploads/2021/01/Dunki-2.jpg' },
    { title: 'Housefull 5', language: 'hindi', genre: 'Comedy', duration: '2h 30m', image: 'https://assets-in.bmscdn.com/discovery-catalog/events/et00363347-jfmgxfggwz-landscape.jpg' },
    { title: 'Bhool Bhulaiya 3', language: 'hindi', genre: 'Comedy', duration: '2h 22m', image: 'https://www.insideboxoffice.com/wp-content/uploads/2024/11/Bhool-Bhulaiya-3-Movie-Review.jpg' },
    { title: 'Animal', language: 'hindi', genre: 'action', duration: '3h 21m', image: 'https://m.media-amazon.com/images/I/61OmlO9stnL._AC_UF894,1000_QL80_.jpg' },
    { title: 'Avengers End Game', language: 'English', genre: 'action', duration: '3h 1m', image: 'https://lh5.googleusercontent.com/proxy/QdR6wbC9xWdWyzEMdFRCv2lOqrQoRzZ3rMSxma77nqlvbP48A7ltjQs5baGivWx2H-WGVofJ3CdaTTegnDndf-ZcdwDYZFAnDf6nXZ1IxYbOXA' },
    { title: 'Ek Dewewane ki Deewaniyat', language: 'hindi', genre:'Romance', duration: '2h 21m', image: 'https://m.media-amazon.com/images/M/MV5BY2UzNDZiM2EtYjk2MS00NGE5LTliYzktNGQxYWE5ZGUxOWE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
    { title: 'Tere Ishq Mein', language: 'hindi', genre: 'Romance', duration: '2h 47m', image: 'https://images.filmibeat.com/img/popcorn/movie_posters/tereishkmein-20251114144423-23439.jpg' },
    { title: 'RRR', language: 'telugu', genre: 'drama', duration: '3h 7m', image: 'https://i.ytimg.com/vi/lDVQojLPI4Y/maxresdefault.jpg' },
    { title: 'Pushpa 2', language: 'tamil', genre: 'action', duration: '3h 21m', image: 'https://m.media-amazon.com/images/M/MV5BZjllNTdiM2QtYjQ0Ni00ZGM1LWFlYmUtNWY0YjMzYWIxOTYxXkEyXkFqcGc@._V1_.jpg' },
];

// Navigation functions
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');

    if (sectionId === 'movies') {
        displayMovies();
    }
}

// Movie functions
function displayMovies(filteredMovies = movies) {
    const moviesGrid = document.getElementById('moviesGrid');
    moviesGrid.innerHTML = '';

    filteredMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card bg-white rounded-lg shadow-lg overflow-hidden';
        movieCard.innerHTML = `
            <div class="h-48 overflow-hidden">
                <img src="${movie.image}" alt="${movie.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h4 class="text-lg font-bold mb-2">${movie.title}</h4>
                <p class="text-gray-600 mb-4">${movie.genre} • ${movie.language} • ${movie.duration}</p>
                <button onclick="selectMovie('${movie.title}')" class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                    Book Tickets
                </button>
            </div>
        `;
        moviesGrid.appendChild(movieCard);
    });
}

function selectMovie(movieTitle) {
    selectedMovie = movieTitle;
    showSection('multiplexes');
}

function selectMultiplex(theaterName) {
    selectedTheater = theaterName;
    generateSeatMap();
    showSection('seatSelection');
    updateBookingSummary();
}

// Seat selection functions
function generateSeatMap() {
    const seatMap = document.getElementById('seatMap');
    seatMap.innerHTML = '';

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex justify-center space-x-1 mb-2';

        const rowLabel = document.createElement('div');
        rowLabel.className = 'w-6 h-6 flex items-center justify-center font-semibold';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);

        for (let i = 1; i <= seatsPerRow; i++) {
            const seat = document.createElement('button');
            const seatId = `${row}${i}`;
            seat.id = seatId;
            seat.className = 'seat w-6 h-6 rounded-sm border available';
            seat.textContent = i;

            if (Math.random() < 0.2) {
                seat.classList.remove('available');
                seat.classList.add('booked');
                seat.disabled = true;
            } else {
                seat.onclick = () => toggleSeat(seatId);
            }

            rowDiv.appendChild(seat);

            if (i === 6) {
                const gap = document.createElement('div');
                gap.className = 'w-4';
                rowDiv.appendChild(gap);
            }
        }

        seatMap.appendChild(rowDiv);
    });
}

function toggleSeat(seatId) {
    const seat = document.getElementById(seatId);

    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        seat.classList.add('available');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else if (selectedSeats.length < 6) {
        seat.classList.remove('available');
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    } else {
        alert('You can select a maximum of 6 seats at a time');
    }

    updateBookingSummary();
}

function updateBookingSummary() {
    document.getElementById('selectedMovie').textContent = selectedMovie || '-';
    document.getElementById('selectedTheater').textContent = selectedTheater || '-';
    document.getElementById('selectedSeats').textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : '-';

    const total = selectedSeats.length * seatPrice;
    document.getElementById('totalAmount').textContent = `₹${total}`;
}

// Payment functions
function proceedToPayment() {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat');
        return;
    }

    document.getElementById('paymentTickets').textContent = `${selectedSeats.length} tickets`;
    const total = selectedSeats.length * seatPrice + 25;
    document.getElementById('paymentTotal').textContent = `₹${total}`;

    showSection('payment');
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method');
        return;
    }

    setTimeout(() => {
        document.getElementById('confirmMovie').textContent = selectedMovie;
        document.getElementById('confirmTheater').textContent = selectedTheater;
        document.getElementById('confirmSeats').textContent = selectedSeats.join(', ');
        showSection('success');
    }, 2000);
}

// Authentication functions
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
}

function showRegistration() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registrationForm').classList.remove('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    alert('Login successful! Welcome back!');
    currentUser = { name: 'John Doe', email: 'john@example.com' };
    showSection('home');
}

function handleRegistration(event) {
    event.preventDefault();
    alert('Registration successful! Welcome to BookMyShow!');
    currentUser = { name: 'New User', email: 'newuser@example.com' };
    showSection('home');
}

// Admin functions
function addMovie(event) {
    event.preventDefault();
    alert('Movie added successfully!');
    event.target.reset();
}

// Payment method selection
document.addEventListener('DOMContentLoaded', function () {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function () {
            document.getElementById('cardPayment').classList.add('hidden');
            document.getElementById('upiPayment').classList.add('hidden');

            if (this.value === 'credit' || this.value === 'debit') {
                document.getElementById('cardPayment').classList.remove('hidden');
            } else if (this.value === 'upi') {
                document.getElementById('upiPayment').classList.remove('hidden');
            }
        });
    });

    // Movie filters
    document.getElementById('languageFilter').addEventListener('change', filterMovies);
    document.getElementById('genreFilter').addEventListener('change', filterMovies);
});

function filterMovies() {
    const languageFilter = document.getElementById('languageFilter').value.toLowerCase();
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();

    let filteredMovies = movies;

    if (languageFilter) {
        filteredMovies = filteredMovies.filter(movie => movie.language.toLowerCase() === languageFilter);
    }

    if (genreFilter) {
        filteredMovies = filteredMovies.filter(movie => movie.genre.toLowerCase() === genreFilter);
    }

    displayMovies(filteredMovies);
}

// Initialize the app
showSection('home');
