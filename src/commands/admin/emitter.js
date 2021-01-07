module.exports = {
    help: {
        name: 'emit',
        desc: 'Emits an event',
        aliases: [],
        category: 'admin'
    },
    config: {
        perms: [],
        role: false
    },
    execute(message, args) {
        if(message.author.id != '372516983129767938') return;
        message.client.emit(args.single(), eval(args.single()))
    }
}