let dataJadwal = [];
const urutanHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function resetForm() {
    document.getElementById('form-jadwal').reset();
    document.getElementById('index-edit').value = -1;
    document.getElementById('btn-tambah').style.display = 'block';
    document.getElementById('btn-update').style.display = 'none';
}

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

    // Validasi data yang tidak boleh kosong kecuali kontak dosen dan warna
    const inputFields = {
        hari,
        jamAwal,
        jamAkhir,
        matakuliah,
        sks,
        kelas,
        gkb,
        ruangan,
        dosen,
    };

    const emptyFields = Object.entries(inputFields)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (emptyFields.length > 0) {
        alert(`Mohon lengkapi data: ${emptyFields.join(', ')}`);
        return;
    }

    const jamKuliahAwal = new Date(`1970-01-01T${jamAwal}`);
    const jamKuliahAkhir = new Date(`1970-01-01T${jamAkhir}`);
    const jamMaksimalAwal = new Date("1970-01-01T07:00");
    const jamMaksimalAkhir = new Date("1970-01-01T20:45");

    if (jamKuliahAwal < jamMaksimalAwal || jamKuliahAkhir > jamMaksimalAkhir) {
        alert("Perkuliahan hanya terdapat pada pukul 07.00 - 20.45");
        return;
    }

    // bentrok ruangan, jam, dan hari yang sama
    const bentrokRuangan = dataJadwal.filter(jadwal =>
        jadwal.hari === hari && jadwal.ruangan === ruangan && jadwal.gkb === gkb &&
        ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
        (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
    );

    if (bentrokRuangan.length > 0) {
        const bentrokInfo = bentrokRuangan.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}, Ruangan: ${jadwal.ruangan}, GKB : ${jadwal.gkb}`).join('\n');
        alert(`Terdapat jadwal yang bentrok terkait Ruangan - Jam - Hari pada tabel:\n${bentrokInfo}`);
        return;
    }

    // bentrok hari dan jam yang sama
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

    const jadwalBaru = {
        hari, jamAwal, jamAkhir, matakuliah, sks, kelas, gkb, ruangan, dosen, kontakDosen
    };

    dataJadwal.push(jadwalBaru);
    renderTable();
    resetForm();
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

    if (!hari || !jamAwal || !jamAkhir || !matakuliah || !sks || !kelas || !gkb || !ruangan|| !dosen ) {
        alert("Mohon lengkapi data");
        return;
    }

    const jamKuliahAwal = new Date(`1970-01-01T${jamAwal}`);
    const jamKuliahAkhir = new Date(`1970-01-01T${jamAkhir}`);
    const jamMaksimalAwal = new Date("1970-01-01T07:00");
    const jamMaksimalAkhir = new Date("1970-01-01T20:45");

    if (jamKuliahAwal < jamMaksimalAwal || jamKuliahAkhir > jamMaksimalAkhir) {
        alert("Perkuliahan hanya terdapat pada pukul 07.00 - 20.45");
        return;
    }

    const jadwalLama = dataJadwal[index];

    const isJamHariRuanganBerubah = jadwalLama.hari !== hari || jadwalLama.jamAwal !== jamAwal || jadwalLama.jamAkhir !== jamAkhir || jadwalLama.ruangan !== ruangan;

    if (isJamHariRuanganBerubah) {
        const bentrokRuangan = dataJadwal.filter((jadwal, i) =>
            i !== index && 
            jadwal.hari === hari && jadwal.ruangan === ruangan &&
            ((jamAwal >= jadwal.jamAwal && jamAwal < jadwal.jamAkhir) ||
            (jamAkhir > jadwal.jamAwal && jamAkhir <= jadwal.jamAkhir))
        );

        if (bentrokRuangan.length > 0) {
            const bentrokInfo = bentrokRuangan.map(jadwal => `Hari: ${jadwal.hari}, Jam: ${jadwal.jamAwal} - ${jadwal.jamAkhir}, Matakuliah: ${jadwal.matakuliah}, Ruangan: ${jadwal.ruangan}`).join('\n');
            alert(`Terdapat jadwal yang bentrok terkait Ruangan - Jam - Hari pada tabel:\n${bentrokInfo}`);
            return;
        }

        const bentrokHariJam = dataJadwal.filter((jadwal, i) =>
            i !== index && 
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

    dataJadwal[index] = { hari, jamAwal, jamAkhir, matakuliah, sks, kelas, gkb, ruangan, dosen, kontakDosen};
    renderTable();
    resetForm();
}

function hapusJadwal(index) {
    dataJadwal.splice(index, 1);
    renderTable();
}

function renderTable() {
    dataJadwal.sort((a, b) => {
        const hariA = urutanHari.indexOf(a.hari);
        const hariB = urutanHari.indexOf(b.hari);
        if (hariA !== hariB) return hariA - hariB;
        return a.jamAwal.localeCompare(b.jamAwal);
    });

    const tableBody = document.getElementById('jadwal-body');
    tableBody.innerHTML = ''; 

    dataJadwal.forEach((jadwal, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = jadwal.warna;
        row.style.color = jadwal.warnaTeks;  

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

    document.getElementById('btn-edit').onclick = function() {
        editJadwal(index);
        optionsContainer.style.display = 'none'; 
    };

    document.getElementById('btn-delete').onclick = function() {
        hapusJadwal(index);
        optionsContainer.style.display = 'none';
    };
}


function exportAsImage() {

    if (dataJadwal.length === 0) {
        alert("Tidak ada data untuk diunduh sebagai gambar.");
        return;
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
    });

    setTimeout(() => {
        tableElement.style.backgroundColor = '';
    }, 1000);
}

document.addEventListener('click', function(event) {
    const optionsContainer = document.getElementById('floating-options');
    if (!optionsContainer.contains(event.target) && !event.target.closest('#jadwal-body')) {
        optionsContainer.style.display = 'none'; 
    }
});
