const Sequelize = require("sequelize");
const fs = require("fs");
const yaml = require("js-yaml");
const DataTypes = Sequelize.DataTypes;

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "tags.sqlite",
});

const tags = require("./structures/Tags/tag")(sequelize, Sequelize.DataTypes);

const createTags = async (docs) => {
  for (const doc of docs) {
    console.log(doc);
    tags.create({
      aliases: doc.aliases.join(","),
      content: doc.content,
      createdAt: new Date(doc.createdAt),
      name: doc.name,
      templated: doc.templated,
      updatedAt: new Date(doc.updatedAt),
      user: doc.user,
    });
  }
  tags.sync();
};

yaml.loadAll(fs.readFileSync("./test/all_tags.yaml", "utf8"), (docs) => {
  createTags(docs);
  console.log("Tags Synced!");
});

module.exports = tags;

/* 
 return sequelize.define('tags', {
        aliases: {
            type: DataTypes.STRING,
            unique: true
        },
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

*/
