const d = document, w = window

const encryptAES = (text, key) => CryptoJS.AES.encrypt(text, key).toString()
const decryptAES = (encryptedBase64, key) => CryptoJS.AES.decrypt(encryptedBase64, key).toString(CryptoJS.enc.Utf8)
const sha256 = (text) => CryptoJS.SHA256(text).toString()

// #region -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- HOMEPAGE
d.querySelector('#main .get-started button').onclick = () => {
    var [startButton, enterUsername] = [d.querySelector('#main .get-started .start'), d.querySelector('#main .get-started .enter-username')],
        usernameInput = enterUsername.querySelector('input'), ok = enterUsername.querySelector('.ok')
    startButton.remove()
    enterUsername.style.display = 'flex'; enterUsername.querySelector('input').focus()
    setTimeout(() => enterUsername.style.width = 'min(20em,100%)', 1)
    usernameInput.onkeypress = ({ key }) => { if (key == 'Enter') ok.click() }
    usernameInput.oninput = ({ target }) => { target.value = target.value.substring(0, 32) }
    ok.onclick = ({ target }) => {
        target.focus()
        localStorage.setItem('token', sha256(crypto.getRandomValues(new Uint8Array(1024)).toString()))
        localStorage.setItem('user', JSON.stringify({ name: usernameInput.value, avatar: null }))
        d.getElementById('app').style.display = 'flex'
        setTimeout(() => d.getElementById('app').style = 'display: flex; opacity: 1; transform: translateY(0) scale(100%)', 1)
        setTimeout(() => d.getElementById('main').style.display = 'none' , 300)
    }
}
// #endregion  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */


// #region -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- APP 
/*
app
    channels
        nav
            menu
            chat
        list
        search
    content
*/
app = d.getElementById('app')
Object.assign(app, { channels: app.querySelector('aside:first-of-type'), content: app.querySelector('main:first-of-type') })
Object.assign(app.channels, { nav: app.channels.querySelector('nav'), list: app.channels.querySelector('.list'), search: app.channels.querySelector('.search') })
Object.assign(app.channels.nav, { menu: app.channels.nav.querySelector('.button-menu'), chat: app.channels.nav.querySelector('.button-chat') })

//menu popup
app.channels.nav.menu.querySelector('span').onclick = ({ target }) => {
    var popup = app.channels.nav.menu.querySelector('.popup div'),
        onfocusout = (e) => {
            if (!([popup, app.channels.nav.menu]).includes(e?.target.closest('div'))) {
                popup.style = 'transform: scale(0.5); opacity: 0', target.closest('span').style.filter = ''; d.removeEventListener('mousedown', onfocusout, true) }
        }
    target.closest('span').style.filter = 'brightness(140%)'
    if (!parseInt(popup.style.opacity)) { popup.style = 'transform: scale(1); opacity: 1'; d.addEventListener('mousedown', onfocusout, true) }
    else onfocusout()
    
}
// #endregion  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */


w.onload = async () => {
    var token = localStorage.getItem('token'),
        user = localStorage.getItem('user')

    d.getElementById('main').style.display = 'block'
    d.querySelector('#initial-loading').style = 'opacity: 0'
    d.querySelector('#initial-loading span').style = 'transform: translateY(.25em)'
    d.querySelector('#initial-loading .loader').style = 'width: 100px'
    setTimeout(() => d.querySelector('#initial-loading').remove(), 300)
}