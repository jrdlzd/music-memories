// grid.js for reviewed.html
// used to display the projects from Supabase database into reviewed.html

import { supabase } from "./supabaseClient.js";

let projects = [];
let filteredProjects = [];

//fetch spotify access token
async function fetchAccessToken() {
    try {
        const response = await fetch('http://localhost:3000/api/get-spotify-token');
        const data = await response.json();
        return data.access_token;
    }
    catch(error) {
        console.error('Error fetching Spotify token: ', error);
        return null;
    }
}

//fetch album image from spotify api
async function fetchAlbumImage(spotifyID, accessToken) {
    if(!accessToken) {
        console.error('Spotify access token missing');
        return null;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums/${spotifyID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if(!response.ok) {
            console.error(`Failed to fetch Spotify data for ID ${spotifyId}`);
            return null;
        }

        const data = await response.json();
        return data.images[0]?.url || null;
    }
    catch(error) {
        console.error('Error fetching Spotify image: ', error);
        return null;
    }
}

async function fetchProjects() {
    const {data, error} = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: true});

    if(error) {
        console.error("Error fetching projects: ", error);
        return [];
    }

    return data;
}

async function displayProjects(projectList) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; // clear existing content

    //get spotify access token
    const accessToken = await fetchAccessToken();

    const projectsWithImages = await Promise.all(
        projectList.map(async (project) => {
            let img = '';
            if (project.spotify_id) {
                img = await fetchAlbumImage(project.spotify_id, accessToken);
            }
            return { ...project, img }; //attach image url to project object
        })
    );

    projectsWithImages.forEach((project) => {
        const projectBox = document.createElement('a');
        projectBox.className = 'card';

        if(project.rating == 10.0 && project.tens_id != null) {
            projectBox.href = `tens.html#${project.tens_id}`;
        }
        else {
            projectBox.href = `project.html?id=${project.id}`;
        }

        projectBox.innerHTML = `
            <img src="${project.img}" alt="${project.title}" class="project-image">
            <div class="project-box">
                <h2>${project.title}</h2>
                <p>${project.type} by ${project.artist}</p>
                <p>Released: ${project.release_date}</p>
                <p>Rating: ${project.rating}/10</p>
            </div>
        `;

        gridContainer.appendChild(projectBox);
    });
}

function filterProjects(year) {

    if(year === 'all') {
        filteredProjects = [...projects];
    }
    else {
        filteredProjects = projects.filter(project => new Date(project.release_date).getFullYear() === parseInt(year));
    }
    displayProjects(filteredProjects);
}

function sortProjects(option) {
    let sortedProjects = [...filteredProjects];

    switch(option) {
        case 'none':
            sortedProjects.sort((a, b) => a.id - b.id);
            break;
        case 'rating_high_to_low':
            sortedProjects.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating_low_to_high':
            sortedProjects.sort((a, b) => a.rating - b.rating);
            break;
        case 'alphabetical':
            sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'release_date_newest':
            sortedProjects.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            break;
        case 'release_date_oldest':
            sortedProjects.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            break;
        default:
            break;
    }

    displayProjects(sortedProjects); // Display sorted projects
}

async function searchSupabase(query) {
    const { data, error } = await supabase
        .from('projects').select('*').or(
            `title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`
        );

    if(error) {
        console.error('Supabase search error:', error);
        return [];
    }
    return data || [];
}

async function performSearch(query) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    const supabaseResults = await searchSupabase(query);

    if(supabaseResults.length === 0) {
        gridContainer.innerHTML = `
        <p>
            No results for "<strong>${query}</strong>"
        </p>
        `;
    }
    else {
        const resultsWithImages = await Promise.all(
            supabaseResults.map(async item => {
                let img = '';
                if(item.spotify_id) {
                    const accessToken = await fetchAccessToken();
                    img = await fetchAlbumImage(item.spotify_id, accessToken);
                }
                return {
                    id: item.id,
                    title: item.title,
                    artist: item.artist,
                    release_date: item.release_date,
                    rating: item.rating,
                    tens_id: item.tens_id || null,
                    type: item.type,
                    img,
                };
            })
        );
    
        //display the results in the grid
        resultsWithImages.forEach(result => {
            const projectBox = document.createElement('a');
            projectBox.className = 'card';
    
            if(result.rating === 10.0 && result.tens_id != null) {
                projectBox.href = `tens.html#${result.tens_id}`;
            }
            else {
                projectBox.href = `project.html?id=${result.id}`;
            }
    
            projectBox.innerHTML = `
                <img src="${result.img}" alt="${result.title}" class="project-image">
                <div class="project-box">
                    <h2>${result.title}</h2>
                    <p>${result.type} by ${result.artist}</p>
                    <p>Released: ${result.release_date}</p>
                    <p>Rating: ${result.rating}/10</p>
                </div>
            `;
    
            gridContainer.appendChild(projectBox);
        });
    }

    //clear search input after displaying results
    document.getElementById('search-bar').value = '';
}

async function initializeGrid() {
    projects = await fetchProjects();
    filteredProjects = [...projects];
    displayProjects(filteredProjects)
}


//event listeners
document.getElementById('filterYear').addEventListener('change', function() {
    filterProjects(this.value);
});

document.getElementById('sortOption').addEventListener('change', function() {
    sortProjects(this.value);
});

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value.trim().toLowerCase();
    if(query) {
        await performSearch(query);
    }
});

initializeGrid();