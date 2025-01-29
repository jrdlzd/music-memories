// project.js
// Get the project ID from the URL parameters

import { supabase } from "./supabaseClient.js";
console.log("inside project.js");
const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    console.log("Project ID: ", projectId);

    // fetch music project from supabase
    //const project = projects.find(p => p.id === parseInt(projectId)); //old fetch from projects.js

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
    
    if(error) {
        console.error("Error fetching project: ", error);
        //return;
    }

    if(project) {
        document.getElementById('doc_title').innerText = `Music Memories - ${project.title}`;
        document.getElementById('title').innerText = project.title;
        document.getElementById('artist').innerText = `${project.type} by ${project.artist}`;
        document.getElementById('inner_title').innerText = `"${project.title}" - ${project.artist}`;
        //document.getElementById('inner_artist').innerText = `Artist: ${project.artist}`;
        document.getElementById('type').innerHTML = `<strong>Type:</strong> ${project.type}`;
        document.getElementById('genre').innerHTML = `<strong>Genre:</strong> ${project.genre}`;
        document.getElementById('release_date').innerHTML = `<strong>Released</strong> ${project.release_date}`;
        document.getElementById('rating').innerHTML = `<strong>Rating:</strong> ${project.rating}/10`;

        if(project.thoughts)
            document.getElementById('thoughts').innerText = project.thoughts;

        document.getElementById('favorites').innerHTML = `<strong>Favorites:</strong> ${project.favorites}`
        document.getElementById('project-spotify-embed').innerHTML = `
            <iframe
                style="border-radius:12px"
                src="https://open.spotify.com/embed/album/${project.spotify_id}?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
            </iframe>
        `;
    }
    else {
        console.error("Project not found.");
    }







/*document.addEventListener("DOMContentLoaded", async function() {

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    console.log("Project ID: ", projectId);

    // fetch music project from supabase
    //const project = projects.find(p => p.id === parseInt(projectId)); //old fetch from projects.js

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
    
    if(error) {
        console.error("Error fetching project: ", error);
        return;
    }

    if(project) {
        document.getElementById('doc_title').innerText = `Music Memories - ${project.title}`;
        document.getElementById('title').innerText = project.title;
        document.getElementById('artist').innerText = `${project.type} by ${project.artist}`;
        document.getElementById('inner_title').innerText = `"${project.title}" - ${project.artist}`;
        //document.getElementById('inner_artist').innerText = `Artist: ${project.artist}`;
        document.getElementById('type').innerHTML = `<strong>Type:</strong> ${project.type}`;
        document.getElementById('genre').innerHTML = `<strong>Genre:</strong> ${project.genre}`;
        document.getElementById('release_date').innerHTML = `<strong>Released</strong> ${project.release_date}`;
        document.getElementById('rating').innerHTML = `<strong>Rating:</strong> ${project.rating}/10`;

        if(project.thoughts)
            document.getElementById('thoughts').innerText = project.thoughts;

        document.getElementById('favorites').innerHTML = `<strong>Favorites:</strong> ${project.favorites}`
        document.getElementById('project-spotify-embed').innerHTML = `
            <iframe
                style="border-radius:12px"
                src="https://open.spotify.com/embed/album/${project.spotify_id}?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
            </iframe>
        `;
    }
    else {
        console.error("Project not found.");
    }
}); */