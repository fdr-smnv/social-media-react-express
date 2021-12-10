import { LikeService, LikeModel, ILike } from './like.js';
import mongoose, { Document, MongooseQueryOptions, FilterQuery } from "mongoose";
import { UserModel, IUser } from "./user.js";

const { model, Schema } = mongoose;

export interface IPost extends Document {
    type: 'post' | 'repost' | 'reply'
    createdAt: Date;
    postedBy: IUser['id'];
    text: String;
    img_url: String;
    replies: IPost['id'][];
    likes: ILike['id'][]
}

const postSchema = new Schema<IPost>({
    type: { type: String, required: true },
    createdAt: { type: Schema.Types.Date, required: true },
    postedBy: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
    text: String,
    img_url: String,
    replies: [{ type: Schema.Types.ObjectId, ref: this }],
    likes: [{ type: Schema.Types.ObjectId }]
})

export const Post = model<IPost>('Post', postSchema);

type Falsy = false | 0 | '' | null | undefined;
type getPaginatedPostsOptionsT = {
    // query: FilterQuery<IPost>,
    // prevPosts?: IPost[] | Falsy,
    keyId: IPost['id'] | undefined
    limit?: number
};

export class PostService {
    async findPost(
        query: FilterQuery<IPost>,
        options: MongooseQueryOptions = { lean: true }
    ) {

    }

    static async likePost(postId: IPost['id'], userId: IUser['_id']) {
        const prevLike = await LikeService.getByUserAndPostIds(userId, postId)

        if (prevLike == null) {
            console.log('add like');
            const newLike = new LikeModel({ postId, userId })
            await newLike.save();
            await Post.findByIdAndUpdate(postId, { "$push": { 'likes': newLike.id } })
        } else {
            console.log('remove like');
            await Post.findByIdAndUpdate(postId, { '$pull': { 'likes': prevLike.id } });
            await prevLike.remove();
        }
    }

    static async getPaginatedPosts({ keyId, limit = 10 }: getPaginatedPostsOptionsT) {
        if (typeof keyId == 'undefined') {
            console.log('prevPosts undefined')
            return await Post.find({}).sort({ _id: -1 }).limit(limit)
        }

        console.log('prevPosts')

        return await Post.find({ _id: { '$lt': keyId } }).sort({ _id: -1 }).limit(limit)
    }
}

// export class PostService {
//     async GetPaginated(offset: number, limit: number) {
//         // const posts = await Post.find({ $or: [{ type: 'post' }, { type: 'repost' }] }, null, { limit, offset })
//         // const posts = await Post.aggregate([
//         //     {$match: {}},
//         //     {$count: 'count'},
//         //     {$match: }
//         // ])
//         const firstPage = await Post.find().limit(3).exec();
//         console.log(firstPage);
//     }
// }

// type PaginationQueryOptionsT<T> {
//     query: QuerySelector<T>,
//     sort: [string, SortValues]
// }

// function getPaginatedPosts({ nextKeyFn }): ({ nextKeyFn: (Document[]) => ObjectId }): void {

// }
// type getPaginatedPostsT = (options: {
//     nextKeyFn: (posts: Document<IPost>[]) => ObjectId
// }) => string;
// const getPaginatedPosts: getPaginatedPostsT = (options) => {
//     const kek = options.nextKeyFn
//     return '';

// function generatePaginationQuery(options: PaginationQueryOptionsT) {
//     const sortField = sort == null ? null : sort[0];

//     function nextKeyFn(items) {
//       if (items.length === 0) {
//         return null;
//       }

//       const item = items[items.length - 1];

//       if (sortField == null) {
//         return { _id: item._id };
//       }

//       return { _id: item._id, [sortField]: item[sortField] };
//     }

//     if (nextKey == null) {
//       return { query, nextKeyFn };
//     }

//     let paginatedQuery = query;

//     if (sort == null) {
//       paginatedQuery._id = { $gt: nextKey._id };
//       return { paginatedQuery, nextKey };
//     }

//     const sortOperator = sort[1] === 1 ? "$gt" : "$lt";

//     const paginationQuery = [
//       { [sortField]: { [sortOperator]: nextKey[sortField] } },
//       {
//         $and: [
//           { [sortField]: nextKey[sortField] },
//           { _id: { [sortOperator]: nextKey._id } }
//         ]
//       }
//     ];

//     if (paginatedQuery.$or == null) {
//       paginatedQuery.$or = paginationQuery;
//     } else {
//       paginatedQuery = { $and: [query, { $or: paginationQuery }] };
//     }

//     return { paginatedQuery, nextKeyFn };
//   }