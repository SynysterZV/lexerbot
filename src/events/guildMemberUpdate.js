module.exports = (client, oldMember, newMember) => {
    if (oldMember.partial) return oldMember.guild.members.fetch();
    if (oldMember.pending == true && newMember.pending == false) {
        const role = oldMember.guild.roles.cache.find(r => r.name == 'Members')
        newMember.roles.add(role)
    }
}