module.exports = (sequelize, DataTypes) => {
    return sequelize.define('modEvents', {
        userid: DataTypes.STRING,
        guildid: DataTypes.STRING,
        warns: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        kicks: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        mutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        bans: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        muted: DataTypes.BOOLEAN
    })
}