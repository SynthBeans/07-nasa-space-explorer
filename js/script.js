const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Call date setup function from dateRange.js
setupDateInputs(startInput, endInput);

button.addEventListener('click', async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Clear existing gallery & show loading message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos...</p>
    </div>
  `;

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=kCpAHIkMds2hQIOkLqax23v54WuwX7TsumBagtOH&start_date=${startDate}&end_date=${endDate}`
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      gallery.innerHTML = `<p>Error: ${data.error?.message || "Invalid response."}</p>`;
      return;
    }

    renderGallery(data);
  } catch (error) {
    gallery.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
});

function renderGallery(images) {
  gallery.innerHTML = ''; // Clear loading message

  images.reverse().forEach(item => {
    if (item.media_type !== 'image') return; // Skip videos

    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.innerHTML = `
      <img src="${item.url}" alt="${item.title}" />
      <p><strong>${item.title}</strong><br>${item.date}</p>
    `;

    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}

// Modal logic
function openModal(item) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="close-btn">&times;</button>
      <img src="${item.hdurl || item.url}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p><em>${item.date}</em></p>
      <p>${item.explanation}</p>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
}
