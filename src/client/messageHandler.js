const lexure = require('lexure')
module.exports = message => {

    // LEXER
    const lexer = new lexure.Lexer(message.content)
    const res = lexer.lexCommand(s => s.startsWith(message.client.config.prefix) ? 1 : null)
    if (res == null) return;
    const cmd = message.client.commands.get(res[0].value)
        || message.client.commands.find(a => a.help.aliases && a.help.aliases.includes(res[0].value))
    if(!cmd) return;
    const tokens = res[1]();
    const parser = new lexure.Parser(tokens).setUnorderedStrategy(lexure.longStrategy());
    const out = parser.parse();
    const args = new lexure.Args(out)

    //PERMISSIONS HANDLER
    if(cmd.config.perms && !message.member.permissions.has(cmd.config.perms)) return message.channel.send('You dont have the permissions to use this command!');
    if (cmd.config.role && !message.member.roles.cache.some(role => role.name === cmd.config.role)) return message.channel.send('You dont have the role to use this command!')
    
    return {cmd, args}
}