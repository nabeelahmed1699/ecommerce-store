export async function isValidPassword(password: string, userpassword: string) {
  // const userPassword = await hashPassword(password);
  // const adminPassword = await hashPassword(hashedPassword);
  console.log(password, userpassword);
  return userpassword === password;
}

// async function hashPassword(password: string) {
//   const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password));
//   return Buffer.from(arrayBuffer).toString('base64');
// }
