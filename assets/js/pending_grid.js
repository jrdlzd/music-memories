// this file is for sorting the pending projects from Supabase table "pending_projects"
// and to display the grid on pending.html

import { supabase } from "./supabaseClient.js";

let pending_projects_arr = [];

async function fetchPendingProjects() {
    console.log("starting to fetch");
    const {data, error} = await supabase
    .from('pending_projects')
    .select('*')
    .order('id', { ascending: true});

    if(error) {
        console.error("Error fetching pending projects: ", error);
        return [];
    }

    console.log("success: ", data);
    return data;
}

function displayPendingProjects(projects) {
    console.log("displaying");
    const gridContainer = document.getElementById('grid-pending');
    gridContainer.innerHTML = ''; // clear existing content

    projects.forEach(project => {
        const projectBox = document.createElement('a')
        projectBox.className = 'pending-box';
        projectBox.target = '_blank';
        projectBox.innerHTML = `
            <h2>${project.name}</h2>
            <p>${project.type} by ${project.artist}</p>
            <p>Release Date: ${project.release_date}</p>
        `;
        gridContainer.appendChild(projectBox);
    });

    console.log("finished displaying");
}

async function initializePendingGrid() {
    console.log("inside pending")
    pending_projects_arr = await fetchPendingProjects();

    //sort projects by date and append TBA dates at the end
    const sortedProjects = pending_projects_arr.filter(project => project.release_date !== 'TBA').sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    const finalArr = [...sortedProjects,...pending_projects_arr.filter(project => project.release_date === 'TBA')];

    displayPendingProjects(finalArr);
}

initializePendingGrid();