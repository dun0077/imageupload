let githubUser = 'dun0077'
let repo = 'imageupload'
let imgFolder = 'images'

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // เข้ารหัส username และ password เป็น MD5
    const usernameMD5 = CryptoJS.MD5(username).toString();
    const passwordMD5 = CryptoJS.MD5(password).toString();

    console.log(usernameMD5)
    console.log(passwordMD5)

    const response = await fetch('https://script.google.com/macros/s/AKfycbzY7X62FgUOyQOHw8_6C6_ojo0DIsrrZv3CZcTEWEF58J57k8ZL_DWPj8EhR5Mf5FVe/exec');
    const users = await response.json();

    const user = users.find(u => u['ชื่อผู้ใช้'] === usernameMD5 && u['รหัสผ่าน'] === passwordMD5);

    if (user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('album-container').style.display = 'block';
        loadAlbums(username);
    } else {
        alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
}

async function loadAlbums(username) {
    const response = await fetch(`https://api.github.com/repos/${githubUser}/${repo}/contents/${username}`);
    const albums = await response.json();

    const albumsContainer = document.getElementById('albums');
    albumsContainer.innerHTML = '';

    albums.forEach(album => {
        if (album.type === 'dir') {
            loadAlbum(username, album.name);
        }
    });
}

async function loadAlbum(username, albumName) {
    const response = await fetch(`https://api.github.com/repos/${githubUser}/${repo}/contents/${username}/${albumName}`);
    const images = await response.json();

    const albumContainer = document.createElement('div');
    albumContainer.className = 'album';

    const albumTitle = document.createElement('h3');
    albumTitle.textContent = albumName;
    albumContainer.appendChild(albumTitle);

    images.forEach(image => {
        if (image.name.endsWith('.jpg') || image.name.endsWith('.png') || image.name.endsWith('.gif')) {
            const img = document.createElement('img');
            img.src = image.download_url;
            albumContainer.appendChild(img);

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'คัดลอกลิ้งค์';
            copyButton.onclick = () => copyToClipboard(image.download_url);
            albumContainer.appendChild(copyButton);
        }
    });

    document.getElementById('albums').appendChild(albumContainer);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('ลิ้งค์รูปภาพถูกคัดลอกแล้ว');
    }).catch(err => {
        alert('ไม่สามารถคัดลอกลิ้งค์รูปภาพได้');
    });
}
