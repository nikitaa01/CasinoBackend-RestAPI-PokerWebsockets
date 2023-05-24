const socket = new WebSocket('ws://localhost:3001/ws')
let i = 0
let clear = false


socket.addEventListener('open', function (_event) {
    console.log('okets desde cliente')
})
socket.addEventListener('message', function (event) {
    console.log(`Recived: ${event.data}`)
    const parsed = JSON.parse(event.data)
    if (clear) {
        clear = false
        document.getElementById('pers_cards').innerHTML = ''
        document.getElementById('common_cards').innerHTML = ''
    }
    if (parsed.status === 'FINISH') {
        clear = true
    }
	if (parsed.status === 'PERS_CARDS') {
		document.getElementById('pers_cards').innerHTML += `<pre><code>${JSON.stringify(parsed.cards, null, 2)}</code></pre>`
		
    }
    if (parsed.status === 'COMMON_CARDS') {
        document.getElementById('common_cards').innerHTML += `<pre><code>${JSON.stringify(parsed.cards, null, 2)}</code></pre>`
    }
	document.getElementById(
        "uid"
    ).innerHTML += `<pre><code><span>message n: ${++i}</span>\n${event.data}</code></pre>`;
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    socket.send(JSON.stringify(Object.fromEntries(new FormData(e.target))))
})

document.querySelector('button').addEventListener('click', () => {
    socket.send(JSON.stringify({menu: 'FINISH'}))
})
