module.exports = async (client, oldMember, newMember) => {
  if (oldMember.partial) await oldMember.fetch();
  if (newMember.partial) await newMember.fetch();
  if (oldMember.pending == true && newMember.pending == false) {
    const role = oldMember.guild.roles.cache.find((r) => r.name == "Members");
    if (!oldMember.guild.me.permissions.has(["MANAGE_ROLES"])) return;
    newMember.roles.add(role);
  }

  const mutedRole = oldMember.guild.roles.cache.find(
    (r) => r.name === client.config.mutedRole
  );
  if (
    oldMember.roles.cache.has(mutedRole) &&
    !newMember.roles.cache.has(mutedRole)
  ) {
    return client.muted.delete(oldMember.id);
  }
};
