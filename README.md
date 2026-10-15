<p align="center">
<img src='public/icons2/icons8-tiktok-ink-120.png' alt='hero'>
<h1 align="center">TIKTOK DOWNLOADER</h1>
</p>

# Tiktok Downloader
TikTok Downloader is a simple repo for downloading videos from TikTok. With this it allows you to download TikTok videos easily using the video URL.

## Features

- Download TikTok videos using a URL.
- Save videos in MP4 format.
- User-friendly and easy to use.

## Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/irwanx/tiktok-downloader.git
    cd tiktok-downloader
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Run the application:

    ```bash
    npm start
    ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Installation on Vercel

You can deploy this TikTok Downloader directly to Vercel without using the CLI by following these steps:

1. Fork this repository to your GitHub account.
2. Sign in to Vercel using your GitHub account at [vercel.com](https://vercel.com/signup).
3. Click on the "Import Project" button.
4. Choose the repository you forked in step 1.
5. Configure the settings as per your requirements.
6. Click "Deploy" to deploy your TikTok Downloader app to Vercel.

## Usage

Once deployed, you can access the TikTok Downloader by navigating to the URL provided by Vercel for your deployed project.

## Preview

<img src="public/img.png">

## License

This project is licensed under the [MIT](LICENSE) license.

## Contributions
Contributions are very welcome! Please fork this repository and create a pull request with the proposed changes.

## Contact

If you have any questions or concerns, please open an issue or contact me at instagram [@abcdefuceek](https://instagram.com/abcdefuceek).

## API untuk bot Telegram / WhatsApp

Proyek ini menyediakan endpoint Vercel `GET /api/tiktok` untuk mengambil metadata/link video TikTok dan dapat dipanggil dari bot Telegram atau WhatsApp.

### 1. Pasang API key di Vercel
Buka **Vercel → Project → Settings → Environment Variables**, tambahkan:
- `API_KEY` = buat secret acak milik Anda sendiri (jangan bagikan di kode frontend)
Lalu lakukan **Redeploy**. Endpoint akan menolak request tanpa key.

### 2. Endpoint
`GET https://DOMAIN-ANDA.vercel.app/api/tiktok?url=URL_TIKTOK`

Header autentikasi:
`x-api-key: API_KEY_ANDA`

Contoh cURL:
```bash
curl -G 'https://DOMAIN-ANDA.vercel.app/api/tiktok' \
  --data-urlencode 'url=https://www.tiktok.com/@user/video/123456789' \
  -H 'x-api-key: API_KEY_ANDA'
```

Bisa juga menggunakan `Authorization: Bearer API_KEY_ANDA`. Respons sukses mengikuti format layanan upstream, umumnya berisi `code`, `msg`, dan `data` (termasuk link video jika disediakan oleh upstream).

### 3. Contoh Node.js untuk bot
```js
async function getTikTok(url) {
  const response = await fetch(
    `${process.env.TIKTOK_API_URL}?url=${encodeURIComponent(url)}`,
    { headers: { 'x-api-key': process.env.TIKTOK_API_KEY } }
  );
  const result = await response.json();
  if (!response.ok || result.code !== 0) {
    throw new Error(result.msg || `HTTP ${response.status}`);
  }
  return result.data;
}
```

Atur environment bot:
```env
TIKTOK_API_URL=https://DOMAIN-ANDA.vercel.app/api/tiktok
TIKTOK_API_KEY=API_KEY_ANDA
```

**Catatan:** endpoint ini mem-proxy layanan upstream pihak ketiga. API key mengamankan endpoint Anda, tetapi tidak menjamin upstream selalu tersedia atau bebas dari rate limit/403. Jangan menaruh API key di React/browser; gunakan hanya di server bot. Pastikan penggunaan sesuai ketentuan TikTok dan hak pemilik konten.
