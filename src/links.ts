import { model, Schema } from "mongoose";
interface LinkProps {
  slug: string;
  url: string;
}

export default model("Links", new Schema<LinkProps>({
  slug: { type: String },
  url: { type: String }
}))