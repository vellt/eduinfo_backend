const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { pool } = require("../../config/db");
const { sendSuccessResponse, sendErrorResponse } = require("../../utils/responseHelper");

const createUser = async (email, name, password, role_id) => {
    const hash = await bcrypt.hash(password, 10);
    const [userResult] = await pool.query(
        "INSERT INTO users (email, password, name, role_id) VALUES (?, ?, ?, ?)",
        [email, hash, name, role_id]
    );
    return userResult.insertId;
}

const generateTokenForUser = async function (userId) {
    const insertToken = async (token) => {
        await pool.query("INSERT INTO tokens (user_id, token) VALUES (?, ?)", [userId, token]);
        return token;
    };

    const generateUniqueToken = async (attempt = 0) => {
        if (attempt >= 20) throw new Error("Túl sok próbálkozás a token generálás során");
        
        const token = uuidv4();
        const [results] = await pool.query("SELECT COUNT(*) AS count FROM tokens WHERE token = ?", [token]);

        if (results[0].count > 0) return generateUniqueToken(attempt + 1);
        return insertToken(token);
    };

    return generateUniqueToken();
};


exports.register = async (req, res) => {
  let connection;
  let errors=[]; 

  try {
    errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 400, "Hibás bemeneti adat(ok)", errors);
    }

    connection = await pool.getConnection();
    
    const { email, name, password, as } = req.body;
    const role_id = as === "person" ? 2 : 3;

    const [existingUser] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
        return sendErrorResponse(res, 400, "Az email cím már foglalt", errors);
    }

    await connection.beginTransaction();

    const userId = await createUser(email, name, password, role_id);

    await connection.query(`INSERT INTO ${as}_profiles (user_id) VALUES (?)`, [userId]);

    await connection.commit();

    sendSuccessResponse(res, null, "Sikeres regisztráció");
  } catch (error) {
    console.error(error);
    if(connection) await connection.rollback();
    sendErrorResponse(res, 500, error.message, errors);
  } finally {
    if(connection) connection.release();
  }
};

exports.adminRegister = async (req, res) => {
    let errors=[];
  
    try {
      errors = validationResult(req);
  
      if (!errors.isEmpty())  {
        return sendErrorResponse(res, 400, "Hibás bemeneti adat(ok)", errors);
      }
  
      const { email, name, password } = req.body;
  
      const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

      if (existingUser.length > 0) {
        return sendErrorResponse(res, 400, "Az email cím már foglalt", errors);
      }
  
      await createUser(email, name, password, 1);
  
      sendSuccessResponse(res, null, "Sikeres regisztráció");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Hiba a regisztráció során", errors);
    }
  };
  

exports.standardLogin = async (req, res) => {
  let errors=[];

  try {
    errors = validationResult(req);

    if (!errors.isEmpty()) {
        return sendErrorResponse(res, 400, "Hibás bemeneti adat(ok)", errors);
    }

    const { email, password } = req.body;

    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!results.length) return sendErrorResponse(res, 404, "A megadott e-mail-címmel még nem regisztráltak");

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendErrorResponse(res, 401, "Hibás jelszó");

    const token = await generateTokenForUser(user.user_id);

    sendSuccessResponse(res, { token }, "Sikeres bejelentkezés");
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, error.message, errors);
  }
};

exports.tokenLogin = async (req, res) => {
  try {
    const { token, user_id } = req;

    await pool.query(`UPDATE tokens SET is_valid = '0' WHERE token = ?`, [token]);
    const newToken = await generateTokenForUser(user_id);

    sendSuccessResponse(res, { token: newToken }, "Sikeres bejelentkezés");
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Hiba a bejelentkezés során");
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req;

    const [{ affectedRows }] = await pool.query("UPDATE tokens SET is_valid = '0' WHERE token = ?", [token]);
    if (!affectedRows) {
        return sendErrorResponse(res, 404, "Token nem található");
    }
    sendSuccessResponse(res, null, "Sikeres kijelentkezés");
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Hiba a kijelentkezés során");
  }
};

exports.getRole = (req, res) => {
  sendSuccessResponse(res, { role: req.userRole.role }, "Sikeres azonosítás");
};

