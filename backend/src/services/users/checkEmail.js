const { User } = require('../../models/usersModel.js')
exports.checkEmail = async (userBody) =>{
    const email = userBody.email || userBody;
    const user = await User.findOne({email});
    if(user){
      return true;
    }
    return false;
}
  