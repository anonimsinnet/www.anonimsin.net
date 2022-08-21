const d = document, w = window

const encryptAES = (text, key) => CryptoJS.AES.encrypt(text, key).toString()
const decryptAES = (encryptedBase64, key) => CryptoJS.AES.decrypt(encryptedBase64, key).toString(CryptoJS.enc.Utf8)



d.querySelector('#main .get-started button').onclick = () => {
    d.querySelector('#main').style = 'opacity: 0; transform: translateY(10px)'
    setTimeout(() => { d.querySelector('#main').style.display = 'none' }, 300)
}

w.onload = () => {
    d.querySelector('#initial-loading').style = 'opacity: 0'
    d.querySelector('#initial-loading span').style = 'transform: translateY(.25em)'
    d.querySelector('#initial-loading .loader').style = 'width: 100px'
    setTimeout(() => { d.querySelector('#initial-loading').remove() }, 300)
}