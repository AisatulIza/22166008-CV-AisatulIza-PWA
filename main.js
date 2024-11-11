document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.querySelector('.scroll-text');
    const nameText = nameElement.textContent; // Ambil teks dari elemen
    nameElement.textContent = ''; // Kosongkan teks di elemen
  
    // Pisahkan huruf menjadi array, termasuk spasi
    const letters = nameText.split('').map((letter) => {
      return letter === ' ' ? '\u00A0' : letter; // Gunakan non-breaking space untuk menjaga spasi
    });
  
    // Loop melalui huruf dan tambahkan ke elemen dengan delay
    letters.forEach((letter, index) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.classList.add('letter');
        nameElement.appendChild(span);
  
        // Setelah ditambahkan, atur opacity menjadi 1
        setTimeout(() => {
          span.style.opacity = 1;
        }, 50); // Delay kecil agar transisi terlihat
      }, index * 500); // Delay berdasarkan urutan huruf
    });
});

if (!window.indexedDB) {
  console.log('indexedDB is not supported');
} else {
  const dbPromise = indexedDB.open('kontak', 1);

  dbPromise.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('kontak', {
      keyPath: 'id',
      autoIncrement: true
    });
  };

  dbPromise.onsuccess = function(event) {
    const db = event.target.result;

    const form = document.getElementById('contact-form');

    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Mencegah submit default

      const transaction = db.transaction('kontak', 'readwrite');
      const objectStore = transaction.objectStore('kontak');

      const name = document.querySelector('input[name="name"]').value.trim();
      const email = document.querySelector('input[name="email"]').value.trim();
      const phone = document.querySelector('input[name="phone"]').value.trim();
      const subject = document.querySelector('input[name="subject"]').value.trim();
      const pessan = document.querySelector('textarea[name="pessan"]').value.trim();

      // Pastikan tidak ada field yang kosong
      if (name && email && phone && subject && pessan) {
        const pesan = {
          name,
          email,
          phone,
          subject,
          pessan
        };

        objectStore.add(pesan);

        transaction.oncomplete = function() {
          console.log('Pesan berhasil ditambahkan');
          form.reset(); // Mengosongkan form setelah berhasil
        };

        transaction.onerror = function() {
          console.error('Error saat menambahkan pesan');
        };
      } else {
        console.error('Semua field harus terisi dengan benar');
      }
    });
  };
}
// Mengambil semua link di navbar
const navLinks = document.querySelectorAll("nav ul li a");

// Menambahkan event listener untuk setiap link
navLinks.forEach(link => {
  link.addEventListener("click", function() {
    // Menghapus kelas "active" dari semua link
    navLinks.forEach(link => link.classList.remove("active"));

    // Menambahkan kelas "active" pada link yang di-klik
    this.classList.add("active");

    // Menutup toggle menu dengan menghapus centang dari checkbox
    document.getElementById("check").checked = false;
  });
});
