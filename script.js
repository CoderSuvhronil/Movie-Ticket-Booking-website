// Global variables
let currentUser = null;
let selectedMovie = null;
let selectedTheater = null;
let selectedSeats = [];
let seatPrice = 200;

// Sample movie data
const movies = [
    { title: 'Saiyaara', language: 'hindi', genre: 'Romance', duration: '2h 15m', image: 'https://m.media-amazon.com/images/M/MV5BNTEyYjI2NjEtMjU1Ni00Yzc1LWFmZTQtNmQzM2FhYzE2MjNlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
    { title: 'Pathaan', language: 'hindi', genre: 'Action', duration: '2h 26m', image: 'https://m.media-amazon.com/images/M/MV5BNTU2MzZkNDMtYTM3Yy00ZjEyLTljZDUtNWZhYTNjYWRlODc5XkEyXkFqcGc@._V1_.jpg' },
    { title: 'Jawaan', language: 'hindi', genre: 'Action', duration: '2h 49m', image: 'https://i.ytimg.com/vi/6ZAqt0rbMUw/sddefault.jpg' },
    { title: 'Dunki', language: 'hindi', genre: 'Drama', duration: '2h 41m', image: 'https://media.assettype.com/kashmirtimes%2F2025-02-11%2Fo8t5x82a%2FDunki-movie-poster.webp?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100' },
    { title: 'Housefull 5', language: 'hindi', genre: 'Comedy', duration: '2h 30m', image: 'https://i.ytimg.com/vi/zUh8Z9fGF6Q/maxresdefault.jpg' },
    { title: 'Bhool Bhulaiya 3', language: 'hindi', genre: 'Comedy', duration: '2h 22m', image: 'https://www.insideboxoffice.com/wp-content/uploads/2024/11/Bhool-Bhulaiya-3-Movie-Review.jpg' },
    { title: 'Animal', language: 'hindi', genre: 'action', duration: '3h 21m', image: 'https://i.ytimg.com/vi/t739wOpXRYU/sddefault.jpg' },
    { title: 'Avengers End Game', language: 'English', genre: 'action', duration: '3h 1m', image: 'https://lh5.googleusercontent.com/proxy/QdR6wbC9xWdWyzEMdFRCv2lOqrQoRzZ3rMSxma77nqlvbP48A7ltjQs5baGivWx2H-WGVofJ3CdaTTegnDndf-ZcdwDYZFAnDf6nXZ1IxYbOXA' },
    { title: 'RRR', language: 'telugu', genre: 'drama', duration: '3h 7m', image: 'https://i.ytimg.com/vi/lDVQojLPI4Y/maxresdefault.jpg' },
    { title: 'Pushpa 2', language: 'tamil', genre: 'action', duration: '3h 21m', image: 'https://i.ytimg.com/vi/IU3eUocFHkA/sddefault.jpg' },
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
    const languageFilter = document.getElementById('languageFilter').value;
    const genreFilter = document.getElementById('genreFilter').value;

    let filteredMovies = movies;

    if (languageFilter) {
        filteredMovies = filteredMovies.filter(movie => movie.language === languageFilter);
    }

    if (genreFilter) {
        filteredMovies = filteredMovies.filter(movie => movie.genre === genreFilter);
    }

    displayMovies(filteredMovies);
}

// Initialize the app
showSection('home');
