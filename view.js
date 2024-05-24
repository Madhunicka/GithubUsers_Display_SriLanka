document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and display users from the backend
    async function fetchAndDisplayUsers() {
        try {
            // Make a GET request to the backend endpoint
            const response = await fetch('/fetch-and-store-users');
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Log the response for verification
                displayUsers(data.users); // Call the displayUsers function with the fetched users
            } else {
                console.error('Failed to fetch users:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Function to display users in the frontend
    function displayUsers(users) {
        console.log('Displaying users...');
        const container = document.getElementById('users-container');
        container.innerHTML = ''; // Clear any existing content
        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');
            userCard.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}">
                <h2>${user.login}</h2>
                <p>Repositories: ${user.repoCount}</p>
                <a href="${user.html_url}" target="_blank">View Profile</a>
            `;
            container.appendChild(userCard);
        });
    }

    // Call the fetchAndDisplayUsers function to fetch and display users when the DOM is loaded
    fetchAndDisplayUsers();
});
