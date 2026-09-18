// ================================
// DATA PRODUK KANTIN
// ================================

const produk = {

    "8991002100010": {
        nama: "Indomie Goreng",
        harga: 3500
    },

    "8991002100027": {
        nama: "Indomie Soto",
        harga: 3500
    },

    "8991002100034": {
        nama: "Teh Botol",
        harga: 4000
    },

    "8991002100041": {
        nama: "Aqua 600ml",
        harga: 3000
    },

    "8991002100058": {
        nama: "Chitato",
        harga: 5000
    },

    "8991002100065": {
        nama: "Oreo",
        harga: 4000
    }

};


// ================================
// VARIABEL
// ================================

let produkDipilih = null;
let keranjang = [];

let scanner = null;
let sedangScan = false;



// ================================
// FORMAT RUPIAH
// ================================

function rupiah(angka) {

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(angka);

}


// ================================
// CARI BARCODE
// ================================  

function cariBarcode() {

    const barcode = document
        .getElementById("barcodeInput")
        .value
        .trim();

    if (!barcode) {
        alert("Masukkan barcode terlebih dahulu.");
        return;
    }

    cariProduk(barcode);
}


// ================================
// CARI PRODUK
// ================================

function cariProduk(barcode) {

    const info = produk[barcode];

    const produkInfo = document.getElementById("produkInfo");
    const tambahButton = document.getElementById("tambahButton");

    if (!info) {

        produkDipilih = null;

        produkInfo.innerHTML = `
            <p style="color:red;">
                ❌ Produk dengan barcode
                <b>${barcode}</b> tidak ditemukan.
            </p>
        `;

        tambahButton.disabled = true;

        return;
    }

    produkDipilih = {
        barcode: barcode,
        nama: info.nama,
        harga: info.harga
    };

    produkInfo.innerHTML = `
        <div class="nama-produk">
            ${info.nama}
        </div>

        <div class="harga-produk">
            ${rupiah(info.harga)}
        </div>

        <small>Barcode: ${barcode}</small>
    `;

    tambahButton.disabled = false;
}


// ================================
// TAMBAH KE KERANJANG
// ================================

function tambahKeranjang() {

    if (!produkDipilih) {
        return;
    }

    const item = keranjang.find(
        x => x.barcode === produkDipilih.barcode
    );

    if (item) {

        item.qty++;

    } else {

        keranjang.push({
            barcode: produkDipilih.barcode,
            nama: produkDipilih.nama,
            harga: produkDipilih.harga,
            qty: 1
        });

    }

    tampilkanKeranjang();

}


// ================================
// TAMPILKAN KERANJANG
// ================================

function tampilkanKeranjang() {

    const container =
        document.getElementById("keranjang");

    const totalElement =
        document.getElementById("totalHarga");

    if (keranjang.length === 0) {

        container.innerHTML = `
            <p class="kosong">
                Keranjang masih kosong.
            </p>
        `;

        totalElement.textContent = "Rp0";

        return;
    }

    let total = 0;

    container.innerHTML = "";

    keranjang.forEach((item, index) => {

        const subtotal =
            item.harga * item.qty;

        total += subtotal;

        container.innerHTML += `

            <div class="item">

                <div class="item-info">

                    <div class="item-name">
                        ${item.nama}
                    </div>

                    <div class="item-price">
                        ${rupiah(item.harga)}
                        × ${item.qty}
                    </div>

                </div>

                <div class="qty">

                    <button onclick="kurangi(${index})">
                        −
                    </button>

                    <b>${item.qty}</b>

                    <button onclick="tambah(${index})">
                        +
                    </button>

                </div>

            </div>

        `;
    });

    totalElement.textContent = rupiah(total);
}


// ================================
// TAMBAH QTY
// ================================

function tambah(index) {

    keranjang[index].qty++;

    tampilkanKeranjang();
}


// ================================
// KURANGI QTY
// ================================

function kurangi(index) {

    keranjang[index].qty--;

    if (keranjang[index].qty <= 0) {

        keranjang.splice(index, 1);

    }

    tampilkanKeranjang();
}


// ================================
// KOSONGKAN KERANJANG
// ================================

function kosongkanKeranjang() {

    if (keranjang.length === 0) {
        return;
    }

    if (confirm("Kosongkan semua keranjang?")) {

        keranjang = [];

        tampilkanKeranjang();
    }
}


// ================================
// BAYAR
// ================================

function bayar() {

    if (keranjang.length === 0) {

        alert("Keranjang masih kosong.");

        return;
    }

    let total = 0;

    keranjang.forEach(item => {

        total += item.harga * item.qty;

    });

    const uang = prompt(
        `Total belanja: ${rupiah(total)}\n\nMasukkan uang pelanggan:`
    );

    if (uang === null) {
        return;
    }

    const pembayaran =
        parseInt(uang.replace(/\D/g, ""));

    if (isNaN(pembayaran)) {

        alert("Nominal tidak valid.");

        return;
    }

    if (pembayaran < total) {

        alert(
            `Uang kurang ${rupiah(total - pembayaran)}`
        );

        return;
    }

    const kembalian =
        pembayaran - total;

    alert(
        "Pembayaran berhasil!\n\n" +
        "Total: " + rupiah(total) + "\n" +
        "Bayar: " + rupiah(pembayaran) + "\n" +
        "Kembalian: " + rupiah(kembalian)
    );

    keranjang = [];

    tampilkanKeranjang();
}


// ================================
// SCANNER BARCODE
// ================================

function mulaiScan() {

    if (sedangScan) {
        return;
    }

    scanner = new Html5Qrcode("reader");

    const config = {
        fps: 10,
        qrbox: {
            width: 250,
            height: 150
        }
    };

    scanner.start(

        {
            facingMode: "environment"
        },

        config,

        (decodedText) => {

            document.getElementById(
                "barcodeInput"
            ).value = decodedText;

            document.getElementById(
                "scanStatus"
            ).textContent =
                "Barcode berhasil dibaca: " + decodedText;

            cariProduk(decodedText);

            hentikanScan();

        },

        (errorMessage) => {

            // Tidak perlu menampilkan error
            // karena scanner terus mencari barcode

        }

    ).then(() => {

        sedangScan = true;

        document.getElementById(
            "scanStatus"
        ).textContent =
            "Arahkan kamera ke barcode jajanan.";

    }).catch((error) => {

        alert(
            "Kamera tidak bisa digunakan.\n\n" +
            "Pastikan izin kamera sudah diberikan."
        );

    });
}


// ================================
// HENTIKAN SCANNER
// ================================

function hentikanScan() {

    if (!scanner || !sedangScan) {
        return;
    }

    scanner.stop().then(() => {

        scanner.clear();

        sedangScan = false;

    });

}


// ================================
// LOAD
// ================================

tampilkanKeranjang();
