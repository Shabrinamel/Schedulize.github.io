let dataJadwal = [];
const urutanHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function tambahJadwal() {
    const hari = document.getElementById('hari').value;
    const jamAwal = document.getElementById('jamAwal').value;
    const jamAkhir = document.getElementById('jamAkhir').value;
    const matakuliah = document.getElementById('matakuliah').value;
    const sks = document.getElementById('sks').value;
    const kelas = document.getElementById('kelas').value;
    const gkb = document.getElementById('gkb').value;
    const ruangan = document.getElementById('ruangan').value;
    const dosen = document.getElementById('dosen').value;
    const kontakDosen = document.getElementById('kontakDosen').value;

    // Validasi data wajib diisi: Hari, Jam Awal, Jam Akhir, Mata Kuliah
    const mandatoryFields = { hari, jamAwal, jamAkhir, matakuliah };

    const emptyFields = Object.entries(mandatoryFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (emptyFields.length > 0) {
        alert(`Mohon lengkapi data: ${emptyFields.join(', ')}`);
        return;
    }

    // Validasi panjang input hari
    const hariLength = hari.length;
    if (hariLength < 4 || hariLength > 6) {
        alert('Panjang input hari minimal 4 maksimal 6 karakter.');
        return;
    }

    // Validasi panjang matakuliah
    const matakuliahLength = matakuliah.length;
    if (matakuliahLength < 2 || matakuliahLength > 50) {
        alert('Panjang input Mata Kuliah minimal 2 maksimal 50 karakter.');
        return;
    }

    // Validasi inputan opsional (hanya jika diisi)
    if (sks) {
        const sksNumber = parseInt(sks, 10);
        if (isNaN(sksNumber) || sksNumber < 1 || sksNumber > 6) {
            alert('Input SKS harus berupa angka 1 hingga 6.');
            return;
        }
    }

    if (gkb) {
        const gkbNumber = parseInt(gkb, 10);
        if (isNaN(gkbNumber) || gkbNumber < 1 || gkbNumber > 5) {
            alert('Input GKB hanya angka 1 hingga 5.');
            return;
        }
    }

    if (ruangan) {
        const ruanganLength = ruangan.length;
        if (ruanganLength < 1 || ruanganLength > 5) {
            alert('Panjang Ruangan minimal 1 maksimal 5 karakter.');
            return;
        }
    }

    if (dosen) {
        const dosenLength = dosen.length;
        if (dosenLength < 2 || dosenLength > 50) {
            alert('Panjang input dosen minimal 2 maksimal 50 karakter.');
            return;
        }
    }

    if (kontakDosen) {
        const kontakDosenLength = kontakDosen.length;
        if (kontakDosenLength < 10 || kontakDosenLength > 15) {
            alert('Panjang kontak Dosen minimal 10 maksimal 15 karakter.');
            return;
        }
    }

    // Validasi jam kuliah hanya antara pukul 07.00 - 20.45
    const jamKuliahAwal = new Date(`1970-01-01T${jamAwal}`);
    const jamKuliahAkhir = new Date(`1970-01-01T${jamAkhir}`);
    const jamMaksimalAwal = new Date("1970-01-01T07:00");
    const jamMaksimalAkhir = new Date("1970-01-01T20:45");

    if (jamKuliahAwal < jamMaksimalAwal || jamKuliahAkhir > jamMaksimalAkhir) {
        alert("Perkuliahan hanya terdapat pada pukul 07.00 - 20.45");
        return;
    }

    // Validasi bentrok ruangan, jam, dan hari yang sama
    const bentrokRuangan = dataJadwal.filter(jadwal =>
        jadwal.hari === hari && jadwal.ruangan === ruangan &&
        ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
        (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
    );

    if (bentrokRuangan.length > 0) {
        const bentrokInfo = bentrokRuangan.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}, Ruangan: ${jadwal.ruangan}`).join('\n');
        alert(`Terdapat jadwal yang bentrok terkait Ruangan - Jam - Hari pada tabel:\n${bentrokInfo}`);
        return;
    }

    // Validasi bentrok hari dan jam yang sama
    const bentrokHariJam = dataJadwal.filter(jadwal =>
        jadwal.hari === hari &&
        ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
        (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
    );

    if (bentrokHariJam.length > 0) {
        const bentrokInfo = bentrokHariJam.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}`).join('\n');
        alert(`Terdapat jadwal yang bentrok terkait Hari dan Jam pada tabel:\n${bentrokInfo}`);
        return;
    }

    // Tambah data jika semua validasi lolos
    const jadwalBaru = {
        hari, jamAwal, jamAkhir, matakuliah, sks, kelas, gkb, ruangan, dosen, kontakDosen
    };

    dataJadwal.push(jadwalBaru);
    renderTable();
    resetForm();

    alert('Jadwal berhasil ditambahkan ke tabel.');
}


function resetForm() {
    document.getElementById('form-jadwal').reset();
    document.getElementById('index-edit').value = -1;
    document.getElementById('btn-tambah').style.display = 'block';
    document.getElementById('btn-update').style.display = 'none';
}

function editJadwal(index) {
    const jadwal = dataJadwal[index];

    document.getElementById('hari').value = jadwal.hari;
    document.getElementById('jamAwal').value = jadwal.jamAwal;
    document.getElementById('jamAkhir').value = jadwal.jamAkhir;
    document.getElementById('matakuliah').value = jadwal.matakuliah;
    document.getElementById('sks').value = jadwal.sks;
    document.getElementById('kelas').value = jadwal.kelas;
    document.getElementById('gkb').value = jadwal.gkb;
    document.getElementById('ruangan').value = jadwal.ruangan;
    document.getElementById('dosen').value = jadwal.dosen;
    document.getElementById('kontakDosen').value = jadwal.kontakDosen;


    document.getElementById('index-edit').value = index;
    document.getElementById('btn-tambah').style.display = 'none';
    document.getElementById('btn-update').style.display = 'block';
}

function updateJadwal() {
    const index = document.getElementById('index-edit').value;
    const hari = document.getElementById('hari').value;
    const jamAwal = document.getElementById('jamAwal').value;
    const jamAkhir = document.getElementById('jamAkhir').value;
    const matakuliah = document.getElementById('matakuliah').value;
    const sks = document.getElementById('sks').value;
    const kelas = document.getElementById('kelas').value;
    const gkb = document.getElementById('gkb').value;
    const ruangan = document.getElementById('ruangan').value;
    const dosen = document.getElementById('dosen').value;
    const kontakDosen = document.getElementById('kontakDosen').value;

    // Validasi data wajib diisi: Hari, Jam Awal, Jam Akhir, Mata Kuliah
    if (!hari || !jamAwal || !jamAkhir || !matakuliah) {
        alert("Mohon lengkapi data yang wajib: Hari, Jam Awal, Jam Akhir, Mata Kuliah");
        return;
    }

    // Validasi panjang input hari
    const hariLength = hari.length;
    if (hariLength < 4 || hariLength > 6) {
        alert('Panjang input hari minimal 4 maksimal 6 karakter.');
        return;
    }

    // Validasi panjang matakuliah
    const matakuliahLength = matakuliah.length;
    if (matakuliahLength < 2 || matakuliahLength > 50) {
        alert('Panjang input Mata Kuliah minimal 2 maksimal 50 karakter.');
        return;
    }

    // Validasi inputan opsional (hanya jika diisi)
    if (sks) {
        const sksNumber = parseInt(sks, 10);
        if (isNaN(sksNumber) || sksNumber < 1 || sksNumber > 6) {
            alert('Input SKS harus berupa angka 1 hingga 6.');
            return;
        }
    }

    if (gkb) {
        const gkbNumber = parseInt(gkb, 10);
        if (isNaN(gkbNumber) || gkbNumber < 1 || gkbNumber > 5) {
            alert('Input GKB hanya angka 1 hingga 5.');
            return;
        }
    }

    if (ruangan) {
        const ruanganLength = ruangan.length;
        if (ruanganLength < 1 || ruanganLength > 5) {
            alert('Panjang Ruangan minimal 1 maksimal 5 karakter.');
            return;
        }
    }

    if (dosen) {
        const dosenLength = dosen.length;
        if (dosenLength < 2 || dosenLength > 50) {
            alert('Panjang input dosen minimal 2 maksimal 50 karakter.');
            return;
        }
    }

    if (kontakDosen) {
        const kontakDosenLength = kontakDosen.length;
        if (kontakDosenLength < 10 || kontakDosenLength > 15) {
            alert('Panjang kontak Dosen minimal 10 maksimal 15 karakter.');
            return;
        }
    }

    // Validasi jam kuliah hanya antara pukul 07.00 - 20.45
    const jamKuliahAwal = new Date(`1970-01-01T${jamAwal}`);
    const jamKuliahAkhir = new Date(`1970-01-01T${jamAkhir}`);
    const jamMaksimalAwal = new Date("1970-01-01T07:00");
    const jamMaksimalAkhir = new Date("1970-01-01T20:45");

    if (jamKuliahAwal < jamMaksimalAwal || jamKuliahAkhir > jamMaksimalAkhir) {
        alert("Perkuliahan hanya terdapat pada pukul 07.00 - 20.45");
        return;
    }

    // Ambil jadwal yang sedang di-update
    const jadwalLama = dataJadwal[index];

    // Cek apakah jam, hari, atau ruangan berubah
    const isJamHariRuanganBerubah = jadwalLama.hari !== hari || jadwalLama.jamAwal !== jamAwal || jadwalLama.jamAkhir !== jamAkhir || jadwalLama.ruangan !== ruangan;

    // Validasi bentrok ruangan, jam, dan hari yang sama jika terjadi perubahan
    if (isJamHariRuanganBerubah) {
        const bentrokRuangan = dataJadwal.filter((jadwal, i) =>
            i !== index && // Jangan validasi terhadap diri sendiri
            jadwal.hari === hari && jadwal.ruangan === ruangan &&
            ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
            (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
        );

        if (bentrokRuangan.length > 0) {
            const bentrokInfo = bentrokRuangan.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}, Ruangan: ${jadwal.ruangan}`).join('\n');
            alert(`Terdapat jadwal yang bentrok terkait Ruangan - Jam - Hari pada tabel:\n${bentrokInfo}`);
            return;
        }

        // Validasi bentrok hari dan jam yang sama
        const bentrokHariJam = dataJadwal.filter((jadwal, i) =>
            i !== index && // Jangan validasi terhadap diri sendiri
            jadwal.hari === hari &&
            ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
            (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
        );

        if (bentrokHariJam.length > 0) {
            const bentrokInfo = bentrokHariJam.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}`).join('\n');
            alert(`Terdapat jadwal yang bentrok terkait Hari dan Jam pada tabel:\n${bentrokInfo}`);
            return;
        }
    }

    // Update data jika semua validasi lolos
    dataJadwal[index] = { hari, jamAwal, jamAkhir, matakuliah, sks, kelas, gkb, ruangan, dosen, kontakDosen };
    renderTable();
    resetForm();

    alert('Jadwal berhasil di update.');
}



function hapusJadwal(index) {
    dataJadwal.splice(index, 1);
    renderTable();

    alert('Jadwal berhasil di hapus.');
}

function renderTable() {
    dataJadwal.sort((a, b) => {
        const hariA = urutanHari.indexOf(a.hari);
        const hariB = urutanHari.indexOf(b.hari);
        if (hariA !== hariB) return hariA - hariB;
        return a.jamAwal.localeCompare(b.jamAwal);
    });

    const tableBody = document.getElementById('jadwal-body');
    tableBody.innerHTML = ''; // Reset tabel

    dataJadwal.forEach((jadwal, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = jadwal.warna; // Set warna baris
        row.style.color = jadwal.warnaTeks;  // Set warna teks

        row.innerHTML = `
            <td>${jadwal.hari}</td>
            <td>${jadwal.jamAwal} - ${jadwal.jamAkhir}</td>
            <td>${jadwal.matakuliah}</td>
            <td>${jadwal.sks}</td>            
            <td>${jadwal.kelas}</td>
            <td>${jadwal.gkb}</td>
            <td>${jadwal.ruangan}</td>
            <td>${jadwal.dosen}</td>
            <td>${jadwal.kontakDosen}</td>            
        `;

        // Add click event listener to the row
        row.onclick = function() {
            showFloatingOptions(event, index);
        };

        tableBody.appendChild(row);
    });
}

function showFloatingOptions(event, index) {
    const optionsContainer = document.getElementById('floating-options');
    optionsContainer.style.display = 'block';
    optionsContainer.style.left = `${event.clientX}px`;
    optionsContainer.style.top = `${event.clientY}px`;

    // Set up actions for the options
    document.getElementById('btn-edit').onclick = function() {
        editJadwal(index);
        optionsContainer.style.display = 'none'; // Hide options after action
    };

    document.getElementById('btn-delete').onclick = function() {
        hapusJadwal(index);
        optionsContainer.style.display = 'none'; // Hide options after action
    };
}


function exportAsImage() {

    // Periksa apakah dataJadwal kosong
    if (dataJadwal.length === 0) {
        alert("Tidak ada data untuk diunduh sebagai gambar.");
        return; // Keluar dari fungsi jika tidak ada data
    }

    const tableElement = document.getElementById('jadwal-table');
    tableElement.style.backgroundColor = '#ffffff';
    
    html2canvas(tableElement, {
        onrendered: function (canvas) {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'jadwal_kuliah.png';
            link.click();
        },
        background: '#fff' // Untuk memastikan latar belakang gambar berwarna putih
    });

    alert('Jadwal berhasil di download sebagai gambar.');
}


document.addEventListener('click', function(event) {
    const optionsContainer = document.getElementById('floating-options');
    if (!optionsContainer.contains(event.target) && !event.target.closest('#jadwal-body')) {
        optionsContainer.style.display = 'none'; // Hide options when clicking outside
    }
});

document.getElementById('kelas').addEventListener('input', function () {
    const inputKelas = this.value.toUpperCase(); // Mengubah input ke huruf besar
    if (!inputKelas.match(/^[A-N]?$/)) {
        alert('Kelas terdiri dari A hingga N.');
        this.value = ''; // Reset input jika tidak valid
    } else {
        this.value = inputKelas; // Mengisi input dengan huruf yang valid
    }
});