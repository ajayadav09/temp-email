let user, domain, refreshIntervalId;

document.getElementById('generate-btn').onclick = () => {
    domain = document.getElementById('domain-select').value;
    const bytes = new Uint8Array(12);
    crypto.getRandomValues(bytes);
    user = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    const email = user + '@' + domain;
    document.getElementById('email-display').textContent = email;
    document.getElementById('refresh-btn').disabled = false;
    if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
        document.getElementById('auto-refresh').checked = false;
    }
    document.getElementById('status').textContent = 'Email generated! Use this email for OTP.';
    document.getElementById('message-list').innerHTML = 'No messages yet';
    document.getElementById('message-content').style.display = 'none';
};

function refreshMessages() {
    document.getElementById('status').textContent = 'Checking messages...';
    fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`)
        .then(res => res.json())
        .then(messages => {
            const list = document.getElementById('message-list');
            list.innerHTML = '';
            if (!messages.length) {
                list.textContent = 'No messages yet';
                document.getElementById('status').textContent = 'No messages.';
                return;
            }

            messages.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'message-item';
                div.innerHTML = `<strong>From:</strong> ${msg.from}<br><strong>Subject:</strong> ${msg.subject || '(No subject)'}<br><strong>Date:</strong> ${msg.date}`;
                div.onclick = () => readMessage(msg.id);
                list.appendChild(div);
            });

            document.getElementById('status').textContent = `${messages.length} message(s) loaded.`;
        })
        .catch(err => document.getElementById('status').textContent = 'Error: ' + err);
}

document.getElementById('refresh-btn').onclick = refreshMessages;

document.getElementById('auto-refresh').onchange = e => {
    if (e.target.checked) {
        const interval = parseInt(document.getElementById('interval-input').value, 10) || 10;
        refreshMessages();
        refreshIntervalId = setInterval(refreshMessages, interval * 1000);
        document.getElementById('status').textContent = `Auto refresh every ${interval}s.`;
    } else {
        clearInterval(refreshIntervalId);
        refreshIntervalId = null;
        document.getElementById('status').textContent = 'Auto refresh stopped.';
    }
};

document.getElementById('interval-input').onchange = () => {
    if (document.getElementById('auto-refresh').checked) {
        clearInterval(refreshIntervalId);
        const interval = parseInt(document.getElementById('interval-input').value, 10) || 10;
        refreshIntervalId = setInterval(refreshMessages, interval * 1000);
        document.getElementById('status').textContent = `Auto refresh every ${interval}s.`;
    }
};

function readMessage(id) {
    fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${user}&domain=${domain}&id=${id}`)
        .then(res => res.json())
        .then(msg => {
            let content = msg.htmlBody || msg.textBody || 'No content';
            if (!msg.htmlBody && msg.textBody)
                content = content.replace(/\n/g, '<br>');

            content = content.replace(/\b\d{4,8}\b/g, '<span class="highlight">$&</span>');
            content = DOMPurify.sanitize(content);

            document.getElementById('message-content').innerHTML = `
                <h3>${msg.subject || '(No subject)'}</h3>
                <p><strong>From:</strong> ${msg.from}</p>
                <p><strong>Date:</strong> ${msg.date}</p><hr>
                <div>${content}</div>
            `;
            document.getElementById('message-content').style.display = 'block';
            document.getElementById('status').textContent = 'Message displayed.';
        })
        .catch(err => document.getElementById('status').textContent = 'Error: ' + err);
}
