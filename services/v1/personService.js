const { pool } = require("../../config/db");
const fs = require("fs").promises;
const { validationResult } = require("express-validator");
const path = require("path");
const bcrypt = require("bcryptjs");
const { getMonthAsText, getDay, getFormatTime, dynamicsDateTime } = require("../../utils/dateHelper");
const { sendSuccessResponse, sendErrorResponse } = require("../../utils/responseHelper");
const moment = require('moment-timezone');

const getPersonProfileId = async (user_id) => {
    const [[{ person_profile_id }]] = await pool.query(
        "SELECT person_profile_id FROM person_profiles WHERE user_id = ?",
        [user_id]
    );
    return person_profile_id;
};

const deleteImage = async(image)=>{
    const oldImagePath = path.join(__dirname, "../..", "uploads", image);
    await fs.unlink(oldImagePath);
}

const getEventsData = async (person_profile_id, institutionIds, interested=false) => {
    
    const [rawEvents] = await pool.query(
        `SELECT e.event_id, e.event_start, e.event_end, e.title, e.location, e.description, 
                e.institution_profile_id, e.banner_image as cover_image, i.avatar_image, i.banner_image 
         FROM events AS e 
         JOIN institution_profiles AS i USING(institution_profile_id) 
         JOIN users AS u USING(user_id) 
         ${ (interested? 'JOIN interests AS s USING(event_id)':'') }
         WHERE e.institution_profile_id IN (?) 
         ${ (interested? 'AND s.person_profile_id = ?':'') }
         ORDER BY e.event_start ASC`,
        interested ? [institutionIds, person_profile_id] : [institutionIds]
    );

    return await Promise.all(rawEvents.map(async event => {
        const [eventLinks] = await pool.query(
            'SELECT * FROM event_links WHERE event_id = ?', 
            [event.event_id]
        );
        
        const [[{interested_count}]] = await pool.query(
            'SELECT COUNT(*) as interested_count FROM interests WHERE event_id=?',
            [event.event_id]
        );
        
        const [[{interested}]] = await pool.query(
            'SELECT COUNT(*) as interested FROM interests WHERE event_id=? AND person_profile_id = ?',
            [event.event_id, person_profile_id]
        );
        
        return {
            event_id: event.event_id,
            title: event.title,
            location: event.location,
            description: event.description,
            interested_count: interested_count,
            interested: Boolean(interested), 
            banner_image: event.cover_image,
            month: getMonthAsText(event.event_start),
            day: getDay(event.event_start),
            time: getFormatTime(event.event_start, event.event_end),
            start: event.event_start,
            end: event.event_end,
            event_links: eventLinks,
            institution_profile: {
                institution_profile_id: event.institution_profile_id,
                avatar_image: event.avatar_image,
                banner_image: event.banner_image,
            },
        };
    }));
}

const getStories = async (person_profile_id, institutionIds) =>  {
    const [rawStories] = await pool.query(
        `SELECT n.story_id, n.description, 
                (SELECT COUNT(*) FROM likes AS l WHERE l.story_id=n.story_id) AS likes, 
                (SELECT COUNT(*) FROM likes AS l WHERE l.story_id=n.story_id AND l.person_profile_id=?) AS liked, 
                n.timestamp, n.banner_image, i.institution_profile_id, i.avatar_image, u.name 
         FROM stories AS n 
         JOIN institution_profiles AS i USING(institution_profile_id) 
         JOIN users AS u USING(user_id) 
         WHERE n.institution_profile_id IN (?) 
         ORDER BY n.story_id DESC`, 
        [person_profile_id, institutionIds]
    );

    return rawStories.map(story => ({
        story_id: story.story_id,
        description: story.description,
        likes: story.likes,
        liked: Boolean(story.liked),
        formatted_datetime: dynamicsDateTime(story.timestamp),
        banner_image: story.banner_image,
        institution_profile: {
            institution_profile_id: story.institution_profile_id,
            avatar_image: story.avatar_image,
            name: story.name,
        }
    }));
}

exports.role = 'person';

exports.getHomeData = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);

        const [rawInstitutionIds] = await pool.query(
            `SELECT institution_profile_id 
             FROM following 
             JOIN institution_profiles USING (institution_profile_id)
             WHERE person_profile_id = ? AND is_enabled = 1`,
            [person_profile_id]
        );

        const [rawAllInstitutionIds] = await pool.query(
            `SELECT institution_profile_id 
             FROM institution_profiles WHERE is_enabled = 1`,
            [person_profile_id]
        );

        const institutionIds = rawInstitutionIds.map(row => row.institution_profile_id);
        const allInstitutionIds = rawAllInstitutionIds.map(row => row.institution_profile_id);

        let stories=[];
        if (institutionIds.length) {            
            stories = await getStories(person_profile_id, institutionIds);
        }

        let allEvents=[]
        if(institutionIds.length + allInstitutionIds.length){

            let events=[];
            if(institutionIds.length){
                events = await getEventsData(person_profile_id, institutionIds)
            }

            let interestedEvents=[];
            if(allInstitutionIds.length){
                interestedEvents = await getEventsData(person_profile_id, allInstitutionIds, true);
            }

            
            
            allEvents = [...new Map([...events, ...interestedEvents].map(event => [event.event_id, event])).values()]
                .sort((a, b) => new Date(a.event_start) - new Date(b.event_start));;
        }

        if(!(stories.length+allEvents.length)){
            return sendSuccessResponse(res, { events: [], stories: [] }, "Üres a hírfolyam");
        } 

        sendSuccessResponse(res, {  events: allEvents.slice(0, 3), stories }, "Sikeres adatlekérés");


        
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getHomeVersion = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);

        const [rawInstitutionIds] = await pool.query(
            `SELECT institution_profile_id 
             FROM following 
             JOIN institution_profiles USING (institution_profile_id)
             WHERE person_profile_id = ? AND is_enabled = 1`,
            [person_profile_id]
        );

        


        const institutionIds = rawInstitutionIds.map(row => row.institution_profile_id);
        
        let events=[];
        let stories=[];
        const [interested_events] = await pool.query(
            `SELECT event_id FROM events JOIN interests USING (event_id) 
                WHERE person_profile_id = ?`, [person_profile_id]
        )

        
        
        if (institutionIds.length) {
            [events] = await pool.query(
                `SELECT event_id FROM events WHERE institution_profile_id IN (?)`, 
                [institutionIds]
            );
            
            [stories] = await pool.query(
                `SELECT story_id FROM stories WHERE institution_profile_id IN (?)`, 
                [institutionIds]
            );
        }
        const version = events.length + stories.length + interested_events.length;
        console.log(events.length, stories.length, interested_events.length);
        console.log(version);
        
        

        sendSuccessResponse(res, { version});
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
}

exports.getEvents = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);

        const [rawInstitutionIds] = await pool.query(
            `SELECT institution_profile_id 
             FROM following 
             JOIN institution_profiles USING (institution_profile_id)
             WHERE person_profile_id = ? AND is_enabled = 1`,
            [person_profile_id]
        );
        const institutionIds = rawInstitutionIds.map(row => row.institution_profile_id);

        if (institutionIds.length) {
            const events = await getEventsData(person_profile_id, institutionIds);
            console.log("sikeres adatlekérés");
            
            return sendSuccessResponse(res,  events , "Sikeres adatlekérés");
        }

        sendSuccessResponse(res, [] , "Nincsenek események");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getInterestedEvents = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);

        const [rawAllInstitutionIds] = await pool.query(
            `SELECT institution_profile_id 
             FROM institution_profiles WHERE is_enabled = 1`
        ); // ha követem ha nem listázódik itt.
        const allInstitutionIds = rawAllInstitutionIds.map(row => row.institution_profile_id);

        if (allInstitutionIds.length) {
            const events = await getEventsData(person_profile_id, allInstitutionIds, true);
            console.log("sikeres adatlekérés");
            
            return sendSuccessResponse(res,  events , "Sikeres adatlekérés");
        }

        sendSuccessResponse(res, [] , "Nincsenek események");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.addEventInterest = async (req, res) => {
    try {
        const user_id = req.user_id;
        const event_id = req.params.event_id;

        if (!event_id || isNaN(event_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [[{ redundance }]] = await pool.query(
            'SELECT COUNT(*) AS redundance FROM interests WHERE event_id=? AND person_profile_id=?',
            [event_id, person_profile_id]
        );
        if (redundance) {
            return sendErrorResponse(res, 400,'Két érdeklődést nem adhatsz le egy esemény iránt');
        }

        await pool.query(
            'INSERT INTO interests (person_profile_id, event_id) VALUES (?, ?)', 
            [person_profile_id, event_id]
        );

        const [[{ interested_count }]] = await pool.query(
            'SELECT COUNT(*) AS interested_count FROM interests WHERE event_id=?',
            [event_id]
        );

        sendSuccessResponse(res, { interested_count }, "Sikeresen érdeklődtél az esemény után");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.removeEventInterest = async (req, res) => {
    try {
        const user_id = req.user_id;
        const event_id = req.params.event_id;

        if (!event_id || isNaN(event_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [{ affectedRows }] = await pool.query(
            'DELETE FROM interests WHERE event_id=? AND person_profile_id=?',
            [event_id, person_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 400,'Már vissza van vonva az érdeklődés');
        }

        const [[{ interested_count }]] = await pool.query(
            'SELECT COUNT(*) AS interested_count FROM interests WHERE event_id=?',
            [event_id]
        );

        sendSuccessResponse(res, { interested_count }, "Sikeresen unlájkolva a bejegyzés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.likeStory = async (req, res) => {
    try {
        const user_id = req.user_id;
        const story_id = req.params.story_id;

        if (!story_id || isNaN(story_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [[{ redundance }]] = await pool.query(
            'SELECT COUNT(*) AS redundance FROM likes WHERE story_id=? AND person_profile_id=?',
            [story_id, person_profile_id]
        );
        if (redundance) {
            return sendErrorResponse(res, 400,'Két lájkot nem adhatsz le egy bejegyzésre');
        }

        await pool.query(
            'INSERT INTO likes (person_profile_id, story_id) VALUES (?, ?)', 
            [person_profile_id, story_id]
        );

        const [[{ like_count }]] = await pool.query(
            'SELECT COUNT(*) AS like_count FROM likes WHERE story_id=?',
            [story_id]
        );

        sendSuccessResponse(res, { like_count }, "Sikeresen lájkolva a bejegyzés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.unlikeStory = async (req, res) => {
    try {
        const user_id = req.user_id;
        const story_id = req.params.story_id;

        if (!story_id || isNaN(story_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [{ affectedRows }] = await pool.query(
            'DELETE FROM likes WHERE story_id=? AND person_profile_id=?',
            [story_id, person_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 400,'Már vissza van vonva a lájk');
        }

        const [[{ like_count }]] = await pool.query(
            'SELECT COUNT(*) AS like_count FROM likes WHERE story_id=?',
            [story_id]
        );

        sendSuccessResponse(res, { like_count }, "Sikeresen unlájkolva a bejegyzés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM categories ORDER BY category_id ASC');
        sendSuccessResponse(res, result, "Sikeres adatlekérés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getInstitutionsByCategory = async (req, res) => {
    try {
        const category_id = req.params.category_id;
        if (!category_id || isNaN(category_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const [institution_profiles] = await pool.query(
            `SELECT institution_profile_id, avatar_image, name 
             FROM institution_profiles 
             JOIN users USING(user_id) 
             JOIN institution_categories USING(institution_profile_id) 
             WHERE category_id = ? AND is_enabled = 1`, 
             [category_id]
        );

        sendSuccessResponse(res, institution_profiles, "Sikeres adatlekérés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getInstitutionDetails = async (req, res) => {
    try {
        const user_id = req.user_id;
        const institution_profile_id = req.params.institution_profile_id;

        if (!institution_profile_id || isNaN(institution_profile_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [institution_profiles] = await pool.query(
            `SELECT * FROM institution_profiles 
             JOIN users USING(user_id)  
             WHERE institution_profile_id = ?`, 
             [institution_profile_id]
        );

        if (!institution_profiles.length) {
            return sendErrorResponse(res, 404,'Nem létező intézmény');
        }

        const events = await getEventsData(person_profile_id, [institution_profile_id]);

        const stories = await getStories(person_profile_id, [institution_profile_id]);

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
            `SELECT category_id, category 
             FROM institution_categories 
             JOIN categories USING(category_id) 
             WHERE institution_profile_id = ?`, 
             [institution_profile_id]
        );

        const [[{ follower_count }]] = await pool.query(
            `SELECT COUNT(*) AS follower_count 
             FROM following 
             WHERE institution_profile_id = ?`, 
             [institution_profile_id]
        );

        const [[{ is_followed }]] = await pool.query(
            `SELECT COUNT(*) AS is_followed 
             FROM following 
             WHERE institution_profile_id = ? 
             AND person_profile_id = ?`, 
             [institution_profile_id, person_profile_id]
        );

        sendSuccessResponse(res, {
            institution_profile_id: parseInt(institution_profile_id),
            name: institution_profiles[0].name,
            avatar_image: institution_profiles[0].avatar_image,
            banner_image: institution_profiles[0].banner_image,
            followers: follower_count,
            followed: Boolean(is_followed),
            description: institution_profiles[0].description,
            stories: stories,
            events: events,
            public_emails: publicEmails,
            public_phones: publicPhones,
            public_websites: publicWebsites,
            categories: categories,
        }, "Sikeres adatlekérés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};


exports.followInstitution = async (req, res) => {
    try {
        const user_id = req.user_id;
        const institution_profile_id = req.params.institution_profile_id;

        const person_profile_id = await getPersonProfileId(user_id);

        if (!institution_profile_id || isNaN(institution_profile_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const [[{ redundance }]] = await pool.query(
            "SELECT COUNT(*) AS redundance FROM following WHERE institution_profile_id = ? AND person_profile_id = ?", 
            [institution_profile_id, person_profile_id]
        );

        if (redundance) {
            return sendErrorResponse(res, 400,"Már követed az intézményt");
        }

        await pool.query(
            "INSERT INTO following (institution_profile_id, person_profile_id) VALUES (?, ?)", 
            [parseInt(institution_profile_id), person_profile_id]
        );

        const [[{ follower_count }]] = await pool.query(
            "SELECT COUNT(*) AS follower_count FROM following WHERE institution_profile_id = ?", 
            [institution_profile_id]
        );

        sendSuccessResponse(res, { follower_count }, "Az intézmény sikeresen követve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.unfollowInstitution = async (req, res) => {
    try {
        const user_id = req.user_id;
        const institution_profile_id = req.params.institution_profile_id;
        const person_profile_id = await getPersonProfileId(user_id);

        if (!institution_profile_id || isNaN(institution_profile_id)) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }

        const [{ affectedRows }] = await pool.query(
            "DELETE FROM following WHERE institution_profile_id = ? AND person_profile_id = ?", 
            [institution_profile_id, person_profile_id]
        );

        if (!affectedRows) {
            return sendErrorResponse(res, 400,"Már kikövetted");
        }

        const [[{ follower_count }]] = await pool.query(
            "SELECT COUNT(*) AS follower_count FROM following WHERE institution_profile_id = ?", 
            [institution_profile_id]
        );

        sendSuccessResponse(res, { follower_count }, "Az intézmény sikeresen kikövetve");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.getFollowesVersion = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);
        const [[{ version }]] = await pool.query(
            "SELECT COUNT(*) AS version FROM following WHERE person_profile_id = ?", 
            [person_profile_id]
        );
    
        sendSuccessResponse(res, { version }, "Sikeres adatlekérés");
      } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
      }
}

exports.getFollowes = async (req, res) => {
    try {
        const user_id = req.user_id;
        const person_profile_id = await getPersonProfileId(user_id);

        const [followed_institutions] = await pool.query(
            "SELECT * FROM following JOIN institution_profiles USING(institution_profile_id) JOIN users USING(user_id) WHERE person_profile_id = ?", 
            [person_profile_id]
        );

        const institution_profiles = followed_institutions.map(element => ({
            institution_profile_id: element.institution_profile_id,
            avatar_image: element.avatar_image,
            name: element.name,
        }));
    
        sendSuccessResponse(res, institution_profiles, "Sikeres adatlekérés");
      } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
      }
}

exports.getPersonProfile = async (req, res) => {
    try {
        const user_id = req.user_id;

        const [[user]] = await pool.query(
            "SELECT * FROM person_profiles JOIN users USING(user_id) WHERE user_id = ?", 
            [user_id]
        );

        const [followed_institutions] = await pool.query(
            "SELECT * FROM following JOIN institution_profiles USING(institution_profile_id) JOIN users USING(user_id) WHERE person_profile_id = ?", 
            [user.person_profile_id]
        );

        const institution_profiles = followed_institutions.map(element => ({
            institution_profile_id: element.institution_profile_id,
            avatar_image: element.avatar_image,
            name: element.name,
        }));

        sendSuccessResponse(res, {
            avatar_image: user.avatar_image,
            name: user.name,
            email: user.email,
            followed_institutions: institution_profiles,
        }, "Sikeres adatlekérés");
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.isEnabled = async (req, res) => {
    sendSuccessResponse(res, null, "A fiók engedélyezve van");
};

exports.isAccepted = async (req, res) => {
    sendSuccessResponse(res, null, "A fiók jóváhagyásra került");
};

exports.updateAvatar = async (req, res) => {
    try {
        const user_id = req.user_id;
        const avatar_image = req.file ? req.file.filename : null;

        if (!avatar_image) {
            return sendErrorResponse(res, 400,"Kötelező képet megadni");
        }

        const [[old]] = await pool.query(
            "SELECT avatar_image FROM person_profiles WHERE user_id = ?", 
            [user_id]
        );

        await pool.query("UPDATE person_profiles SET avatar_image = ? WHERE user_id = ?", [avatar_image, user_id]);

        if (old.avatar_image && old.avatar_image  !== "default_avatar.jpg") {
            await deleteImage(old.avatar_image );
        }

        const [[new_data]] = await pool.query(
            "SELECT avatar_image FROM person_profiles WHERE user_id = ?", 
            [user_id]
        );

        sendSuccessResponse(res, { 
            avatar_image: new_data.avatar_image 
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    }
};

exports.updateName = async (req, res) => {
    try {
        const user_id = req.user_id;
        const { name } = req.body;

        if (!name) {
            return sendErrorResponse(res, 400,'A név mező nem lehet üres');
        }

        await pool.query(
            "UPDATE users SET name = ? WHERE user_id = ?", 
            [name, user_id]
        );

        const [[response]] = await pool.query(
            "SELECT name FROM users WHERE user_id = ?", 
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
        const user_id = req.user_id;
        const { email } = req.body;

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
            "UPDATE users SET email = ? WHERE user_id = ?", 
            [email, user_id]
        );

        const [[response]] = await pool.query(
            "SELECT email FROM users WHERE user_id = ?", 
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
        const user_id = req.user_id;
        const { current_password, new_password } = req.body;
    
        if (!current_password || !new_password) {
            return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
        }
    
        const [[{ password }]] = await pool.query(
            "SELECT password FROM users WHERE user_id = ?", 
            [user_id]
        );

        const isMatch = await bcrypt.compare(current_password, password);
    
        if (!isMatch) {
            return sendErrorResponse(res, 400, 'Helytelen jelszót adtál meg');
        }
    
        const hash = await bcrypt.hash(new_password, 10);
        await pool.query(
            "UPDATE users SET password = ? WHERE user_id = ?", 
            [hash, user_id]
        );
    
        sendSuccessResponse(res, null, "Jelszó sikeresen módosítva");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Szerverhiba");
    }
};
  
exports.deleteProfile = async (req, res) => {
    try {
      const user_id = req.user_id;
  
      const [result] = await pool.query(
        "SELECT p.avatar_image FROM person_profiles AS p WHERE p.user_id = ? AND p.avatar_image <> 'default_avatar.jpg'",
        [user_id]
      );
  
      await pool.query("DELETE FROM users WHERE user_id = ?", [user_id]);
  
      if (result.length === 1) {
        const image = result[0].avatar_image;
        await deleteImage(image)
      }
  
      sendSuccessResponse(res, null, "Sikeres fióktörlés");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Szerverhiba");
    }
};
  
exports.getMessagesVersion = async (req, res) => {
    try {
      const user_id = req.user_id;
      const person_profile_id = await getPersonProfileId(user_id);
      const [[{ version }]] = await pool.query(
        "SELECT COUNT(*) AS version FROM messages JOIN messaging_rooms USING(messaging_room_id) WHERE person_profile_id = ?",
        [person_profile_id]
      );
  
      sendSuccessResponse(res, { version }, "Sikeres adatlekérés");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Szerverhiba");
    }
};



exports.getMessagingRoomVersion = async (req, res) => {
    try {
      const user_id = req.user_id;
      const person_profile_id = await getPersonProfileId(user_id);
      const messaging_room_id = req.params.messaging_room_id;
      const [[{ version }]] = await pool.query(
        "SELECT COUNT(*) AS version FROM messages JOIN messaging_rooms USING(messaging_room_id) WHERE person_profile_id = ? AND  messaging_room_id= ?",
        [person_profile_id, messaging_room_id]
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
      const person_profile_id = await getPersonProfileId(user_id);
  
      const [messaging_rooms] = await pool.query(
        `SELECT 
            mr.messaging_room_id,
            mr.institution_profile_id,
            m.message AS last_message,
            m.timestamp AS last_message_time,
            m.from_person_profile
         FROM messaging_rooms AS mr
         JOIN messages AS m USING (messaging_room_id)
         WHERE mr.person_profile_id = ?
         AND m.message_id = (
            SELECT MAX(message_id)
            FROM messages
            WHERE messages.messaging_room_id = mr.messaging_room_id
         )
         ORDER BY m.timestamp DESC`,
        [person_profile_id]
      );
  
      const rooms = await Promise.all(
        messaging_rooms.map(async (element) => {
          const [[institution_profile]] = await pool.query(
            `SELECT institution_profile_id, avatar_image, name
             FROM institution_profiles 
             JOIN users USING(user_id) 
             WHERE institution_profile_id = ?`,
            [element.institution_profile_id]
          );
  
          return {
            messaging_room_id: element.messaging_room_id,
            last_message: element.last_message,
            formatted_date: dynamicsDateTime(element.last_message_time),
            from_person_profile: Boolean(element.from_person_profile),
            institution_profile: institution_profile,
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
    let connection;
    try {
        const user_id = req.user_id;
        const institution_profile_id = req.params.institution_profile_id;
        const { message } = req.body;

        if (!institution_profile_id || !message || isNaN(institution_profile_id)) {
            return sendErrorResponse(res, 400, "Érvénytelen bemeneti adat");
        }

        const person_profile_id = await getPersonProfileId(user_id);

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            "SELECT * FROM messaging_rooms WHERE person_profile_id = ? AND institution_profile_id = ?",
            [person_profile_id, institution_profile_id]
        );

        let room_id;

        if (!result.length) {
            const [{ insertId }] = await connection.query(
                "INSERT INTO messaging_rooms (person_profile_id, institution_profile_id) VALUES (?, ?)",
                [person_profile_id, institution_profile_id]
            );
            room_id = insertId;
        } else {
            room_id = result[0].messaging_room_id;
        }

        const timestamp = moment().tz("Europe/Budapest").format("YYYY-MM-DD HH:mm:ss");

        const [{ insertId }] = await connection.query(
            "INSERT INTO messages (messaging_room_id, message, from_person_profile, timestamp) VALUES (? , ?, ?, ?)",
            [room_id, message, 1, timestamp]
        );

        const [[insert_message]] = await connection.query(
            "SELECT message_id, message, timestamp, from_person_profile FROM messages WHERE message_id = ?",
            [insertId]
        );

        await connection.commit();

        sendSuccessResponse(res, {
            messaging_room_id: room_id,
            message: {
                message_id: insert_message.message_id,
                message: insert_message.message,
                formatted_date: dynamicsDateTime(insert_message.timestamp),
                from_person_profile: Boolean(insert_message.from_person_profile),
            },
        }, "Üzenet sikeresen elküldve");
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    } finally {
        if (connection) connection.release();
    }
};


exports.getMessagingRoom = async (req, res) => {
    try {
      const user_id = req.user_id;
      const messaging_room_id = req.params.messaging_room_id;
  
      if (!messaging_room_id || isNaN(messaging_room_id)) {
        return sendErrorResponse(res, 400,'Érvénytelen bemeneti adat');
      }
  
      const person_profile_id = await getPersonProfileId(user_id);
  
      const [raw_messages] = await pool.query(
        `SELECT * FROM messages 
         JOIN messaging_rooms USING(messaging_room_id) 
         WHERE messaging_room_id = ? AND person_profile_id = ? 
         ORDER BY message_id DESC`,
        [messaging_room_id, person_profile_id]
      );
  
      if (!raw_messages.length) {
        return sendErrorResponse(res, 404,"Nem létező chat szoba");
      }
  
      const messages = raw_messages.map((element) => ({
        message_id: element.message_id,
        message: element.message,
        formatted_date: dynamicsDateTime(element.timestamp),
        from_person_profile: Boolean(element.from_person_profile),
      }));
  
      const institution_profile_id = raw_messages[0].institution_profile_id;
      const [[institution_profile]] = await pool.query(
        `SELECT institution_profile_id, avatar_image, name 
         FROM institution_profiles 
         JOIN users USING(user_id) 
         WHERE institution_profile_id = ?`,
        [institution_profile_id]
      );
  
      sendSuccessResponse(res, {
        messaging_room_id: parseInt(messaging_room_id),
        institution_profile: institution_profile,
        messages: messages,
      }, "Sikeres adatlekérés");
    } catch (error) {
      console.error(error);
      sendErrorResponse(res, 500, "Szerverhiba");
    }
  };
  
exports.findOrCreateMessagingRoom = async (req, res) => {
    let connection;
    try {
        const user_id = req.user_id;
        const institution_profile_id = req.params.institution_profile_id;

        if (!institution_profile_id || isNaN(institution_profile_id)) {
            return sendErrorResponse(res, 400, "Érvénytelen bemeneti adat");
        }

        const person_profile_id = await getPersonProfileId(user_id);

        const [messaging_room] = await pool.query(
            `SELECT * FROM messaging_rooms 
             WHERE institution_profile_id = ? AND person_profile_id = ?`,
            [institution_profile_id, person_profile_id]
        );

        connection = await pool.getConnection();

        let messaging_room_id;

        if (!messaging_room.length) {
            const [{ insertId }] = await connection.query(
                `INSERT INTO messaging_rooms (person_profile_id, institution_profile_id) VALUES (?, ?)`,
                [person_profile_id, institution_profile_id]
            );
            messaging_room_id = insertId;
        } else {
            messaging_room_id = messaging_room[0].messaging_room_id;
        }

        const [raw_messages] = await connection.query(
            `SELECT * FROM messages 
             JOIN messaging_rooms USING(messaging_room_id) 
             WHERE institution_profile_id = ? AND person_profile_id = ? 
             ORDER BY message_id DESC`,
            [institution_profile_id, person_profile_id]
        );

        const messages = raw_messages.map((element) => ({
            message_id: element.message_id,
            message: element.message,
            formatted_date: dynamicsDateTime(element.timestamp),
            from_person_profile: Boolean(element.from_person_profile),
        }));

        const [[institution_profile]] = await connection.query(
            `SELECT institution_profile_id, avatar_image, name 
             FROM institution_profiles 
             JOIN users USING(user_id) 
             WHERE institution_profile_id = ?`,
            [parseInt(institution_profile_id)]
        );

        sendSuccessResponse(
            res,
            {
                messaging_room_id: parseInt(messaging_room_id),
                institution_profile: institution_profile,
                messages: messages,
            },
            "Sikeres adatlekérés"
        );
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, "Szerverhiba");
    } finally {
        if (connection) connection.release();
    }
};
