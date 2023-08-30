const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, 'password is required'],
      minlenght: [6, 'Too Short password'],
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const setImageTOUrl = (doc)=>{
if(doc.profileImg){
  const imgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`
  doc.profileImg = imgUrl
}
}
userSchema.post('init',(doc)=>{
  setImageTOUrl(doc)
})
userSchema.post('save',(doc)=>{
  setImageTOUrl(doc)
})


module.exports = mongoose.model('user', userSchema);
