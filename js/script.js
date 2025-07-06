const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');
const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "The Moon is slowly drifting away from Earth.",
  "One spoon of a neutron star would weigh about a billion tons.",
  "Saturn’s rings are made mostly of ice particles.",
  "Space is completely silent—there’s no air to carry sound.",
  "The Sun makes up 99.86% of the mass in our solar system."
];

function displayRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById('spaceFact').textContent = `🛰️ Did You Know? ${fact}`;
}

displayRandomFact(); // Call when page loads

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

  let mediaContent = '';
  if (item.media_type === 'image') {
    mediaContent = `<img src="${item.hdurl || item.url}" alt="${item.title}" />`;
  } else if (item.media_type === 'video') {
    if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
      const embedUrl = item.url.includes('embed') ? item.url : item.url.replace("watch?v=", "embed/");
      mediaContent = `
        <div class="video-container">
          <iframe src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>
      `;
    } else {
      mediaContent = `<a href="${item.url}" target="_blank">Watch the video here</a>`;
    }
  }

  modal.innerHTML = `
    <div class="modal">
      <button class="close-btn">&times;</button>
      ${mediaContent}
      <h2>${item.title}</h2>
      <p class="modal-date">${item.date}</p>
      <div class="modal-explanation">${item.explanation}</div>
    </div>
  `;

  document.body.classList.add('modal-open');
  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.remove();
    document.body.classList.remove('modal-open');
  });
}
