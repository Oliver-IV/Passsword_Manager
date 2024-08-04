import { z } from "zod" ;

const userSchema = z.object({
    names: z.string().trim().max(30).regex(/^[\p{L}\s]+$/u, { message: 'Only letters allowed' }).min(1),
    last_name_p: z.string().trim().max(30).regex(/^[\p{L}\s]+$/u, { message: 'Only letters allowed' }).min(1),
    last_name_m: z.string().trim().max(30).regex(/^[\p{L}\s]+$/u, { message: 'Only letters allowed' }).min(1),  
    email: z.string().trim().email().min(1),
    password: z.string().trim().min(8).regex(/^(.*\d){3}/, { message: 'Password must contain at least 3 numbers' }).min(1),
  });
  
  const loginSchema = z.object({
    email: z.string().trim().email().min(1),
    password: z.string().trim().min(1),
  });
  
  const accountSchema = z.object({
    name: z.string().trim().min(1).max(18).regex(/^[\p{L}\p{N}\s]+$/u, { message: 'Name must contain only letters, numbers' }),
    user: z.string().trim().min(1).max(30),
    password: z.string().trim().min(1).max(25),
  });

  const passwordSchema = z.object({
    password: z.string().trim().min(8).regex(/^(.*\d){3}/, { message: 'Password must contain at least 3 numbers' }).min(1)
  }) ;

  function validateUser(user) {
    const validation = userSchema.safeParse(user) ;

    if(!validation.success) {
        validation.error.errors.forEach(err => {
          switch (err.code) {
            case "invalid_string":
              console.log(err) ;
              if(err.path[0] == 'names' || err.path[0] == 'last_name_p' || err.path[0] == 'last_name_m') {
                throw new Error("Only letters are allowed on Name and Last Names") ;
              } else if(err.path[0] == 'email') {
                throw new Error("Enter a Valid Email") ;
              } else if(err.path[0] == 'password') {
                throw new Error('Your password must contain at least 3 numbers') ;
              } else {
                throw new Error("There's an error with your data") ;
              }
            case "too_small":
              if(err.minimum == 1) {
                throw new Error('You must fill the empty Fields') ;
              } else if(err.minimum == 8) {
                throw new Error('Your password must contain at least 8 characters') ;
              }
            default:
              throw new Error("There's an error with your data")
          }
        }) ;
    } else {
      return true ;
    }
  }

function validateAccount(account) {
  const validation = accountSchema.safeParse(account);

  if (!validation.success) {
    validation.error.errors.forEach(err => {
      switch (err.code) {
        case "invalid_string":
          if (err.path[0] == 'name') {
            throw new Error("Only letters and numbers are allowed on the Account Name");
          } else {
            throw new Error("There's an error with your data");
          }
        case "too_small":
            throw new Error('You must fill the empty Fields');
        case "too_big":
            if(err.path[0] == 'name') {
              throw new Error("The Account Name characters limit is 18") ;
            } else if(err.path[0] == 'user') {
              throw new Error("The Username characters limit is 30") ;
            } else if(err.path[0] == 'password') {
              throw new Error("The Password characters limit is 25") ;
            } else {
              throw new Error("There's an error with your data");
            }
        default:
          throw new Error("There's an error with your data")
      }
    });
  } else {
    return true;
  }
}

function validateLogin(user) {
  const validation = loginSchema.safeParse(user);

  if (!validation.success) {
    validation.error.errors.forEach(err => {
      switch (err.code) {
        case "invalid_string":
          if (err.path[0] == 'email') {
            throw new Error("Enter a Valid Email");
          } else {
            throw new Error("There's an error with your data");
          }
        case "too_small":
            throw new Error('You must fill the empty Fields');
        default:
          throw new Error("There's an error with your data")
      }
    });
  } else {
    return true;
  }
}

function validatePassword(password) {
  const validation = passwordSchema.safeParse({password: password});

  if (!validation.success) {
    validation.error.errors.forEach(err => {
      switch (err.code) {
        case "invalid_string":
              if(err.path[0] == 'password') {
                throw new Error('Your password must contain at least 3 numbers') ;
              } else {
                throw new Error("There's an error with your data") ;
              }
            case "too_small":
              if(err.minimum == 1) {
                throw new Error('You must fill the empty Fields') ;
              } else if(err.minimum == 8) {
                throw new Error('Your password must contain at least 8 characters') ;
              }
            default:
              throw new Error("There's an error with your data")
      }
    });
  } else {
    return true;
  }
}

export { validateUser, validateAccount, validateLogin, validatePassword } ;
