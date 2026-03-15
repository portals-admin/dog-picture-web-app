const API_URL = 'https://dog.ceo/api/breeds/image/random';

const dogImage  = document.getElementById('dog-image');
const dogBreed  = document.getElementById('dog-breed');
const fetchBtn  = document.getElementById('fetch-btn');
const skeleton  = document.getElementById('skeleton');
const errorMsg  = document.getElementById('error-msg');

/**
 * Extract a readable breed name from a Dog CEO image URL.
 * URL format: https://images.dog.ceo/breeds/<breed>[-<sub>]/<file>
 */
function breedFromUrl(url) {
  try {
    const parts = new URL(url).pathname.split('/');
    const breedSegment = parts[2] ?? '';
    return breedSegment.replace(/-/g, ' ') || 'Unknown breed';
  } catch {
    return 'Unknown breed';
  }
}

function setLoading(loading) {
  fetchBtn.disabled = loading;
  skeleton.classList.toggle('hidden', !loading);
  if (loading) {
    dogImage.classList.remove('loaded');
    errorMsg.classList.add('hidden');
  }
}

async function fetchDog() {
  setLoading(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.status !== 'success') throw new Error('API error');

    const imageUrl = data.message;

    await new Promise((resolve, reject) => {
      dogImage.onload  = resolve;
      dogImage.onerror = reject;
      dogImage.src = imageUrl;
      dogImage.alt = `A cute ${breedFromUrl(imageUrl)}`;
    });

    dogImage.classList.add('loaded');
    dogBreed.textContent = breedFromUrl(imageUrl);
  } catch (err) {
    console.error('Failed to fetch dog image:', err);
    errorMsg.classList.remove('hidden');
    dogBreed.textContent = '—';
  } finally {
    setLoading(false);
    skeleton.classList.add('hidden');
  }
}

fetchBtn.addEventListener('click', fetchDog);

// Load a dog on page start
fetchDog();
