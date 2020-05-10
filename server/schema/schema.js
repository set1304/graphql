const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie')
const Directors = require('../models/director')

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        directorId: {
            type: DirectorsType,
            resolve(parent, args) {
                console.log('parent', parent)
                return Directors.findById(parent.directorId);
            }
        }
    }),
});


const DirectorsType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: GraphQLList(MovieType),
            resolve(parent, args){
                return Movies.find({ directorId: parent.id })
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorsType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                const director =  new Directors({
                    name: args.name,
                    age: args.age
                });
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID }
            },
            resolve(parent, args){
                const movie =  new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId
                });
                return movie.save()
            }
        },
        deleteDirector:{
            type: DirectorsType,
            args:{
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
                return Directors.findByIdAndRemove(args.id)
            }
        },
        deleteMovie:{
            type: MovieType,
            args:{
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args){
                return Movies.findByIdAndRemove(args.id)
            }
        },
        updateDirector:{
            type: DirectorsType,
            args:{
                id: {
                    type: GraphQLID
                },
                name: {type: new GraphQLNonNull(GraphQLString) },
                age: {type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
                return Directors.findByIdAndUpdate(
                    args.id, 
                    { $set: { name: args.name, age: args.age} },
                    { new : true },
                )
            }
        },
        updateMovie:{
            type: MovieType,
            args:{
                id: {
                    type: GraphQLID
                },
                name: {type: new GraphQLNonNull(GraphQLString) },
                genre: {type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID }, 
            },
            resolve(parent, args){
                return Movies.findByIdAndUpdate(
                    args.id,
                    { $set: { name: args.name, genre: args.genre, directorId: args.directorId} },
                    { new : true },
                )
            }
        }
        
    }

});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorsType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findById(args.id);
            }
        },
        directors:{
            type: GraphQLList(DirectorsType),
            resolve(parent, args){
                return Directors.find({})
            }
        },
        movies:{
            type: GraphQLList(MovieType),
            resolve(parent, args){
                return Movies.find({})
            }
        },
    },
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})