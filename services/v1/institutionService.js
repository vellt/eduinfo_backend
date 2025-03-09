const { pool } = require("../../config/db");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendSuccessResponse, sendErrorResponse } = require("../../utils/responseHelper");
const { getDay, getMonthAsText, getFormatTime, dynamicsDateTime } = require("../../utils/dateHelper");
const moment = require('moment-timezone');

const getInstitutionProfileId = async (user_id) => {
    const [[{ institution_profile_id }]] = await pool.query(
        "SELECT institution_profile_id FROM institution_profiles WHERE user_id = ?",
        [user_id]
    );
    return institution_profile_id;
};

const deleteImage= async(image)=>{
    const oldImagePath = path.join(__dirname, "../..", "uploads", image);
    await fs.unlink(oldImagePath);
}

const getEvents = async (institution_profile_id, pool)=>{
    const [rawEvents] = await pool.query(
        "SELECT * FROM events WHERE institution_profile_id = ? ORDER BY event_start ASC",
        [institution_profile_id]
    );
    return await Promise.all(rawEvents.map(async (event) => {
        const [eventLinks] = await pool.query(
            `SELECT event_link_id, title, link FROM event_links WHERE event_id = ?`,
            [event.event_id]
        );
        const [[{ interested_count }]] = await pool.query(
            'SELECT COUNT(*) AS interested_count FROM interests WHERE event_id=?',
            [event.event_id]
        );
        return {
            event_id: event.event_id,
            title: event.title,
            location: event.location,
            description: event.description,
            interested_count: interested_count,
            banner_image: event.banner_image,
            month: getMonthAsText(event.event_start),
            day: getDay(event.event_start),
            time: getFormatTime(event.event_start, event.event_end),
            start: event.event_start,
            end: event.event_end,
            event_links: eventLinks,
        };
    }));
}

const getStories = async (institution_profile_id, pool)=>{
    const [rawStories] = await pool.query(
        `SELECT s.story_id, s.description, (SELECT COUNT(*) FROM likes as l WHERE l.story_id=s.story_id) as likes, s.timestamp, s.banner_image 
         FROM stories as s 
         WHERE s.institution_profile_id=? 
         ORDER BY s.story_id DESC`,
        [institution_profile_id]
    );

    return rawStories.map(story => ({
        story_id: story.story_id,
        description: story.description,
        likes: story.likes,
        banner_image: story.banner_image,
        formatted_datetime: dynamicsDateTime(story.timestamp),
    }))
}

const getMessagesVersion= async (institution_profile_id)=>{
    const [[{ version }]] = await pool.query(
        `SELECT COUNT(*) AS version 
         FROM messages 
         JOIN messaging_rooms USING(messaging_room_id) 
         WHERE institution_profile_id=?`, 
        [institution_profile_id]
    );

    return parseInt(version);
}

exports.role = "institution";

exports.getProfile = async (req, res) => {
    try {
        const user_id = req.user_id;
        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [institutionProfiles] = await pool.query(
            "SELECT * FROM institution_profiles JOIN users USING(user_id) WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const stories= await getStories(institution_profile_id, pool);

        const events = await getEvents(institution_profile_id, pool);

        const [publicEmails] = await pool.query(
            "SELECT public_email_id, title, email FROM public_emails WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const [publicPhones] = await pool.query(
            "SELECT public_phone_id, title, phone FROM public_phones WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const [publicWebsites] = await pool.query(
            "SELECT public_website_id, title, website FROM public_websites WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const [categories] = await pool.query(
            "SELECT category_id, category FROM institution_categories JOIN categories USING(category_id) WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const [[{ follower_count }]] = await pool.query(
            "SELECT COUNT(*) AS follower_count FROM following WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        const messages_version= await getMessagesVersion(institution_profile_id);

        sendSuccessResponse(res, {
            institution_profile_id: institution_profile_id,
            messages_version: messages_version,
            name: institutionProfiles[0].name,
            email: institutionProfiles[0].email,
            avatar_image: institutionProfiles[0].avatar_image,
            banner_image: institutionProfiles[0].banner_image,
            followers: follower_count,
            description: institutionProfiles[0].description,
            stories: stories,
            events: events,
            public_emails: publicEmails,
            public_phones: publicPhones,
            public_websites: publicWebsites,
            categories: categories,
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.checkEnabled = (req, res) => {
    sendSuccessResponse(res, null, "A fiók engedélyezve van");
};

exports.checkAccepted = (req, res) => {
    sendSuccessResponse(res, null, "A fiók regisztrációja jóvá van hagyva");
};

exports.getCategories = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM categories ORDER BY category_id ASC');
        sendSuccessResponse(res, result);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateInstitutionCategories = async (req, res) => {
    let connection;

    try {
        connection = await pool.getConnection();
        const user_id = req.user_id;
        let categories = [];
        if (req.body.categories) {
            categories = Array.isArray(req.body.categories)
                ? req.body.categories.map(category => (typeof category === 'string' ? JSON.parse(category) : category))
                : [JSON.parse(req.body.categories)];
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        await connection.beginTransaction();

        await connection.query(
            'DELETE FROM institution_categories WHERE institution_profile_id = ?', 
            [institution_profile_id]
        );

        if (categories.length) {
            await connection.query(
                'INSERT INTO institution_categories (institution_profile_id, category_id) VALUES ?', 
                [categories.map(item => [institution_profile_id, item.category_id])]
            );
        }

        await connection.commit();

        const [response] = await pool.query(
            'SELECT category_id, category FROM institution_categories JOIN categories USING(category_id) WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response);
    } catch (error) {
        if(connection) await connection.rollback();
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    } finally {
        if(connection) connection.release();
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        const user_id = req.user_id;
        const avatar_image = req.file ? req.file.filename : null;

        if (!avatar_image) {
            return sendErrorResponse(res, 400, 'Kötelező képet megadni');
        }

        const [[old]] = await pool.query(
            'SELECT avatar_image FROM institution_profiles WHERE user_id = ?', 
            [user_id]
        );

        await pool.query(
            'UPDATE institution_profiles SET avatar_image = ? WHERE user_id = ?', 
            [avatar_image, user_id]
        );

        if (old.avatar_image && old.avatar_image !== "default_avatar.jpg") {
            await deleteImage(old.avatar_image);
        }

        const [[newData]] = await pool.query(
            'SELECT avatar_image FROM institution_profiles WHERE user_id = ?', 
            [user_id]
        );

        sendSuccessResponse(res, {
            avatar_image: newData.avatar_image
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateBanner = async (req, res) => {
    try {
        const user_id = req.user_id;
        const banner_image = req.file ? req.file.filename : null;

        if (!banner_image) {
            return sendErrorResponse(res, 400, 'Kötelező képet megadni');
        }

        const [[old]] = await pool.query(
            'SELECT banner_image FROM institution_profiles WHERE user_id = ?', 
            [user_id]
        );

        await pool.query(
            'UPDATE institution_profiles SET banner_image = ? WHERE user_id = ?', 
            [banner_image, user_id]
        );

        if (old.banner_image && old.banner_image !== "default_banner.jpg") {
            await deleteImage(old.banner_image);
        }

        const [[newData]] = await pool.query(
            'SELECT banner_image FROM institution_profiles WHERE user_id = ?', 
            [user_id]
        );

        sendSuccessResponse(res, {
            banner_image: newData.banner_image
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateName = async (req, res) => {
    try {
        const { name } = req.body;
        const user_id = req.user_id;

        if (!name) {
            return sendErrorResponse(res, 400,'A név mező nem lehet üres');
        }

        await pool.query(
            'UPDATE users SET name = ? WHERE user_id = ?', 
            [name, user_id]
        );

        const [[response]] = await pool.query(
            'SELECT name FROM users WHERE user_id = ?', 
            [user_id]
        );

        sendSuccessResponse(res, {
            name: response.name
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user_id = req.user_id;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendErrorResponse(res, 400, errors.array()[0].msg);
        }

        const [match] = await pool.query(
            'SELECT email FROM users WHERE email = ? AND user_id  <> ?', 
            [email, user_id]
        );
        
        if(match.length){
            return sendErrorResponse(res, 400,'Az email cimmel már regisztráltak');
        }

        await pool.query(
            'UPDATE users SET email = ? WHERE user_id = ?', 
            [email, user_id]
        );

        const [[response]] = await pool.query(
            'SELECT email FROM users WHERE user_id = ?', 
            [user_id]
        );

        sendSuccessResponse(res, {
            email: response.email
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { current_password, new_password } = req.body;
        const user_id = req.user_id;

        if (!current_password || !new_password) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const [[{ password }]] = await pool.query(
            'SELECT * FROM users WHERE user_id = ?', 
            [user_id]
        );

        const isMatch = await bcrypt.compare(current_password, password);

        if (!isMatch) {
            return sendErrorResponse(res, 400,'Helytelen jelszót adtál meg');
        }

        const hash = await bcrypt.hash(new_password, 10);
        await pool.query(
            'UPDATE users SET password = ? WHERE user_id = ?', 
            [hash, user_id]
        );

        sendSuccessResponse(res, null, "Jelszó sikeresen módosítva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateDescription = async (req, res) => {
    try {
        const { description } = req.body;
        const user_id = req.user_id;

        await pool.query(
            'UPDATE institution_profiles SET description = ? WHERE user_id = ?', 
            [description, user_id]
        );

        const [[response]] = await pool.query(
            'SELECT description FROM institution_profiles WHERE user_id = ?', 
            [user_id]
        );

        sendSuccessResponse(res, {
            description: response.description
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const user_id = req.user_id;

        // 1. Képek összegyűjtése a lekérdezésekből
        const [avatarImages] = await pool.query(
            `SELECT i.avatar_image FROM institution_profiles AS i 
            WHERE i.user_id = ? AND i.avatar_image <> "default_avatar.jpg"`,
            [user_id]
        );

        const [bannerImages] = await pool.query(
            `SELECT i.banner_image FROM institution_profiles AS i 
            WHERE i.user_id = ? AND i.banner_image <> "default_banner.jpg"`,
            [user_id]
        );

        const [storiesImages] = await pool.query(
            `SELECT n.banner_image FROM institution_profiles AS i 
            JOIN stories AS n USING(institution_profile_id) 
            WHERE i.user_id = ? AND n.banner_image IS NOT NULL`,
            [user_id]
        );

        const [eventImages] = await pool.query(
            `SELECT e.banner_image FROM institution_profiles AS i 
            JOIN events AS e USING(institution_profile_id) 
            WHERE i.user_id = ? AND e.banner_image IS NOT NULL`,
            [user_id]
        );

        // 2. Képek tömbjének összeállítása
        const allImages = [
            ...avatarImages.map(row => row.avatar_image),
            ...bannerImages.map(row => row.banner_image),
            ...storiesImages.map(row => row.banner_image),
            ...eventImages.map(row => row.banner_image)
        ];

        // 3. Duplikátumok eltávolítása
        const uniqueImages = [...new Set(allImages)];

        // 4. Felhasználó és kapcsolódó adatok törlése
        await pool.query('DELETE FROM users WHERE user_id = ?', [user_id]);

        // 5. Képek törlése
        for (const image of uniqueImages) {
            await deleteImage(image);
        }
        sendSuccessResponse(res, null, "Sikeres fióktörlés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};



// STORIES MANAGEMENT

exports.createStory = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { description } = req.body;
        const banner_image = req.file ? req.file.filename : null;

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const timestamp = moment().tz("Europe/Budapest").format("YYYY-MM-DD HH:mm:ss");

        await pool.query(
            "INSERT INTO stories (institution_profile_id, description, banner_image,  timestamp) VALUES (?, ?, ?, ?)",
            [institution_profile_id, description, banner_image,  timestamp]
        );

        const stories= await getStories(institution_profile_id, pool);

        sendSuccessResponse(res, stories, "Bejegyzés sikeresen létrehozva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateStory = async (req, res) => {
    try {
        const story_id = req.params.story_id;
        const user_id = req.user_id;
        const { description } = req.body;
        const banner_image = req.file ? req.file.filename : null;

        if(!story_id || isNaN(story_id)){
            return sendErrorResponse(res, 400,"Érvénytelen bejegyzésazonosító");
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [[old]] = await pool.query(
            "SELECT banner_image FROM stories WHERE story_id = ? AND institution_profile_id = ?",
            [story_id, institution_profile_id]
        );

        if(!old){
            // ezesetben a feltöltött elemet törölnünk kell
            if(banner_image) await deleteImage(banner_image);
            return sendErrorResponse(res, 404, "A bejegyzés nem található");
        }

        const [{affectedRows}] = await pool.query(
            "UPDATE stories SET description = ?, banner_image = ? WHERE story_id = ? AND institution_profile_id = ?",
            [description, banner_image, story_id, institution_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 404,"A fiókodban ilyen azonosítójú bejegyzés nem található");
        }

        if (old && old.banner_image) {
            await deleteImage(old.banner_image);
        }

        const stories= await getStories(institution_profile_id, pool);

        sendSuccessResponse(res, stories, "Bejegyzés sikeresen frissítve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.deleteStory = async (req, res) => {
    try {
        const story_id = req.params.story_id;
        const user_id = req.user_id;

        if(!story_id || isNaN(story_id)){
            return sendErrorResponse(res, 400,"Érvénytelen bejegyzésazonosító");
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [[old]] = await pool.query(
            "SELECT banner_image FROM stories WHERE story_id = ? AND institution_profile_id = ?",
            [story_id, institution_profile_id]
        );

        const [{ affectedRows }] = await pool.query(
            "DELETE FROM stories WHERE story_id = ? AND institution_profile_id = ?",
            [story_id, institution_profile_id]
        );        

        if(!affectedRows){
            return sendErrorResponse(res, 404, "A fiókodban ilyen azonosítójú bejegyzés nem található");
        }

        if (affectedRows && old && old.banner_image) {
            deleteImage(old.banner_image);
        }

        const stories= await getStories(institution_profile_id, pool);

        sendSuccessResponse(res, stories, "Bejegyzés sikeresen törölve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

// EVENTS MANAGEMENT

exports.createEvent = async (req, res) => {
    let connection;

    try {
        const user_id = req.user_id;
        const { event_start, event_end, title, location, description } = req.body;
        const banner_image = req.file ? req.file.filename : null;
        let event_links = [];
        if (req.body.event_links) {
            event_links = Array.isArray(req.body.event_links)
                ? req.body.event_links.map(link => typeof link === 'string' ? JSON.parse(link) : link)
                : JSON.parse(req.body.event_links);
        }

        const connection = await pool.getConnection();

        const institution_profile_id = await getInstitutionProfileId(user_id);

        await connection.beginTransaction();

        const TIMEZONE = "Europe/Budapest";

        const [{ insertId: eventId }] = await connection.query(
            "INSERT INTO events (event_start, event_end, title, location, description, institution_profile_id, banner_image) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [moment.tz(event_start, TIMEZONE).format("YYYY-MM-DD HH:mm:ss"), moment.tz(event_end, TIMEZONE).format("YYYY-MM-DD HH:mm:ss"), title, location, description, institution_profile_id, banner_image]
        );

        if(event_links.length){
            await connection.query(
                'INSERT INTO event_links (event_id,title, link) VALUES ?', 
                [event_links.map(item => [eventId, item.title, item.link])]
            );
        }

        const events = await getEvents(institution_profile_id, connection);

        await connection.commit();

        sendSuccessResponse(res, events, "Esemény sikeresen létrehozva");
    } catch (error) {
        console.error(error);
        if(connection) await connection.rollback();
        sendErrorResponse(res, 500, "Szerverhiba");
    } finally {
        if(connection) connection.release();
    }
};

exports.updateEvent = async (req, res) => {
    let connection;

    try {
        const eventId = req.params.event_id;
        const userId = req.user_id;
        const { event_start, event_end, title, location, description } = req.body;
        const banner_image = req.file ? req.file.filename : null;
        let event_links = [];
        if (req.body.event_links) {
            event_links = Array.isArray(req.body.event_links)
                ? req.body.event_links.map(link => typeof link === 'string' ? JSON.parse(link) : link)
                : JSON.parse(req.body.event_links);
        }

        const connection = await pool.getConnection();

        if (!eventId || isNaN(eventId)) {
            return sendErrorResponse(res, 400,"Érvénytelen eseményazonosító");
        }

        const institution_profile_id = await getInstitutionProfileId(userId);

        const [[oldEvent]] = await pool.query(
            "SELECT banner_image FROM events WHERE event_id = ? AND institution_profile_id = ?",
            [eventId, institution_profile_id]
        );

        await connection.beginTransaction();

        const TIMEZONE = "Europe/Budapest";

        const [{affectedRows}] = await connection.query(
            "UPDATE events SET event_start = ?, event_end = ?, title = ?, location = ?, description = ?, banner_image = ? WHERE event_id = ? AND institution_profile_id = ?",
            [moment.tz(event_start, TIMEZONE).format("YYYY-MM-DD HH:mm:ss"), moment.tz(event_end, TIMEZONE).format("YYYY-MM-DD HH:mm:ss") , title, location, description, banner_image, eventId, institution_profile_id]
        );
        
        if (!affectedRows) {
            return sendErrorResponse(res, 404,"A fiókodban ilyen azonosítójú esemény nem található");
        }

        await connection.query('DELETE FROM event_links WHERE event_id = ?', [eventId]);

        if(event_links.length){
            await connection.query(
                'INSERT INTO event_links (event_id,title, link) VALUES ?', 
                [event_links.map(item => [eventId, item.title, item.link])]
            );
        }

        if (oldEvent && oldEvent.banner_image) {
            deleteImage(oldEvent.banner_image);
        }

        const events = await getEvents(institution_profile_id, connection);

        await connection.commit();

        sendSuccessResponse(res, events, "Esemény sikeresen módosítva");
    } catch (error) {
        console.error(error);
        if(connection) await connection.rollback();
        sendErrorResponse(res, 500, "Szerverhiba");
    } finally {
        if(connection) connection.release();
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.event_id;
        const user_id = req.user_id;

        if (!eventId || isNaN(eventId)) {
            return sendErrorResponse(res, 400,"Érvénytelen eseményazonosító");
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [[oldEvent]] = await pool.query(
            "SELECT banner_image FROM events WHERE event_id = ? AND institution_profile_id = ?",
            [eventId, institution_profile_id]
        );

        const [{ affectedRows }] = await pool.query(
            "DELETE FROM events WHERE event_id = ? AND institution_profile_id = ?",
            [eventId, institution_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 404,"A fiókodban ilyen azonosítójú esemény nem található");
        }

        if (oldEvent && oldEvent.banner_image) {
            deleteImage(oldEvent.banner_image);
        }

        const events = await getEvents(institution_profile_id, pool);

        sendSuccessResponse(res, events, "Esemény sikeresen törölve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};


// PUBLIC CONTACT MANAGEMENT

exports.addPublicEmail = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { title, email } = req.body;

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!email){
            return sendErrorResponse(res, 400,'Az email mező nem lehet üres');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        await pool.query(
            "INSERT INTO public_emails (institution_profile_id, title, email) VALUES (?, ?, ?)",
            [institution_profile_id, title, email]
        );

        const [emails] = await pool.query(
            "SELECT public_email_id, title, email FROM public_emails WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        sendSuccessResponse(res, emails, "Email sikeresen hozzáadva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updatePublicEmail = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_email_id = req.params.public_email_id;
        const { title, email } = req.body;

        if (!public_email_id || isNaN(public_email_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!email){
            return sendErrorResponse(res, 400,'Az email mező nem lehet üres');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{affectedRows}] =  await pool.query(
            'UPDATE public_emails SET title = ?, email = ? WHERE public_email_id = ? AND institution_profile_id = ?',
            [title, email, public_email_id, institution_profile_id]
        );

        if(!affectedRows){
            return sendErrorResponse(res, 404,'A fiók nem rendelkezik ilyen azonosítójú publikus email címmel');
        }

        const [response] = await pool.query(
            'SELECT public_email_id, title, email FROM public_emails WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Email sikeresen módosítva");

    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.deletePublicEmail = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_email_id = req.params.public_email_id;

        if (!public_email_id || isNaN(public_email_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{ affectedRows }] = await pool.query(
            "DELETE FROM public_emails WHERE public_email_id = ? AND institution_profile_id = ?",
            [public_email_id, institution_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 404,"Nem létező emailt szeretnél törölni");
        }

        const [emails] = await pool.query(
            "SELECT public_email_id, title, email FROM public_emails WHERE institution_profile_id = ?",
            [institution_profile_id]
        );

        sendSuccessResponse(res, emails, "Email sikeresen törölve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.addPublicPhone = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { title, phone } = req.body;

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!phone){
            return sendErrorResponse(res, 400,'A telefon mező nem lehet üres');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        await pool.query(
            'INSERT INTO public_phones (institution_profile_id, title, phone) VALUES (?, ?, ?)',
            [institution_profile_id, title, phone]
        );

        const [response] = await pool.query(
            'SELECT public_phone_id, title, phone FROM public_phones WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Telefon sikeresen hozzáadva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.deletePublicPhone = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_phone_id = req.params.public_phone_id;

        if (!public_phone_id || isNaN(public_phone_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{ affectedRows }] = await pool.query(
            'DELETE FROM public_phones WHERE public_phone_id = ? AND institution_profile_id = ?',
            [public_phone_id, institution_profile_id]
        );

        if(!affectedRows){
            return sendErrorResponse(res, 404,'A fiók nem rendelkezik ilyen azonosítójú publikus telefonszámmal');
        }

        const [response] = await pool.query(
            'SELECT public_phone_id, title, phone FROM public_phones WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Telefon sikeresen törölve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updatePublicPhone = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_phone_id = req.params.public_phone_id;
        const { title, phone } = req.body;

        if (!public_phone_id || isNaN(public_phone_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!phone){
            return sendErrorResponse(res, 400,'A telefon mező nem lehet üres');
        }


        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{affectedRows}] = await pool.query(
            'UPDATE public_phones SET title = ?, phone = ? WHERE public_phone_id = ? AND institution_profile_id = ?',
            [title, phone, public_phone_id, institution_profile_id]
        );

        if(!affectedRows){
            return sendErrorResponse(res, 404,'A fiók nem rendelkezik ilyen azonosítójú publikus telefonszámmal');
        }

        const [response] = await pool.query(
            'SELECT public_phone_id, title, phone FROM public_phones WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Telefon sikeresen módosítva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.addPublicWebsite = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { title, website } = req.body;

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!website){
            return sendErrorResponse(res, 400,'A weboldal mező nem lehet üres');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        await pool.query(
            'INSERT INTO public_websites (institution_profile_id, title, website) VALUES (?, ?, ?)',
            [institution_profile_id, title, website]
        );

        const [response] = await pool.query(
            'SELECT public_website_id, title, website FROM public_websites WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Weboldal sikeresen hozzáadva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.deletePublicWebsite = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_website_id = req.params.public_website_id;

        if (!public_website_id || isNaN(public_website_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{ affectedRows }] = await pool.query(
            'DELETE FROM public_websites WHERE public_website_id = ? AND institution_profile_id = ?',
            [public_website_id, institution_profile_id]
        );

        if(!affectedRows){
            return sendErrorResponse(res, 404,'A fiók nem rendelkezik ilyen azonosítójú publikus weboldallal');
        }

        const [response] = await pool.query(
            'SELECT public_website_id, title, website FROM public_websites WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Weboldal sikeresen törölve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updatePublicWebsite = async (req, res) => {
    try {
        const user_id = req.user_id;
        const public_website_id = req.params.public_website_id;
        const { title, website } = req.body;

        if (!public_website_id || isNaN(public_website_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen azonosító adat');
        }

        if(!title){
            return sendErrorResponse(res, 400,'A megnevezés mező nem lehet üres');
        }

        if(!website){
            return sendErrorResponse(res, 400,'A weboldal mező nem lehet üres');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [{affectedRows}] = await pool.query(
            'UPDATE public_websites SET title = ?, website = ? WHERE public_website_id = ? AND institution_profile_id = ?',
            [title, website, public_website_id, institution_profile_id]
        );

        if(!affectedRows){
            return sendErrorResponse(res, 404,'A fiók nem rendelkezik ilyen azonosítójú publikus weboldallal');
        }

        const [response] = await pool.query(
            'SELECT public_website_id, title, website FROM public_websites WHERE institution_profile_id = ?',
            [institution_profile_id]
        );

        sendSuccessResponse(res, response, "Weboldal sikeresen módosítva");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};



// MESSAGING MANAGEMENT

exports.getMessagesVersion = async (req, res) => {
    try {
        const user_id = req.user_id;

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const version= await getMessagesVersion(institution_profile_id);

        sendSuccessResponse(res, { version });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getMessagingRoomVersion = async (req, res) => {
    try {
      const user_id = req.user_id;
      const institution_profile_id = await getInstitutionProfileId(user_id);
      const messaging_room_id = req.params.messaging_room_id;
      const [[{ version }]] = await pool.query(
        "SELECT COUNT(*) AS version FROM messages JOIN messaging_rooms USING(messaging_room_id) WHERE institution_profile_id = ? AND  messaging_room_id= ?",
        [institution_profile_id, messaging_room_id]
      );
  
      sendSuccessResponse(res, { version }, "Sikeres adatlekérés");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getMessagingRooms = async (req, res) => {
    try {
        const user_id = req.user_id;
        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [messaging_rooms] = await pool.query(
            `SELECT 
                mr.messaging_room_id,
                mr.person_profile_id,
                m.message AS last_message,
                m.timestamp AS last_message_time,
                m.from_person_profile
             FROM messaging_rooms AS mr
             JOIN messages AS m USING (messaging_room_id)
             WHERE mr.institution_profile_id = ?
             AND m.message_id = (
                 SELECT MAX(message_id)
                 FROM messages
                 WHERE messages.messaging_room_id = mr.messaging_room_id
             )
             ORDER BY m.timestamp DESC`,
            [institution_profile_id]
        );

        const rooms = await Promise.all(
            messaging_rooms.map(async (element) => {
                const [[person_profile]] = await pool.query(
                    `SELECT person_profile_id, avatar_image, name 
                     FROM person_profiles 
                     JOIN users USING(user_id) 
                     WHERE person_profile_id = ?`,
                    [element.person_profile_id]
                );

                return {
                    messaging_room_id: element.messaging_room_id,
                    last_message: element.last_message,
                    formatted_date: dynamicsDateTime(element.last_message_time),
                    from_person_profile: Boolean(element.from_person_profile),
                    person_profile: person_profile,
                };
            })
        );

        sendSuccessResponse(res, rooms);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = req.params.person_profile_id;
        const { message } = req.body;

        if (!person_profile_id || isNaN(person_profile_id) || !message) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [result] = await pool.query(
            'SELECT * FROM messaging_rooms WHERE person_profile_id=? AND institution_profile_id=?',
            [person_profile_id, institution_profile_id]
        );

        if (!result.length) {
            return sendErrorResponse(res, 400,'Intézmények nem kezdeményezhetnek új beszélgetést');
        }

        const room_id = result[0].messaging_room_id;

        const timestamp = moment().tz("Europe/Budapest").format("YYYY-MM-DD HH:mm:ss");

        const [{ insertId }] = await pool.query(
            'INSERT INTO messages (messaging_room_id, message, from_person_profile, timestamp) VALUES (?, ?, ?, ?)',
            [room_id, message, 0, timestamp]
        );

        const [[insert_message]] = await pool.query(
            'SELECT message_id, message, timestamp, from_person_profile FROM messages WHERE message_id=?',
            [insertId]
        );

        sendSuccessResponse(res, {
            messaging_room_id: room_id,
            message: {
                message_id: insert_message.message_id,
                message: insert_message.message,
                formatted_date: dynamicsDateTime(insert_message.timestamp),
                from_person_profile: Boolean(insert_message.from_person_profile),
            }
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    } 
};

exports.getMessagingRoom = async (req, res) => {
    try {
        const user_id = req.user_id;
        const messaging_room_id = req.params.messaging_room_id;

        if (!messaging_room_id  || isNaN(messaging_room_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const institution_profile_id = await getInstitutionProfileId(user_id);

        const [raw_messages] = await pool.query(
            `SELECT * 
             FROM messages 
             JOIN messaging_rooms USING(messaging_room_id) 
             WHERE messaging_room_id=? AND institution_profile_id=?
             ORDER BY message_id DESC`,
            [messaging_room_id, institution_profile_id]
        );

        if (!raw_messages.length) {
            return sendErrorResponse(res, 404,'Nem létező chat szoba');
        }

        const messages = raw_messages.map(element => ({
            message_id: element.message_id,
            message: element.message,
            formatted_date: dynamicsDateTime(element.timestamp),
            from_person_profile: Boolean(element.from_person_profile),
        }));

        const person_profile_id = raw_messages[0].person_profile_id;

        const [[person_profile]] = await pool.query(
            `SELECT person_profile_id, avatar_image, name 
             FROM person_profiles 
             JOIN users USING(user_id) 
             WHERE person_profile_id = ?`,
            [person_profile_id]
        );

        sendSuccessResponse(res, {
            messaging_room_id: parseInt(messaging_room_id),
            person_profile: person_profile,
            messages: messages,
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};