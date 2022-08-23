const DATABASE_VERSION = 1
const URL_BACKEND = 'http://api.anonimsin/utb'
const URL_WS = 'ws://api.anonimsin/utb'

const db = new Dexie('AnonimsinDB')
db.version(DATABASE_VERSION).stores({
    users: '&id,name,avatar',
    channels: '&id,name,icon',
    messages: '&id,channel_id,user_id,content'
})

class Session {
    constructor(token, user) {
        this.onunexpectederror
        this.onservererror
        this.token = token, this.user = user
    }
    async request(path, options) {
        return new Promise(async resolve => {
            let _options = { ...options }
            if (options?.body) _options.body = JSON.stringify(options.body), _options.method = !_options.method ? 'POST' : _options.method
            if (this.token) _options.headers = { ...options?.headers, token: this.token }
            let raw, ok, res = await fetch(path, _options).catch(err => { if (this.onunexpectederror) this.onconnectionerror(err); resolve([false, false, false]) }).then(res => {
                ok = res.ok, raw = res; try { return res.json() } catch (err) { if (this.onservererror) this.onservererror(err); resolve([false, false, false]) }
            }).then(json => [json, ok, raw]).catch(err => { if (this.onunexpectederror) this.onconnectionerror(err); resolve([false, false, false]) })
            if (res?.[2].status == 429 && options?.retry != false) setTimeout(async () => resolve(await this.request(path, options)), (parseInt(res[2].headers.get('RateLimit-Reset'))) * 1000)
            else resolve(res)
        })
    }
    async login() {

    }
}