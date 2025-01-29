//for featured on index.html
//displays featured project from supabase table "featured"
import { supabase } from "./supabaseClient.js";

async function fetchFeatured() {
    const {data, error} = await supabase.from('featured').select('*').order('id', { ascending: false }).limit(1);
    if(error) {
        console.error("Error fetching featured project: ", error);
        return [];
    }

    console.log("Success fetching featured ", data[0]);
    return data[0];
}

async function displayFeatured() {
    const featuredContainer = document.getElementById('featured');
    featuredContainer.innerHTML = '';

    const featuredProject = await fetchFeatured();
    
    featuredContainer.innerHTML = `
    <div class="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
            <h3>${featuredProject.title} - ${featuredProject.artist}</h3>
            <p>
              ${featuredProject.thoughts}
            </p>
            <ul>
              <li><span>Released ${featuredProject.release_date}</span></li>
              <li><span>Rating: ${featuredProject.rating}/10</span></li>
              <li><span>Favorites: ${featuredProject.favorites}</span></li>
            </ul>
        </div>
        <div class="col-lg-6" data-aos="fade-up" data-aos-delay="200">
            <iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/${featuredProject.spotify_id}?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
    `;
}

displayFeatured()