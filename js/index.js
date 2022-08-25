const d = document, w = window
var search = new URLSearchParams(window.location.search)

const encryptAES = (text, key) => CryptoJS.AES.encrypt(text, key).toString()
const decryptAES = (encryptedBase64, key) => CryptoJS.AES.decrypt(encryptedBase64, key).toString(CryptoJS.enc.Utf8)
const sha256 = (text) => CryptoJS.SHA256(text).toString()

// #region -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- HOMEPAGE
d.querySelector('#main .get-started button').onclick = () => {
    var [startButton, enterUsername] = [d.querySelector('#main .get-started .start'), d.querySelector('#main .get-started .enter-username')],
        usernameInput = enterUsername.querySelector('input'), ok = enterUsername.querySelector('.ok')
    startButton.style.display = 'none'
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
    aside
        main
            nav
                menu
                chat
            list
            search
        settings
    main
*/

/* app */
/* */ app = d.getElementById('app')
/* --- */
    /* app aside,main */
    /* */ Object.assign(app, { aside: app.querySelector('aside'), main: app.querySelector('main') })
    /* -------------- */
        /* app aside main,settings,lgout */
        /* */ Object.assign(app.aside, { main: app.aside.querySelector('.main'), settings: app.aside.querySelector('.settings'), logout: app.aside.querySelector('.logout') })
        /* ----------------------- */
            /* app aside settings new-page,old-page*/
            /* */ Object.assign(app.aside.settings, { newPage: app.aside.querySelector('span > .page-name > .new'), oldPage: app.aside.querySelector('span > .page-name > .old') })
            /* ----------------------- */
            /* app aside main nav,list,search */
            /* */ Object.assign(app.aside.main, { nav: app.aside.querySelector('nav'), list: app.aside.querySelector('.list'), search: app.aside.querySelector('.search') })
            /* ------------------------------ */
                /* app aside main nav menu,chat  */
                /* */ Object.assign(app.aside.main.nav, { menu: app.aside.main.nav.querySelector('.button-menu'), chat: app.aside.main.nav.querySelector('.button-chat') })
                /* ----------------------------- */
app.focused = 'none'
app.busy = false
app.busyFor = (ms) => { app.busy = true; setTimeout(() => app.busy = false, ms) }

//aside main - menu popup
app.aside.main.nav.menu.querySelector('span').onclick = ({ target }) => {
    var popup = app.aside.main.nav.menu.querySelector('.popup div'),
        onfocusout = (e) => {
            if (!([popup, app.aside.main.nav.menu]).includes(e?.target.closest('div')) || e?.target.tagName == 'BUTTON') {
                setTimeout(() => {
                    popup.style = 'display: block; transform: scale(0.5); opacity: 0', target.closest('span').style.filter = ''; d.removeEventListener('click', onfocusout, true)
                    setTimeout(() => popup.style.display = 'none', 300)
                }, !!(e?.target.tagName == 'BUTTON') * 100)
            }
        }
    target.closest('span').style.filter = 'brightness(140%)'
    if (!parseInt(popup.style.opacity)) { popup.style.display = 'block'; setTimeout(() => popup.style = 'display: block; transform: scale(1); opacity: 1', 1); d.addEventListener('click', onfocusout, true) }
    else onfocusout()
}

//aside page
app.aside.page = { /* general */
    history: [],
    _open(name) {
        if (app.busy) return window.history.pushState(null, d.title, w.location.pathname)
        if (!name) return; app.aside[name].style.display = 'flex'
        app.focused = ['settings'].includes(name) ? name : 'none'
        setTimeout(() => app.aside[name].style = 'display: flex; transform: none; opacity: 1', 1); app.busyFor(300)
    },
    open(name) {
        this._open(name); this.history.push(name); window.history.pushState(null, d.title, w.location.pathname)
    },
    pop() {
        var _pop = this.history.pop(), _new = this.history.slice(-1)[0]; if (!_pop || _pop == _new) return window.history.pushState(null, d.title, w.location.pathname)
        app.aside[_pop].style = 'display: flex'; setTimeout(() => app.aside[_pop].style = '', 300); this._open(_new)
    }
}
app.aside.settings.page = { /* settings */
    history: [],
    open(name) {
        if (app.busy) return
        var _current = this.history.slice(-1)[0]; _current = app.aside.settings.querySelector('.' + (_current ? _current : 'main')),
            _new = app.aside.settings.querySelector('.' + name); window.history.pushState(null, d.title, w.location.pathname)
        _current.style.transform = 'translateX(-100%)', _new.style = 'display: flex'
        app.aside.settings.newPage.innerText = _new.getAttribute('data-name'), app.aside.settings.oldPage.innerText = _current.getAttribute('data-name')
        app.aside.settings.oldPage.style = '', app.aside.settings.newPage.style = 'transform: translateY(100%)'
        setTimeout(() => {
            _new.style = 'display: flex; transform: none'
            app.aside.settings.oldPage.style = 'transform: translateY(-100%); transition: .3s', app.aside.settings.newPage.style = 'transform: none; transition: .3s'
        }, 1)
        this.history.push(name); app.busyFor(300)
    },
    pop() {
        if (app.busy) return window.history.pushState(null, d.title, w.location.pathname)
        var [_current, _new] = [undefined, ...this.history.slice(-2)].reverse().slice(0, 2)
        if (!_current) { app.focused = 'none'; return app.aside.page.pop() }
        _new = app.aside.settings.querySelector('.' + (_new ? _new : 'main')), _current = app.aside.settings.querySelector('.' + _current)
        _current.style.transform = 'translateX(100%)', _new.style = 'display: flex'
        app.aside.settings.newPage.innerText = _new.getAttribute('data-name'), app.aside.settings.oldPage.innerText = _current.getAttribute('data-name')
        app.aside.settings.oldPage.style = '', app.aside.settings.newPage.style = 'transform: translateY(-100%)'
        setTimeout(() => {
            _new.style = 'display: flex; transform: none'
            app.aside.settings.oldPage.style = 'transform: translateY(100%); transition: .3s', app.aside.settings.newPage.style = 'transform: none; transition: .3s'
        }, 11)
        this.history.pop(); app.busyFor(300)
    }
}
// #endregion  -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */


const logout = () => {
    localStorage.clear()
    d.querySelector('#main').style.display = 'block'
    d.querySelector('#main .get-started .start').style.display = 'block'
    d.querySelector('#main .get-started .enter-username').style = 'display: none'
    app.style = 'display: flex; opacity: 0; transform: translateY(16px)'
    setTimeout(() => app.style = '', 300)
}


w.onpopstate = (e) => {
    switch (app.focused) {
        case 'settings': app.aside.settings.page.pop(); break
        default: app.aside.page.pop()
    }
    e.preventDefault()
}
w.onload = async () => {
    var token = localStorage.getItem('token'),
        user = localStorage.getItem('user')

    d.querySelector('#initial-loading').style = 'opacity: 0'
    d.querySelector('#initial-loading span').style = 'transform: translateY(.25em)'
    d.querySelector('#initial-loading .loader').style = 'width: 100px'
    setTimeout(() => d.querySelector('#initial-loading').remove(), 300)

    if (token) {
        if (search.get('utm_source'))
            d.getElementById('main').style.display = 'none', app.style = 'display: flex; opacity: 1; transform: translateY(0) scale(100%); transition: 0'
        else {
            d.getElementById('main').style.display = 'none', app.style.display = 'flex'
            setTimeout(() => d.getElementById('app').style = 'display: flex; opacity: 1; transform: translateY(0) scale(100%)', 1)
        }
    }

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/serviceWorker.js')
}
