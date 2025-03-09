const { pool } = require("../../config/db");
const { sendSuccessResponse, sendErrorResponse} = require("../../utils/responseHelper");

const usersVersion= async()=>{
  const [[{version}]] = await pool.query(
    `SELECT 
      (SELECT SUM(is_accepted + is_enabled) FROM person_profiles) +
      (SELECT SUM(is_accepted + is_enabled) FROM institution_profiles) AS version`
  );
  
  return parseInt(version);
}

exports.role = "admin";

// Felhasználók listázása
exports.getUsers = async (req, res) => {
  try {
    const [institutionProfiles] = await pool.query(
      "SELECT institution_profile_id, is_enabled, is_accepted, avatar_image, name, email FROM institution_profiles JOIN users USING(user_id) ORDER BY institution_profile_id DESC"
      
    );
    const [personProfiles] = await pool.query(
      "SELECT person_profile_id, is_enabled, is_accepted, avatar_image, name, email FROM person_profiles JOIN users USING(user_id) ORDER BY person_profile_id DESC"
    );
    const version = await usersVersion();

    sendSuccessResponse(res, {
      version: version,
      institution_profiles: institutionProfiles.map((element) => ({
        institution_profile_id: element.institution_profile_id,
        is_enabled: Boolean(element.is_enabled),
        is_accepted: Boolean(element.is_accepted),
        avatar_image: element.avatar_image,
        name: element.name,
        email: element.email,
      })),
      person_profiles: personProfiles.map((element) => ({
        person_profile_id: element.person_profile_id,
        is_enabled: Boolean(element.is_enabled),
        is_accepted: Boolean(element.is_accepted),
        avatar_image: element.avatar_image,
        name: element.name,
        email: element.email,
      })),
    });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Intézmény letiltásaS
exports.disableInstitution = async (req, res) => {
  try {
    const { institution_profile_id: id } = req.params;

    await pool.query(
      "UPDATE institution_profiles SET is_enabled = 0 WHERE institution_profile_id = ?",
      [id]
    );
    sendSuccessResponse(res, null, "Az intézmény sikeresen letiltva");
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Intézmény engedélyezése
exports.enableInstitution = async (req, res) => {
  try {
    const { institution_profile_id: id } = req.params;

    await pool.query(
      "UPDATE institution_profiles SET is_enabled = 1 WHERE institution_profile_id = ?",
      [id]
    );
    sendSuccessResponse(res, null, "Az intézmény sikeresen engedélyezve");
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Intézmény regisztrációjának elfogadása
exports.acceptInstitution = async (req, res) => {
  try {
    const { institution_profile_id: id } = req.params;

    await pool.query(
      "UPDATE institution_profiles SET is_accepted = 1 WHERE institution_profile_id = ?",
      [id]
    );
    sendSuccessResponse(res, null, "Az intézmény regisztrációja elfogadva");
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Felhasználó letiltása
exports.disablePerson = async (req, res) => {
  const { person_profile_id: id } = req.params;

  try {
    await pool.query(
      "UPDATE person_profiles SET is_enabled = 0 WHERE person_profile_id = ?",
      [id]
    );
    sendSuccessResponse(res, null, "A felhasználó sikeresen letiltva");
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// Felhasználó engedélyezése
exports.enablePerson = async (req, res) => {
  try {
    const { person_profile_id: id } = req.params;

    await pool.query(
      "UPDATE person_profiles SET is_enabled = 1 WHERE person_profile_id = ?",
      [id]
    );
    sendSuccessResponse(res, null, "A felhasználó sikeresen engedélyezve");
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

// szinkronzizációt segítő útvonal
exports.getUsersVersion = async (req, res) => {
  try {
    const version = await usersVersion();
    sendSuccessResponse(res, {version});
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
} 