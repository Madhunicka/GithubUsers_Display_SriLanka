document.addEventListener('DOMContentLoaded', () => {
    const accessToken = 'token'; // Replace with your GitHub personal access token

    async function fetchUsersByRepos(location, page = 1, perPage = 100) {
        console.log(`Fetching users by repositories, page ${page}...`);
        const query = `location:"${location}" repos:>0 sort:repositories-desc`;
        const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Users fetched for page ${page}:`, data);
            return data.items;
        } else {
            console.error('Failed to fetch users:', response.status, response.statusText);
            return [];
        }
    }

    async function fetchUserReposCount(username) {
        console.log(`Fetching repository count for user: ${username}`);
        const response = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `token ${accessToken}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            return user.public_repos;
        } else {
            console.error(`Failed to fetch repository count for user ${username}:`, response.status, response.statusText);
            return 0;
        }
    }

    async function getTopUsers(location) {
        const perPage = 100;
        const usersPage1 = await fetchUsersByRepos(location, 1, perPage);
        const usersPage2 = await fetchUsersByRepos(location, 2, perPage);
        const usersPage3 = await fetchUsersByRepos(location, 3, perPage);

        const users = [...usersPage1, ...usersPage2, ...usersPage3];
        const userReposCounts = await Promise.all(users.map(async user => {
            const repoCount = await fetchUserReposCount(user.login);

            return {
                login: user.login,
                avatar_url: user.avatar_url,
                html_url: user.html_url,
                repoCount: repoCount
            };
        }));

        // Sort users by the number of repositories in descending order and take the top 300
        userReposCounts.sort((a, b) => b.repoCount - a.repoCount);
        return userReposCounts.slice(0, 300);
    }

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

    const location = 'Sri Lanka'; // Specify the location

    getTopUsers(location)
        .then(users => displayUsers(users))
        .catch(error => console.error('Error fetching and displaying user data:', error));
});
