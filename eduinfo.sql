-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost
-- Létrehozás ideje: 2025. Már 09. 15:05
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `eduinfo`
--
CREATE DATABASE IF NOT EXISTS `eduinfo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eduinfo`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` int(10) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`category_id`, `category`) VALUES
(5, 'Általános iskolák'),
(7, 'Egyéb képző intézmények'),
(1, 'Egyetemek'),
(2, 'Gimnáziumok'),
(6, 'Óvodák'),
(4, 'Szakképzők'),
(3, 'Technikumok');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `event_id` int(10) UNSIGNED NOT NULL,
  `event_start` datetime NOT NULL,
  `event_end` datetime NOT NULL,
  `title` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `banner_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `events`
--

INSERT INTO `events` (`event_id`, `event_start`, `event_end`, `title`, `location`, `description`, `institution_profile_id`, `banner_image`) VALUES
(73, '2025-11-07 10:37:00', '2025-01-03 23:59:00', 'DExpo nyílt nap', 'Debreceni Egyetem Főépület', 'RÉSZLETES PROGRAM hamarosan az UD Studyversity applikáció - DExpo fül alatt\nA Debreceni Egyetem 19 éve indította útjára központi beiskolázási rendezvényét, a DExpo-t', 7, NULL),
(76, '2025-03-10 21:34:00', '2025-01-05 23:59:00', 'nyílt nap', 'Debrecen, Budai Ézsaiás utca 8/A', '', 10, NULL),
(82, '2025-04-07 01:57:00', '2025-01-07 02:59:00', 'Nyílt Nap ', 'Nyíregyháza, Sóstói út 31/B, 4400', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis id lorem eget nulla euismod laoreet ut in nunc. Nunc turpis eros, molestie sed lacinia non, hendrerit eu mauris. ', 16, NULL),
(85, '2026-05-20 16:30:00', '2024-05-20 17:30:00', 'hello nap', 'hello udvar', 'hello', 16, '407c0980-2807-4071-9737-3559efd15c21-favicon.png'),
(86, '2026-05-20 16:30:00', '2024-05-20 17:30:00', 'csővike nap', 'csövike udvar', 'hello', 16, NULL),
(91, '2026-05-20 16:30:00', '2024-05-20 17:30:00', 'hello nap', 'hello udvar', 'hello', 16, '85a509c7-8df8-428d-84c5-83b49a79e978-favicon.png'),
(93, '2026-02-28 12:39:00', '2025-01-27 01:59:00', 'abraca dabra', 'kiss barack', 'ewewewdqsdqwd', 16, NULL),
(94, '2025-01-26 11:03:29', '2025-01-26 23:59:00', 'fff', '', '', 16, 'ec0d2bc0-905f-4c30-a721-6dff236c5121-1000000038.jpg'),
(95, '2025-01-26 11:03:53', '2025-01-26 23:59:00', 'drrr', '', '', 16, NULL),
(96, '2025-01-26 11:04:08', '2025-01-26 23:59:00', 'eree', '', '', 16, '9aecd813-fa6e-4909-8e5f-9eaefcadaf14-1000000034.jpg'),
(97, '2025-01-26 11:07:09', '2025-01-26 23:59:00', 'kj', '', '', 16, NULL),
(98, '2025-01-26 11:10:11', '2025-01-26 23:59:00', 'sassa', '', '', 16, NULL),
(99, '2025-01-26 11:10:20', '2025-01-26 23:59:00', 'jj', '', '', 16, NULL),
(101, '2025-01-26 13:10:41', '2025-01-27 01:59:00', 'juuuu', '', '', 16, '2a97cc82-274f-43ea-b57e-df9a0d42dad4-ea7142f3-d71e-4fa9-b26c-e04080a6a603-4992e616-aa36-4273-9d7c-4e4895ff40de-1000000034.jpg'),
(104, '2025-02-07 22:31:10', '2025-02-07 23:59:00', '', '', '', 16, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `event_links`
--

DROP TABLE IF EXISTS `event_links`;
CREATE TABLE `event_links` (
  `event_link_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `event_links`
--

INSERT INTO `event_links` (`event_link_id`, `event_id`, `title`, `link`) VALUES
(91, 82, 'facebook', 'Facebook'),
(112, 86, 'youtube', 'http'),
(113, 86, 'youtube', 'http'),
(116, 91, 'youtube', 'http'),
(117, 91, 'youtube', 'http'),
(126, 93, 'alma', 'http://sdsdd.ghz');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `following`
--

DROP TABLE IF EXISTS `following`;
CREATE TABLE `following` (
  `person_profile_id` int(10) UNSIGNED NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `following`
--

INSERT INTO `following` (`person_profile_id`, `institution_profile_id`) VALUES
(28, 7),
(14, 16),
(19, 16);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `institution_categories`
--

DROP TABLE IF EXISTS `institution_categories`;
CREATE TABLE `institution_categories` (
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `institution_categories`
--

INSERT INTO `institution_categories` (`institution_profile_id`, `category_id`) VALUES
(7, 1),
(10, 3),
(16, 1),
(16, 2),
(16, 3);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `institution_profiles`
--

DROP TABLE IF EXISTS `institution_profiles`;
CREATE TABLE `institution_profiles` (
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `avatar_image` varchar(255) NOT NULL DEFAULT 'default_avatar.jpg',
  `banner_image` varchar(255) NOT NULL DEFAULT 'default_banner.jpg',
  `description` longtext NOT NULL DEFAULT '',
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `is_accepted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `institution_profiles`
--

INSERT INTO `institution_profiles` (`institution_profile_id`, `user_id`, `avatar_image`, `banner_image`, `description`, `is_enabled`, `is_accepted`) VALUES
(1, 25, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 1),
(4, 30, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 1),
(7, 37, 'dc72f8e5-a739-454b-94af-fb4eb603f77a-1000029593.jpg', 'd69519d9-a670-4d0f-ac3c-ac507cc0c229-1000029594.jpg', 'A Debreceni Egyetem tehetséggondozói munkája hosszú múltra tekint vissza. Kezdetben a TDK műhelyek tartoztak szorosan a tehetséggondozáshoz, majd 2000-től, a Debreceni Egyetem Tehetséggondozó Programjának megalapításától a DETEP és a Tehetségtanács felügyelete alá tartoznak a TDK műhelyeken túl a szakkollégiumok is.', 1, 1),
(10, 49, 'default_avatar.jpg', 'default_banner.jpg', 'csak a baross, szoftverfejlesztő- és tesztelő powa', 1, 1),
(16, 55, 'ad95e2c7-3cfd-46fc-82b6-2ca4d6be6d80-1000000036.png', '445b3b22-9d24-4860-8dda-dd256c6e08b9-1000000034.jpg', '', 1, 1),
(21, 65, 'default_avatar.jpg', 'default_banner.jpg', '', 0, 1),
(22, 67, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 0),
(23, 68, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 0),
(24, 69, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 0),
(25, 70, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 0),
(26, 71, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 0),
(27, 72, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 1),
(28, 73, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 1),
(29, 74, 'default_avatar.jpg', 'default_banner.jpg', '', 1, 1),
(30, 75, 'default_avatar.jpg', 'default_banner.jpg', '', 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `interests`
--

DROP TABLE IF EXISTS `interests`;
CREATE TABLE `interests` (
  `person_profile_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `likes`
--

DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes` (
  `person_profile_id` int(10) UNSIGNED NOT NULL,
  `story_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `likes`
--

INSERT INTO `likes` (`person_profile_id`, `story_id`) VALUES
(19, 97),
(19, 100),
(19, 120);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `message_id` int(10) UNSIGNED NOT NULL,
  `messaging_room_id` int(10) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` longtext NOT NULL,
  `from_person_profile` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `messages`
--

INSERT INTO `messages` (`message_id`, `messaging_room_id`, `timestamp`, `message`, `from_person_profile`) VALUES
(142, 22, '2025-01-05 20:18:14', 'helló', 1),
(148, 28, '2025-01-05 20:35:32', 'végre egy elit iskola', 1),
(151, 28, '2025-01-05 20:37:59', 'a legjobbak listáján azért nem vagyunk feltüntetve, mert nem ismerik, hogy a tömbök elemeinek indexe 0-val kezdődik...', 0),
(154, 28, '2025-01-05 20:38:23', '😆😆😆', 1),
(157, 28, '2025-01-05 20:40:14', 'gifet nem lehet küldeni 😢', 0),
(160, 28, '2025-01-05 20:40:45', 'ez nem bug', 1),
(163, 28, '2025-01-05 20:40:57', 'csak egy feature', 1),
(166, 28, '2025-01-05 20:43:29', 'microsoft gyanús termék', 0),
(169, 34, '2025-01-07 10:23:41', 'fgg', 1),
(172, 34, '2025-01-08 06:08:38', 'gjh', 1),
(175, 34, '2025-01-21 06:42:18', 'hi!', 0),
(176, 34, '2025-01-21 06:42:44', 'hi!', 0),
(177, 34, '2025-01-21 06:43:02', 'hi!', 0),
(178, 34, '2025-01-23 19:41:59', 'hi!', 0),
(179, 34, '2025-01-26 10:26:06', 'sziaaa', 1),
(180, 34, '2025-01-26 10:28:44', 'sziaaa', 1),
(181, 34, '2025-01-26 10:31:16', 'sziaaa', 1),
(182, 34, '2025-01-26 10:47:40', 'sziaaa', 1),
(183, 34, '2025-01-26 10:48:12', 'dds', 0),
(184, 34, '2025-01-26 10:49:05', 'ada', 0),
(185, 34, '2025-01-26 10:49:16', 'sziaaa', 1),
(186, 34, '2025-01-26 10:49:25', 'sziaaa', 1),
(187, 34, '2025-01-26 10:50:48', 'sziaaa', 1),
(188, 34, '2025-01-26 10:51:48', 'sziaaa', 1),
(189, 34, '2025-01-26 10:51:56', 'dssd', 0),
(190, 34, '2025-01-26 10:54:40', 'sziaaa', 1),
(191, 34, '2025-01-26 10:55:44', 'kkk', 0),
(192, 34, '2025-01-26 10:55:55', 'sziaaa', 1),
(193, 34, '2025-01-26 14:22:05', 'gfg', 0),
(194, 34, '2025-01-31 14:25:15', 'rwr', 1),
(195, 28, '2025-01-31 14:25:30', 'fsfd', 1),
(196, 31, '2025-01-31 14:25:49', 'sds', 1),
(197, 34, '2025-01-31 15:50:27', 'hi!', 0),
(198, 34, '2025-01-31 15:53:57', 'sziaaa', 1),
(199, 34, '2025-01-31 17:26:26', 'gg', 1),
(200, 34, '2025-01-31 17:27:04', 'mm', 1),
(201, 34, '2025-01-31 18:07:27', 'sss', 1),
(202, 34, '2025-01-31 18:07:35', 'ss', 1),
(203, 34, '2025-01-31 18:08:17', 'hi!', 0),
(204, 34, '2025-01-31 18:08:23', 'dsd', 1),
(205, 34, '2025-01-31 18:08:26', 'hi!', 0),
(206, 34, '2025-01-31 18:11:11', 'jjjuuuui', 1),
(207, 34, '2025-01-31 18:11:18', 'hi!', 0),
(208, 34, '2025-01-31 18:11:22', 'kk', 1),
(209, 34, '2025-01-31 18:11:26', 'hi!', 0),
(210, 34, '2025-01-31 18:18:52', 'gg', 1),
(211, 34, '2025-01-31 18:19:11', 'hi!', 0),
(212, 34, '2025-01-31 18:19:16', 'tt', 1),
(213, 34, '2025-01-31 18:19:24', 'hi!', 0),
(214, 34, '2025-01-31 18:19:28', 'r', 1),
(215, 34, '2025-01-31 18:21:10', 'gg', 1),
(216, 34, '2025-01-31 18:21:20', 'ttt', 1),
(217, 34, '2025-01-31 18:24:22', 'ooo', 1),
(218, 34, '2025-01-31 18:24:27', 'pppp', 1),
(219, 34, '2025-01-31 18:24:34', 'hi!', 0),
(220, 34, '2025-01-31 18:24:43', 'iii', 1),
(221, 34, '2025-01-31 18:32:42', 'gjch', 1),
(222, 34, '2025-01-31 18:32:47', 'hi!', 0),
(223, 34, '2025-01-31 18:32:54', 'ss', 1),
(224, 34, '2025-01-31 18:32:56', 'hi!', 0),
(225, 34, '2025-01-31 18:55:08', 'a', 1),
(226, 34, '2025-01-31 18:55:28', 'ggg', 1),
(227, 34, '2025-01-31 19:01:42', 'cc', 1),
(228, 34, '2025-01-31 19:03:32', 'vv', 1),
(229, 34, '2025-01-31 19:03:37', 'gg', 1),
(230, 34, '2025-01-31 19:07:32', 'dsfsf', 1),
(231, 34, '2025-01-31 19:08:08', 'yyx', 0),
(232, 34, '2025-01-31 19:08:22', 'gg', 0),
(233, 34, '2025-01-31 19:08:41', 'sziaaa', 1),
(234, 34, '2025-01-31 19:19:02', 'fdddd', 1),
(235, 34, '2025-01-31 19:19:05', 'dssd', 1),
(236, 34, '2025-01-31 19:19:08', 'dsssd', 1),
(237, 34, '2025-01-31 19:19:10', 'dssdsd', 1),
(238, 34, '2025-01-31 19:32:22', 'uhh', 1),
(239, 34, '2025-01-31 19:33:51', 'mm', 1),
(240, 34, '2025-01-31 19:34:49', 'kkk', 1),
(241, 34, '2025-01-31 19:43:44', 'kk', 1),
(242, 34, '2025-01-31 19:48:16', 'ggg', 1),
(243, 34, '2025-01-31 19:49:41', 'vvff', 1),
(244, 34, '2025-01-31 19:52:05', 'xxx', 1),
(245, 34, '2025-01-31 19:59:34', 'eeee', 1),
(246, 34, '2025-01-31 20:01:51', 'KJJJ', 1),
(247, 34, '2025-01-31 20:02:26', 'ttt', 1),
(248, 34, '2025-01-31 20:23:47', 'hjh', 1),
(249, 34, '2025-01-31 20:24:03', 'kkk', 1),
(250, 34, '2025-01-31 20:24:21', 'ccc', 1),
(251, 34, '2025-01-31 20:27:44', 'ssss', 1),
(252, 34, '2025-01-31 20:28:59', 'ssss', 1),
(253, 34, '2025-02-07 17:44:28', 'u', 0),
(254, 34, '2025-02-07 21:15:26', 'jhhjjh', 0),
(255, 34, '2025-02-07 21:15:35', 'jhhj', 0),
(256, 34, '2025-02-07 20:15:59', 'fdfd', 1),
(257, 34, '2025-02-07 20:16:37', 'tt', 1),
(258, 34, '2025-02-07 21:19:03', 'dsdsd', 1),
(259, 34, '2025-02-07 21:31:39', 'fff', 0),
(260, 34, '2025-02-07 21:32:33', 'gg', 1),
(261, 34, '2025-03-09 12:40:56', 'dsds', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `messaging_rooms`
--

DROP TABLE IF EXISTS `messaging_rooms`;
CREATE TABLE `messaging_rooms` (
  `messaging_room_id` int(10) UNSIGNED NOT NULL,
  `person_profile_id` int(10) UNSIGNED NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `messaging_rooms`
--

INSERT INTO `messaging_rooms` (`messaging_room_id`, `person_profile_id`, `institution_profile_id`) VALUES
(5, 11, 1),
(22, 28, 7),
(28, 19, 10),
(31, 19, 7),
(34, 19, 16);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `person_profiles`
--

DROP TABLE IF EXISTS `person_profiles`;
CREATE TABLE `person_profiles` (
  `person_profile_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `avatar_image` varchar(255) NOT NULL DEFAULT 'default_avatar.jpg',
  `is_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `is_accepted` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `person_profiles`
--

INSERT INTO `person_profiles` (`person_profile_id`, `user_id`, `avatar_image`, `is_enabled`, `is_accepted`) VALUES
(11, 19, '7a28fb15-8e61-4e76-bc25-00a7cf1765a4-1000000035.jpg', 1, 1),
(13, 23, 'default_avatar.jpg', 1, 1),
(14, 24, 'default_avatar.jpg', 1, 1),
(15, 29, 'default_avatar.jpg', 1, 1),
(19, 34, '428494b2-4bad-4f37-947c-f3ad407ccc0f-1000000034.jpg', 1, 1),
(25, 43, 'default_avatar.jpg', 1, 1),
(28, 46, '040425bb-684e-411a-8922-3b14bf9509a5-1000014426.jpg', 1, 1),
(31, 58, 'default_avatar.jpg', 1, 1),
(34, 66, 'default_avatar.jpg', 0, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `public_emails`
--

DROP TABLE IF EXISTS `public_emails`;
CREATE TABLE `public_emails` (
  `public_email_id` int(10) UNSIGNED NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `public_emails`
--

INSERT INTO `public_emails` (`public_email_id`, `institution_profile_id`, `title`, `email`) VALUES
(13, 7, 'központi e-mail', 'info@unideb.hu'),
(16, 10, 'csak a baross', '1376791070'),
(23, 16, 'publikus', 'hello@public.hu'),
(24, 16, 'abra', 'kadabra2mai.com'),
(25, 16, 'Sasa', 'as');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `public_phones`
--

DROP TABLE IF EXISTS `public_phones`;
CREATE TABLE `public_phones` (
  `public_phone_id` int(10) UNSIGNED NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `public_phones`
--

INSERT INTO `public_phones` (`public_phone_id`, `institution_profile_id`, `title`, `phone`) VALUES
(19, 7, 'központi szám', '(06 52) 512 900'),
(22, 10, 'hívj ha kellek', '+3652111222'),
(32, 16, 'Hallgatói Információs központi', '+36 (42) 599-400'),
(33, 16, 'dsff', 'dsds'),
(34, 16, 'dhf', '+36300');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `public_websites`
--

DROP TABLE IF EXISTS `public_websites`;
CREATE TABLE `public_websites` (
  `public_website_id` int(10) UNSIGNED NOT NULL,
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `website` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `public_websites`
--

INSERT INTO `public_websites` (`public_website_id`, `institution_profile_id`, `title`, `website`) VALUES
(10, 7, 'központi weboldal', 'https://unideb.hu/hu/telefonkonyv'),
(13, 7, 'felvételi', 'https://felveteli.unideb.hu/'),
(19, 16, 'Főoldal', 'nye.hu'),
(22, 16, 'Weboldal', 'https://nye.hu'),
(24, 16, 'sjsjjs', 'sssss'),
(25, 16, 'fdfsdfdoooooooooo', 'fdfdf');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int(10) UNSIGNED NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `roles`
--

INSERT INTO `roles` (`role_id`, `role`) VALUES
(1, 'admin'),
(3, 'institution'),
(2, 'person');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stories`
--

DROP TABLE IF EXISTS `stories`;
CREATE TABLE `stories` (
  `story_id` int(10) UNSIGNED NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `institution_profile_id` int(10) UNSIGNED NOT NULL,
  `description` longtext NOT NULL,
  `banner_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `stories`
--

INSERT INTO `stories` (`story_id`, `timestamp`, `institution_profile_id`, `description`, `banner_image`) VALUES
(94, '2025-01-06 20:57:54', 16, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam varius in nibh at molestie. Ut vehicula ut ex sed gravida.', 'f8cd870d-0222-4e35-8a23-f6422ae80e6b-1000029671.jpg'),
(97, '2025-01-06 20:59:57', 16, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', NULL),
(100, '2025-01-06 21:03:32', 7, 'Egészségtudományi Kar', 'a548a95a-d82e-48a7-a859-a8cdb1b9d2bf-1000029675.jpg'),
(103, '2025-01-19 12:27:15', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(104, '2025-01-19 12:30:10', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(105, '2025-01-19 12:31:18', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(106, '2025-01-19 12:32:10', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', 'bf55d6c9-9309-4e3d-948f-13f9f8d9e91a-1000000038.jpg'),
(113, '2025-01-21 08:45:15', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(116, '2025-01-26 09:39:48', 16, 'asas', NULL),
(117, '2025-01-26 10:14:40', 16, 'cxfdgd', '98a01d04-f39c-4542-9ff4-28f90c5446ee-1000000035.jpg'),
(118, '2025-01-28 21:54:46', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(119, '2025-01-28 21:58:07', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(120, '2025-01-28 21:59:41', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', '752543ed-a05a-486d-ab8a-8ad882cbd81c-favicon.png'),
(121, '2025-01-28 21:59:47', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.', NULL),
(122, '2025-01-28 22:00:03', 16, 'Curabitur eleifend ac lorem vel vehicula. Aenean tempor enim nisl, at mollis augue gravida a.pp', NULL),
(124, '2025-02-07 18:01:54', 16, '', '9233b958-b0d6-4d9c-9ca3-e6af4bae476a-1000000034.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tokens`
--

DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `token_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` varchar(255) NOT NULL,
  `is_valid` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `tokens`
--

INSERT INTO `tokens` (`token_id`, `user_id`, `created_at`, `token`, `is_valid`) VALUES
(6, 19, '2024-10-31 20:29:37', '77165d6d-25cc-4b96-83eb-e1d1d636933f', 1),
(11, 23, '2024-11-01 14:25:52', '4d54ae44-0802-43a7-9742-b3b70cfe425a', 0),
(13, 24, '2024-11-01 14:37:51', '82adf37f-b8db-46b0-a4ce-73e0bc3fea76', 0),
(14, 24, '2024-11-01 15:52:53', '47c52c16-5cc2-4c8e-9a92-6a04180efde6', 0),
(16, 25, '2024-11-01 18:22:49', 'be18d3e3-cf1a-44a7-a7fe-f2d5aa040893', 1),
(22, 19, '2024-11-23 15:11:04', 'dc40036b-f49b-407d-888c-8c993a6519da', 1),
(23, 28, '2024-11-23 17:28:21', '40f1e1ca-d848-46e6-a26e-d46943637ace', 1),
(24, 29, '2024-11-27 19:19:43', 'a3bcbd60-e1c9-4d11-aa51-bceb46925309', 1),
(25, 19, '2024-11-27 20:20:52', '5eb462aa-a038-48c1-a7a1-fb6df0e8e334', 1),
(26, 29, '2024-11-27 20:46:52', '43798f89-f859-4fa3-9d40-88b499fb0bbe', 1),
(27, 29, '2024-11-27 20:47:17', 'e25cea76-ba48-455f-af9f-86d6dd4b79bb', 1),
(28, 29, '2024-11-27 20:47:34', 'e2e87210-f0b8-4b87-a9b6-a7267a65aa64', 1),
(29, 29, '2024-11-27 20:52:49', '4f8b0844-c875-4636-8e45-4d44809c99e0', 1),
(30, 29, '2024-11-27 20:54:46', '6860e7ce-197b-406b-9cc8-bb04dd7e5cd7', 1),
(31, 29, '2024-11-27 20:55:08', '9a0817ab-3953-438b-b5fa-df2173472c1a', 1),
(32, 29, '2024-11-27 20:55:29', '791fb6c7-93bc-40c2-b855-c0cdd02f8fe3', 1),
(33, 29, '2024-11-27 20:56:10', '584ef940-fbfe-4308-9294-7bfe089404c2', 1),
(34, 29, '2024-11-27 20:58:48', 'f36e3cc7-3e2c-4980-a88e-c9eee0654aef', 1),
(35, 29, '2024-11-27 21:00:32', '14ecf901-7c9a-4bef-b706-2128e5f79c02', 1),
(36, 29, '2024-11-27 21:01:03', '472279e5-c220-446f-87d8-b1d61cf83f70', 1),
(37, 28, '2024-11-30 19:41:08', '94c09572-20fd-4242-ab57-79ba6a4b039b', 1),
(38, 28, '2024-11-30 19:46:23', 'e3da31f2-97bc-46a6-aee4-4d96a421ca41', 1),
(39, 28, '2024-11-30 19:52:27', '14b5b122-6a79-4660-8eb2-0556a313f42b', 1),
(40, 28, '2024-11-30 19:53:45', '79f63eb3-64cb-4fb3-96c4-e688abdd4d5e', 1),
(41, 28, '2024-11-30 19:56:58', '33973ad2-a6bb-4bf2-bd84-0652c59b5059', 0),
(42, 28, '2024-11-30 19:59:11', 'd3af04bf-cc23-4b6d-a507-08e4e9caa91e', 0),
(43, 28, '2024-11-30 20:00:21', 'df650e9c-28ce-4ce1-ac38-f882f64b8ec3', 0),
(44, 28, '2024-11-30 20:24:52', '9c54c4ff-a1bd-4990-84e9-f7f16c790b1c', 1),
(45, 28, '2024-11-30 20:25:10', '638075f8-27d6-4353-bf5a-1c7efd841b79', 1),
(46, 28, '2024-11-30 20:25:58', '9be8e826-212a-4275-a088-fa7f7fb9dde4', 1),
(47, 28, '2024-11-30 20:26:09', '648c31b5-53d5-4b10-98bd-31b7dd0d95ee', 0),
(48, 28, '2024-11-30 20:26:47', 'fd07717e-6728-4c48-a293-c2870ac43d63', 1),
(49, 28, '2024-11-30 20:28:14', '188ff2c1-68a6-49f4-9878-16853a80d28e', 0),
(50, 28, '2024-11-30 20:35:54', 'ca598e1c-ebc9-492c-a160-32e169e7af7d', 0),
(51, 28, '2024-12-01 13:05:05', 'c1275f96-1d28-4823-8ae7-cd854abdc389', 1),
(52, 28, '2024-12-01 13:05:26', '7c12c87b-5499-469e-895d-407cca8a51ac', 0),
(53, 25, '2024-12-01 13:31:12', '40f032aa-2438-4114-8e32-e5c46ae2342e', 1),
(54, 25, '2024-12-01 13:31:19', 'c943195b-3466-4ee5-b0f1-bd82ae36cbac', 0),
(62, 28, '2024-12-26 17:33:37', '22c91812-05b6-48e3-ad36-527affb04550', 0),
(64, 28, '2024-12-31 10:11:53', 'bf3e697e-1c60-43f4-af22-210b6379cfdb', 1),
(65, 28, '2024-12-31 10:12:06', '652943ff-64e4-4d53-86fc-df5775712359', 0),
(68, 30, '2024-12-31 15:34:11', '5cc4b468-5786-4730-8193-cc69d602b9a9', 0),
(70, 24, '2025-01-01 23:26:53', '2706d8e1-835c-467e-8192-2efd97da963a', 1),
(71, 24, '2025-01-01 23:26:57', '3d1e06c7-0822-44a4-bc21-9153c4db793c', 1),
(72, 24, '2025-01-01 23:28:25', '86b35583-9ac0-4c21-8a18-7859ee5d79f8', 1),
(73, 24, '2025-01-01 23:29:16', '2f591946-e403-4fdc-90c0-91715a99ad44', 1),
(74, 24, '2025-01-01 23:29:24', '75b118ab-1b39-4682-aa16-0b5bbd9314a3', 1),
(75, 24, '2025-01-01 23:30:01', '9b18f860-ef50-41b8-a8c4-1cbbfa15d4c4', 1),
(76, 24, '2025-01-01 23:32:13', '140fa31e-cbeb-408e-a2e4-d75747709f1d', 1),
(77, 24, '2025-01-01 23:32:14', '3da7db35-fc64-47d3-bcb5-13c0c870d388', 1),
(78, 24, '2025-01-01 23:33:23', '5dafe699-0558-47f4-9e6b-d2df139ae95e', 1),
(79, 24, '2025-01-01 23:33:27', '0386e942-f997-4f46-abcc-31dfcbfadb14', 1),
(80, 24, '2025-01-01 23:33:28', 'b2862c0d-7dda-4b1e-9352-fdd43bcf991f', 1),
(81, 24, '2025-01-01 23:33:29', '0af1d6af-255d-4d6c-9480-66e58f496ff7', 1),
(82, 24, '2025-01-01 23:33:29', '32df676b-9ae2-4daa-a70b-647d6ba2a4f4', 1),
(83, 24, '2025-01-01 23:33:32', 'd343ee2c-a517-4555-802f-30fb719775a0', 1),
(84, 24, '2025-01-01 23:34:51', 'ac508546-27a6-4e66-9e1a-8ad3eb359cdf', 1),
(85, 24, '2025-01-01 23:35:33', 'b08a2888-9e6c-4d82-9a45-eb4bcfbf10bb', 0),
(86, 24, '2025-01-01 23:43:29', 'dd7d4a9e-a989-4e91-875b-d21b124482d0', 1),
(87, 24, '2025-01-02 19:06:57', 'c3ebcce3-671d-4db8-b3c3-76677dbfa0d7', 0),
(88, 19, '2025-01-02 19:07:53', '514df11a-f8a3-4508-8fa7-b106a57ad051', 0),
(90, 28, '2025-01-03 12:43:04', '72fb021e-5235-4ca9-9451-bbdc1ff7dcfa', 0),
(92, 19, '2025-01-03 12:58:11', '14adaed3-1002-4356-8ca7-e6f963a68862', 0),
(97, 28, '2025-01-03 17:04:58', '70de5647-3a74-421a-ac54-2d5ad81d2cc6', 0),
(99, 19, '2025-01-03 17:15:54', '5aaac11f-25bb-4d62-9bb5-cafd00d64a70', 0),
(103, 19, '2025-01-03 19:07:49', 'c4f545d7-8389-4302-be07-424054f3cdc5', 0),
(106, 34, '2025-01-03 19:11:28', '176f2198-5b11-4a7f-b749-60e42d60d550', 0),
(109, 28, '2025-01-03 19:16:24', 'bbedbcf8-1465-4873-91cc-5893b4cfa1e9', 0),
(112, 37, '2025-01-03 19:16:51', 'da4deac0-589d-489d-aa45-4d0907ef3782', 0),
(115, 37, '2025-01-03 19:18:30', 'db523626-69d5-464f-8ca4-5423a1f1cba0', 0),
(118, 34, '2025-01-03 19:20:31', 'f169648a-0ba8-4b41-8ee3-e944a93c2c5d', 0),
(121, 34, '2025-01-03 19:20:49', '4614ee0d-9c75-4011-ab9e-82fa411268e7', 0),
(124, 34, '2025-01-03 19:25:17', '8bc5e32e-8a57-4140-9322-54c88ff0417b', 0),
(127, 37, '2025-01-03 19:25:37', '5a8b6d5e-fbcf-494c-906c-a1029b871a88', 0),
(130, 28, '2025-01-03 19:29:44', 'a34ab077-94c9-4fb3-b781-e06030cc2c30', 0),
(133, 28, '2025-01-03 19:46:59', '56211a15-e447-4d15-96c1-a44535e240e0', 0),
(136, 34, '2025-01-03 19:47:31', 'a55e92cd-0349-4336-9e9d-3091868dcc5b', 0),
(142, 37, '2025-01-03 20:03:37', '3421d8a6-0744-4c74-ae42-bdda1d4e9a14', 0),
(145, 34, '2025-01-03 20:03:54', 'e2f0f6aa-12c1-4c76-a8b8-88f172a121b5', 0),
(148, 28, '2025-01-03 20:04:26', '907ebe50-f171-48c8-9ec6-f6e6d301cd81', 0),
(151, 37, '2025-01-03 20:04:45', 'caaf881f-eea0-4680-87c0-8e06f24cec48', 0),
(154, 28, '2025-01-03 20:07:23', '1dd9dfaf-18a2-460f-a482-cd04d01e068e', 0),
(163, 34, '2025-01-03 20:22:24', 'a31cdc7f-9b95-4e93-91a4-79a5ad9ec0b4', 0),
(166, 34, '2025-01-03 20:30:53', '7a25bcc7-c226-41f8-a1af-734c4da1558e', 0),
(169, 34, '2025-01-03 20:31:09', 'b01b4ec4-d478-4f91-86fc-0a40d2fcce45', 0),
(172, 37, '2025-01-03 20:31:21', '9890e24a-dd27-4aaa-aaaa-3eb238f08e8f', 0),
(178, 37, '2025-01-03 20:52:07', '21362b35-83c2-4b1d-9c33-e35e64317cb2', 0),
(187, 43, '2025-01-03 20:55:43', '000d6448-33a3-4d5e-b294-3b8f566fbd2a', 1),
(190, 37, '2025-01-03 21:34:46', '34e4e017-7e7c-417b-a607-88e5c78b4f9c', 0),
(193, 34, '2025-01-03 21:35:01', '61e5debc-eb3a-4a77-aaad-6e8e3a266303', 0),
(199, 28, '2025-01-03 21:42:50', '4fe0a54d-3028-45c4-b203-d988a129e21f', 0),
(202, 19, '2025-01-03 21:45:53', '8b1dc770-2007-43da-9e94-34fd24645cd2', 0),
(208, 28, '2025-01-04 18:00:37', '61d74afe-810b-4e4a-a80e-b92eaafd18ee', 0),
(211, 34, '2025-01-04 18:04:04', '8a055058-5cb2-49fc-9386-79349687a047', 0),
(214, 37, '2025-01-04 18:06:18', '157fa73d-5d13-4d38-b0da-f9c6fdc5be24', 0),
(217, 46, '2025-01-05 20:13:38', 'e33e6271-6812-42b3-9a91-6abe6ca57a68', 0),
(220, 28, '2025-01-05 20:21:28', '7bb57dc2-76aa-4c95-80f5-d6e248206ae7', 0),
(223, 49, '2025-01-05 20:22:00', '96bfbf00-86dc-4ffc-ad60-a5dfd2699805', 0),
(226, 34, '2025-01-05 20:31:55', 'b8621ece-3000-4e4e-935c-0c53061a814d', 0),
(229, 28, '2025-01-05 20:42:51', '8d351a7f-947c-4a12-ae7f-892069b82286', 0),
(232, 37, '2025-01-05 20:47:35', 'b995dbba-10b4-463a-84c2-1e4d5d06a758', 0),
(235, 34, '2025-01-05 20:47:58', 'f5dc6987-60c3-4f19-8794-bae42b064982', 0),
(238, 28, '2025-01-05 20:52:35', '8a0c4b09-e3a9-4c9d-ad0e-13ab1be6b536', 0),
(241, 49, '2025-01-05 20:53:01', '8130b4de-3fd5-4fa8-9fac-8d4715d8c7ec', 0),
(244, 34, '2025-01-06 20:06:20', 'd9ff159d-c3d6-4725-996a-f6b0248d32b5', 0),
(247, 28, '2025-01-06 20:11:49', 'c406bcbe-811a-4f19-b458-58e0584d847b', 0),
(253, 34, '2025-01-06 20:39:40', '62789902-8ad5-4625-a080-321d380c52df', 0),
(256, 37, '2025-01-06 20:42:07', 'c9503ef9-c13f-4452-b2d8-924c9e317ed5', 0),
(259, 34, '2025-01-06 20:43:21', 'e8aeb30d-9afc-4b41-8ae7-be5d7b68d68f', 0),
(262, 28, '2025-01-06 20:50:02', 'e4fa38d9-4dda-4816-a63c-b54f037b5478', 0),
(268, 34, '2025-01-06 20:54:56', '757dd41d-f449-4d9a-a15f-1403221012d4', 0),
(271, 34, '2025-01-06 20:55:53', '39d4051e-f459-42b1-995d-16ea6c8791d6', 0),
(274, 55, '2025-01-06 20:56:41', 'fe433817-0199-469c-8d97-d2a8e452dc02', 0),
(277, 55, '2025-01-06 20:59:35', 'c221e7b2-6242-4637-8b1b-649807b051c5', 0),
(280, 34, '2025-01-06 21:02:38', '934adcd0-eed4-4158-b28f-2857334d6481', 0),
(283, 37, '2025-01-06 21:03:15', 'ef0fd29f-8130-4fac-aa32-7a33cb2b0595', 0),
(286, 55, '2025-01-06 21:03:58', 'f252f1b9-2e1f-4381-96a6-3dff32387f2e', 0),
(289, 34, '2025-01-06 21:05:14', '373baa07-79c0-4759-91ee-67d97e573c53', 0),
(292, 55, '2025-01-07 10:25:43', 'a4e21f70-d48e-4189-aacd-ef7fdfebd374', 0),
(295, 34, '2025-01-07 10:27:39', '7168fb24-d57e-4776-88fa-8134890213ab', 0),
(298, 55, '2025-01-08 06:10:36', '40f5633f-71d7-4b66-b172-a49617008bec', 0),
(301, 28, '2025-01-08 06:11:55', '4af9f9d3-ff07-4955-a987-68857daaf5fe', 0),
(304, 55, '2025-01-08 06:12:49', '779afcee-fd9d-4bf0-96df-e94960edba8b', 0),
(307, 58, '2025-01-08 06:13:44', '507c5d71-fefe-4625-9ded-648026b44aeb', 0),
(310, 34, '2025-01-09 18:08:52', 'd01d6874-76e0-4137-952b-77a6f75c4f84', 1),
(315, 64, '2025-01-19 10:25:15', '333c3be7-321b-4db2-8bda-13f7f088398b', 0),
(316, 64, '2025-01-19 10:34:18', 'e9d40605-8941-4aba-bd5d-179085b9c1c7', 0),
(317, 64, '2025-01-19 10:44:03', '21e80ec8-286e-4dbb-9dc2-aa3f25c3e2f1', 1),
(318, 55, '2025-01-19 11:42:48', 'ef71ade2-8e7f-4c6c-b0a8-9e3a4c4bd8df', 1),
(319, 34, '2025-01-21 07:16:56', 'cde57a1f-21e9-4dcf-accc-257f0c3dbf1b', 1),
(320, 28, '2025-01-25 16:15:04', '912d0b5e-d8bf-4ead-8552-b7ed58e8b0b4', 1),
(321, 34, '2025-01-25 16:16:15', '54c0ac13-6140-49f5-b84e-a0c6cd2aac0d', 1),
(322, 28, '2025-01-25 16:17:08', '14aec31c-83c3-4b40-8d0d-e39b469c05e1', 1),
(323, 28, '2025-01-25 16:17:36', '83bb00e0-5c4b-4ded-87fd-7725ae163739', 1),
(324, 28, '2025-01-25 16:19:29', 'e0472def-33b0-405a-82c6-c282ecce3c69', 0),
(325, 28, '2025-01-25 17:05:33', '6aa45651-e577-47ec-b7ba-e70c5fc7d9d2', 0),
(326, 37, '2025-01-25 17:50:27', 'db1ec5a2-ce04-41ec-bfc8-a0e822b4a45b', 0),
(327, 55, '2025-01-25 20:27:38', '9267427e-15e9-421a-a472-32c979de7194', 0),
(328, 28, '2025-01-28 19:53:28', '886e8826-1acd-4afc-bb72-be858452cda9', 1),
(329, 28, '2025-01-28 19:53:39', 'eca3f1b4-c398-4f8f-8230-85ec6003cdf8', 0),
(330, 55, '2025-01-28 19:56:47', '1fc437a1-10d3-4b8d-90f5-8edb2a1f55e5', 0),
(331, 34, '2025-01-28 21:07:45', '6f43bd99-dfeb-4a0b-b66b-fb87e98aa8f3', 0),
(332, 55, '2025-01-31 13:56:44', '5c99a436-30dc-4ca5-a44d-566ce8a9d789', 0),
(333, 34, '2025-01-31 13:57:23', '63b04630-81ff-44b6-a32f-35e2df4b174c', 0),
(334, 55, '2025-01-31 15:53:11', '41488b9e-9db1-44ea-9874-64f5575e9b82', 0),
(335, 34, '2025-01-31 15:55:05', '2f0b857b-7ab7-430d-a2cc-647169ef1d83', 0),
(336, 55, '2025-01-31 15:58:55', 'ea2114b2-7aca-4d45-beb5-bc710e355a05', 0),
(337, 34, '2025-01-31 16:40:38', '7fb0bb15-9901-4abd-b8a5-65b9789f45b8', 0),
(338, 55, '2025-01-31 19:08:00', '6f282487-ac2b-48ba-9889-3a309a06e083', 0),
(339, 34, '2025-01-31 19:18:56', 'fd79d4a6-348f-4c25-a2d9-d217061ca178', 1),
(340, 34, '2025-02-01 13:17:06', 'd62891be-8e25-4b85-8c4a-5a8126e4cb43', 1),
(341, 34, '2025-02-04 05:38:31', 'fed86012-e42f-4377-ab39-bc414f7ad03c', 0),
(342, 34, '2025-02-04 08:24:35', '121384be-ce7c-4a62-83d1-29323a0abc3d', 0),
(343, 55, '2025-02-07 17:40:45', 'd2790af0-7b23-41d2-a932-a71f6445575c', 0),
(344, 34, '2025-02-07 21:15:53', '3e065291-fb29-4776-8227-20eba4f30720', 0),
(345, 55, '2025-02-07 21:28:32', '049a446b-7206-40f1-86eb-c8aadc38e6c3', 0),
(346, 34, '2025-02-07 21:32:06', 'cdb6727f-aa5e-4390-a5d9-43c3f3aad351', 1),
(347, 34, '2025-02-07 21:32:22', 'c2a6fcae-411b-43be-93c9-03320efa9d6d', 0),
(348, 55, '2025-02-07 21:40:05', '573c6fbd-66ad-47d3-ab03-30b6cc7e5b09', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `email`, `password`, `name`, `role_id`) VALUES
(19, 'teszt3@teszt.hu', '$2b$10$Hh9/Y3ySePZoYz/2D/Y5werp4wzbZCe2gdl1tqLm8OrxLtT81K9eS', 'Teszt Elek', 2),
(23, 'teszt5@teszt.hu', '$2b$10$0dkUFhz7KjzKwkINMDRHeeT5oRUd.InLI2FIqXZORM/ftg9kfzFsa', 'beni', 2),
(24, 'teszt7@teszt.hu', '$2b$10$BW/QaN8XxUJhvtZhT.HBhuWZxyb3fo9grkeZotZQE4i6yj6c6gRWW', 'beni', 2),
(25, 'tesztelek@teszt.hu', '$2b$10$xXG5ocjaWPalwuxGm5riF.WuVmGINvshwX37pZbdJ2BCDu5b87Kua', 'beni', 3),
(28, 'admin@admin.hu', '$2b$10$AO7wC1dBaM3VRgZlbMrWeuMhGiEUR1jnNEfkjlOjPHrP/CLhEpvrm', 'admin', 1),
(29, 'egy@egy.hu', '$2b$10$43FsnKt4Xigagmv0sSEcguU0sDzJj3MtLhiCOTbjy373ybRI81rLe', 'szanto', 2),
(30, 'tesztelek7@teszt.hu', '$2b$10$NYItRXymJKwTpPBd70ICV.Y1U9VZ6WdXMp9zP6EEsIfpSsxgl.9FO', 'Benn', 3),
(34, 'teszt44@teszt.hu', '$2a$10$FybIsoz4lQS1mS9GC/BtRu/1vBKfeXv6qlHydHI231MZWCPo0Rb1e', 'Szántó benj', 2),
(37, 'tesztelek44@teszt.hu', '$2a$10$v8ziw36NodtR33teFW.MregH0DyQNJ1DD9UvFQOFEQ4UiCjtdhGDC', 'Debreceni Egyetem', 3),
(43, 'dr.3nrg@gmail.com', '$2a$10$DRWZEk4iod/2frwh17qmMOV.e6CkBmsWM4fb4munoRHikB4CGfvS2', 'Csehely Péter', 2),
(46, 'asd@asd.hu', '$2a$10$.MlGfSN2ciVtD4iPamRT/OVvl0lpNnqDTXWf.5G0BSer.hUlfTCSW', 'Kovács István', 2),
(49, 'baross@mail.hu', '$2a$10$8YYRg9aKzIaVz05g/GJbJ.md3W3r1EwRdvinFJWVldJAfGyYttBm6', 'Csak a Baross', 3),
(55, 'hello@belloka.hu', '$2a$10$ckIg0tlWpM5i4PO45kXjl.y6vsMR1hNG3xunr67.LFHNeaYsss5nG', 'Nyíregyházi Egyetem', 3),
(58, 'teszt45@teszt.hu', '$2a$10$.C5.4AVeZywJbya4F4qKF.CacGrJ3YNEk92nw6TBb8R73VsbUUP8a', 'teszt', 2),
(64, 'admin2@admin.hu', '$2a$10$oWAMT5uI52CfUAhD0m1ukuTp153DiUySF0rxBsPoOCNHBw8aFiGcG', 'admin2', 1),
(65, 'teszt007@teszt.hu', '$2a$10$38AuZzZ.v0BeFQ8KvS9J4u.Kuw/Une2jAcNHCb6CqfcOUQal4wMXW', 'teszt', 3),
(66, 'teszt88@teszt.hu', '$2a$10$3tBDkLxFjkIJ5IQcqiWmoeV6FJxHrl0Q1S/McFbyv2WTgJBCWYtbm', 'teszt', 2),
(67, 'teszt99@teszt.hu', '$2a$10$glG14iYmHapqXL1FxXjZf.dnHKoCgYnsOWXqLoZ6HdqPXwXzCD5by', 'teszt99', 3),
(68, 'teszt999@teszt.hu', '$2a$10$iaUORPlOAv09t48HzcmyNeHHAhnhRRpwm2MkI6.ll/HuuNaeUiAOm', 'teszt999', 3),
(69, 'teszt777@teszt.hu', '$2a$10$Y.l7tGyGfVcxPdUet5VaCOsL4qs2/Fc0IuwOguXgXKGdVybWfjnyG', 'teszt', 3),
(70, 'teszt888@teszt.hu', '$2a$10$ZnaRctOefTJZx5dyRtp5hO4ncD4W.qatrdYdRiqY0.Y7PG3b2uVla', 'teszt888', 3),
(71, 'teszt889@teszt.hu', '$2a$10$SJDvBBH6XNMQ1pSAgmM6jeisiQoRXgjQx9NRvtYPHcaILFG7veE8u', 'teszt889', 3),
(72, 'teszt890@teszt.hu', '$2a$10$CHvoEne6t0K.QfdTO.G/FOTeYEwisJV4mUzNqVn8GUY1CxQvkO4b2', 'teszt890', 3),
(73, 'teszt891@teszt.hu', '$2a$10$rLhvjr28ut4W49nFhDvk1.8AR2oA04WgbHr8D4XQ9Im/3sWXiAfA6', 'teszt891', 3),
(74, 'teszt892@teszt.hu', '$2a$10$hkaJk26eVDF1AWZBco3OHuYBRGKcKXvrVdpJ0b0h32VQq9xM2Hly2', 'teszt892', 3),
(75, 'teszt893@teszt.hu', '$2a$10$V4T70ZkWSgE2DnfL6E6X5OK9q8McParhNh9zuKq8R/jt4pLaxhyB.', 'teszt893', 3);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `categories_category_unique` (`category`);

--
-- A tábla indexei `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `events_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `event_links`
--
ALTER TABLE `event_links`
  ADD PRIMARY KEY (`event_link_id`),
  ADD KEY `event_links_event_id_index` (`event_id`);

--
-- A tábla indexei `following`
--
ALTER TABLE `following`
  ADD KEY `following_person_profile_id_index` (`person_profile_id`),
  ADD KEY `following_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `institution_categories`
--
ALTER TABLE `institution_categories`
  ADD KEY `institution_categories_institution_profile_id_index` (`institution_profile_id`),
  ADD KEY `institution_categories_category_id_index` (`category_id`);

--
-- A tábla indexei `institution_profiles`
--
ALTER TABLE `institution_profiles`
  ADD PRIMARY KEY (`institution_profile_id`),
  ADD KEY `institution_profiles_user_id_index` (`user_id`);

--
-- A tábla indexei `interests`
--
ALTER TABLE `interests`
  ADD KEY `person_profile_id` (`person_profile_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- A tábla indexei `likes`
--
ALTER TABLE `likes`
  ADD KEY `likes_person_profile_id_index` (`person_profile_id`),
  ADD KEY `likes_story_id_index` (`story_id`);

--
-- A tábla indexei `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `messages_messaging_room_id_index` (`messaging_room_id`);

--
-- A tábla indexei `messaging_rooms`
--
ALTER TABLE `messaging_rooms`
  ADD PRIMARY KEY (`messaging_room_id`),
  ADD KEY `messaging_rooms_person_profile_id_index` (`person_profile_id`),
  ADD KEY `messaging_rooms_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `person_profiles`
--
ALTER TABLE `person_profiles`
  ADD PRIMARY KEY (`person_profile_id`),
  ADD KEY `person_profiles_user_id_index` (`user_id`);

--
-- A tábla indexei `public_emails`
--
ALTER TABLE `public_emails`
  ADD PRIMARY KEY (`public_email_id`),
  ADD KEY `public_emails_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `public_phones`
--
ALTER TABLE `public_phones`
  ADD PRIMARY KEY (`public_phone_id`),
  ADD KEY `public_phones_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `public_websites`
--
ALTER TABLE `public_websites`
  ADD PRIMARY KEY (`public_website_id`),
  ADD KEY `public_websites_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `roles_role_unique` (`role`);

--
-- A tábla indexei `stories`
--
ALTER TABLE `stories`
  ADD PRIMARY KEY (`story_id`),
  ADD KEY `stories_institution_profile_id_index` (`institution_profile_id`);

--
-- A tábla indexei `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD UNIQUE KEY `tokens_token_unique` (`token`),
  ADD KEY `tokens_user_id_index` (`user_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_index` (`role_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT a táblához `event_links`
--
ALTER TABLE `event_links`
  MODIFY `event_link_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=127;

--
-- AUTO_INCREMENT a táblához `institution_profiles`
--
ALTER TABLE `institution_profiles`
  MODIFY `institution_profile_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT a táblához `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=262;

--
-- AUTO_INCREMENT a táblához `messaging_rooms`
--
ALTER TABLE `messaging_rooms`
  MODIFY `messaging_room_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT a táblához `person_profiles`
--
ALTER TABLE `person_profiles`
  MODIFY `person_profile_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT a táblához `public_emails`
--
ALTER TABLE `public_emails`
  MODIFY `public_email_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT a táblához `public_phones`
--
ALTER TABLE `public_phones`
  MODIFY `public_phone_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT a táblához `public_websites`
--
ALTER TABLE `public_websites`
  MODIFY `public_website_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `stories`
--
ALTER TABLE `stories`
  MODIFY `story_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT a táblához `tokens`
--
ALTER TABLE `tokens`
  MODIFY `token_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=349;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `event_links`
--
ALTER TABLE `event_links`
  ADD CONSTRAINT `event_links_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `following`
--
ALTER TABLE `following`
  ADD CONSTRAINT `following_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `following_person_profile_id_foreign` FOREIGN KEY (`person_profile_id`) REFERENCES `person_profiles` (`person_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `institution_categories`
--
ALTER TABLE `institution_categories`
  ADD CONSTRAINT `institution_categories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `institution_categories_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `institution_profiles`
--
ALTER TABLE `institution_profiles`
  ADD CONSTRAINT `institution_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `interests`
--
ALTER TABLE `interests`
  ADD CONSTRAINT `interests_ibfk_1` FOREIGN KEY (`person_profile_id`) REFERENCES `person_profiles` (`person_profile_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interests_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_person_profile_id_foreign` FOREIGN KEY (`person_profile_id`) REFERENCES `person_profiles` (`person_profile_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_story_id_foreign` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_messaging_room_id_foreign` FOREIGN KEY (`messaging_room_id`) REFERENCES `messaging_rooms` (`messaging_room_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `messaging_rooms`
--
ALTER TABLE `messaging_rooms`
  ADD CONSTRAINT `messaging_rooms_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messaging_rooms_person_profile_id_foreign` FOREIGN KEY (`person_profile_id`) REFERENCES `person_profiles` (`person_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `person_profiles`
--
ALTER TABLE `person_profiles`
  ADD CONSTRAINT `person_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `public_emails`
--
ALTER TABLE `public_emails`
  ADD CONSTRAINT `public_emails_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `public_phones`
--
ALTER TABLE `public_phones`
  ADD CONSTRAINT `public_phones_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `public_websites`
--
ALTER TABLE `public_websites`
  ADD CONSTRAINT `public_websites_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `stories`
--
ALTER TABLE `stories`
  ADD CONSTRAINT `stories_institution_profile_id_foreign` FOREIGN KEY (`institution_profile_id`) REFERENCES `institution_profiles` (`institution_profile_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
