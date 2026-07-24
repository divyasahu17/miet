const Imap = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const config = {
    imap: {
        user: 'info@miet.life',
        password: 'mietlife@120',
        host: 'mail.miet.life',
        port: 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

Imap.connect(config).then(function (connection) {
    return connection.openBox('INBOX').then(function () {
        var searchCriteria = ['ALL'];
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
        return connection.search(searchCriteria, fetchOptions).then(function (messages) {
            console.log(`Found ${messages.length} messages.`);
            let tasks = messages.map(function (message) {
                var parts = Imap.getParts(message.attributes.struct);
                var all = message.parts.filter(function (part) {
                    return part.which === 'TEXT';
                });
                return simpleParser(all[0].body).then(parsed => {
                   return {
                       subject: parsed.subject || message.parts.find(p => p.which === 'HEADER').body.subject[0],
                       text: parsed.text || all[0].body
                   };
                }).catch(e => {
                   return { subject: 'Error parsing', text: all[0].body };
                });
            });
            return Promise.all(tasks).then(function(emails) {
                // print the last 3 emails
                const lastEmails = emails.slice(-3);
                lastEmails.forEach((email, i) => {
                    console.log(`\n--- Email ${i+1} ---`);
                    console.log('Subject:', email.subject);
                    console.log('Body snippet:', email.text.substring(0, 500));
                });
                connection.end();
            });
        });
    });
}).catch(err => {
    console.error('IMAP error:', err);
});
