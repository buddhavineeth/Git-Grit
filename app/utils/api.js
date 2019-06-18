const id = "a5bfbd9c9e05dc62e900"
const sec = "e400a3547b6423ea491b45561500d60a77a8610a"
const params = "?client_id=" + id + "&client_secret=" + sec

function getErrorMessage (message, username) {
    if (message === "Not Found") {
        return username + " doesn't exist"
    }
    return message
}

function fetchProfile (username) {
    return fetch("https://api.github.com/users/" + username + params)
        .then((result) => result.json())
        .then((profile) => {
            if (profile.message) {
                throw new Error(getErrorMessage(profile.message, username))
            }

            return profile 
        })
}

function fetchRepos (username) {
    return fetch("https://api.github.com/users/" + username + "/repos" + params + "&per_page=100")
    .then((result) => result.json())
    .then((repos) => {
        if (repos.message) {
            throw new Error(getErrorMessage(repos.message, username))
        }

        return repos
    })
}

function calculateScore (followers, repos) {
    return (followers * 3) + getStargazeCount(repos)
}

function getStargazeCount (repos) {
    return repos.reduce((count, { stargazers_count }) => count + stargazers_count , 0)
}

function fetchUserData (player) {
    return Promise.all([
        fetchProfile(player),
        fetchRepos(player)
    ]).then(([profile, repos]) => ({
        profile,
        score: calculateScore(profile.followers, repos)
    }))
}

function sortPlayers (players) {
    return players.sort((a, b) => b.score - a.score)
} 

export function battle (players) {
    return Promise.all([
        fetchUserData(players[0]),
        fetchUserData(players[1])
    ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos (language) {
    const endpoint = window.encodeURI(
        "https://api.github.com/search/repositories?q=stars:>1+language:" + language + "&sort=stars&order=desc&type=Repositories")

    return fetch(endpoint)
        .then((result) => result.json())
        .then((data) => {
            if (!data.items) {
                throw new Error(data.message)
            }
            
            return data.items
        })
}