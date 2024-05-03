const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(`postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`);

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

const Posts = sequelize.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },   
}, {
    tableName: 'posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

const Comments = sequelize.define('Comments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Users,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Posts,
            key: 'id',
            onDelete: 'CASCADE',
        },
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'create_at',
    updatedAt: 'updated_at',
});

const Tags = sequelize.define('Tags', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    tableName: 'tags',
    timestamps: false,
});

const Posts_Tags = sequelize.define('Posts_Tags', {
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Posts,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    tag_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Tags,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
}, {
    tableName: 'posts_tags',
    timestamps: false,
});

Posts.belongsTo(Users, {foreignKey: 'user_id', as: 'user'});
Comments.belongsTo(Users, {foreignKey: 'user_id', as: 'user'});
Comments.belongsTo(Posts, {foreignKey: 'post_id', as: 'post'});
Comments.belongsTo(Comments, { as: 'ParentComment', foreignKey: 'parent_comment_id' });
Posts_Tags.belongsTo(Posts, {foreignKey: 'post_id', as: 'post'});
Posts_Tags.belongsTo(Tags, {foreignKey: 'tag_id', as: 'tag'});

module.exports = {
    Users,
    Posts,
    Comments,
    Tags,
    Posts_Tags,
};