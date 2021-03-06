import mongoose, { Document, Model, Types } from "mongoose";
const { model, Schema } = mongoose;

export interface IImage {
  data: Buffer;
  mime: string;
  name: string;
}

export interface IImageDoc extends IImage, Document<Types.ObjectId> {}
export type IImageModel = Model<IImageDoc>;

const ImageSchema = new Schema<IImageDoc, IImageModel>({
  data: { type: Buffer, required: true },
  mime: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String, required: true },
});

export const Image = model<IImageDoc, IImageModel>(
  "images",
  ImageSchema,
  "images"
);
