import * as bcrypt from "bcrypt";

//Generate hashed password
const generatePassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

//Compare user-provided password against password in database. Returns boolean
const validatePassword = async (password: string, passwordHash: string) => {
  const result = await bcrypt.compare(password, passwordHash);
  return result;
};

export { validatePassword, generatePassword };
