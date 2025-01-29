//tens.js used for tens.html
//fetches from tens database in supabase and displays them to tens.html

import { supabase } from "./supabaseClient.js";

async function fetchTensProjects() {
    console.log("inside fetchTensProjects");
    const { data, error } = await supabase.from('projects').select('*').eq('rating', 10).order('id', { ascending: true });

    if(error) {
        console.error("Error fetching tens projects: ", error);
        return [];
    }

    console.log("yes");

    return data;
}

async function displayTensProjects(tensId = null) {
    const tensContainer = document.getElementById('tens-container');
    tensContainer.innerHTML = '';
    
    const tensProjects = await fetchTensProjects();
    console.log(tensProjects);
    tensProjects.forEach(proj => {
        const projectDiv = document.createElement('div');
        projectDiv.id = `id="${proj.tens_id}`
        projectDiv.innerHTML = `
        <div class="container section-title">
            <h2>${proj.release_date.substring(0,4)}</h2>
            <p>${proj.title} - ${proj.artist}</p>
        </div>
        <div class="container">
            <div class="row gy-4">
                <div class="col-lg-6">
                    <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/${proj.spotify_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
                <div class="col-lg-6 content">
                    <p>
                    ${proj.thoughts}
                    </p>
                    <ul>
                        <li><span>Released ${proj.release_date}</span></li>
                        <li>Genre: ${proj.genre}</li>
                        <li>Favorites: ${proj.favorites}</li>
                        <li><span>Rating: 10/10</span></li>
                    </ul>
                </div>
            </div>
        </div>
        <br>
        <br>`;
        tensContainer.appendChild(projectDiv);

        if(tensId == proj.tens_id) {
            projectDiv.scrollIntoView({behavior: 'smooth'});
        }
    });

    
    
}


async function initializeTens() {
    const hash = window.location.hash.substring(1);
    displayTensProjects(hash || null);
}

initializeTens();
