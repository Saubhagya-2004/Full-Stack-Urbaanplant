const validation = (req) => {
  const allowed = [
    "Firstname",
    "Lastname",
    "age",
    "email",
    "password",
    "gender",
    "profile",
    "city",
    "State",
    "country",
    "pincode", 
    "Role",
  ];
  const isAllowed = Object.keys(req.body).every((key) => {
    return allowed.includes(key);
  });
  if (!isAllowed) {
    throw new Error("Invalid details !!");
  }
};
const plantvalidation = (req) => {
  const allowed = ["name", "price", "categories", "available","profile"];
  const isAllowed = Object.keys(req.body).every((key)=>{
    return allowed.includes(key);
  });
  if(!isAllowed){
    throw new Error("Invalid details !!");
  }
};
module.exports = {
  validation,
  plantvalidation
};
