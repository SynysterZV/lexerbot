
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        aliases: DataTypes.STRING,
        content: DataTypes.STRING,
        createdAt: DataTypes.DATE,
        hoisted: DataTypes.BOOLEAN,
        name: {
            type: DataTypes.STRING,
            unique: true
        },
        templated: DataTypes.BOOLEAN,
        updatedAt: DataTypes.DATE,
        user: DataTypes.STRING,
        __typename: DataTypes.STRING
    })
}