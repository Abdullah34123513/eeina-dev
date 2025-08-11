import { Schema, model } from 'mongoose';


const listSchema = new Schema(
      {
            recipeId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Recipe'
            },
            listName: {
                  en: String,
                  ar: String
            },
            list: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'Ingredient'
                  }
            ],
            user: {
                  type: Schema.Types.ObjectId,
                  ref: 'User'
            }
      },
      {
            timestamps: true,
      }
)


const List = model('List', listSchema);

export default List;