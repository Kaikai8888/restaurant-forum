create database forum;
create database forum_test;
create database forum_test_others;

use forum_test;
select * from users;
select * from restaurants;
select * from categories;
select * from comments;
select * from favorites;
select * from likes;

SELECT users.image, users.`name`, users.email, users.`id`, Count(comments.id) as "commentsCount", restaurants.`id`, restaurants.image FROM users JOIN comments ON users.`id` = comments.UserId JOIN restaurants ON restaurants.`id` = comments.RestaurantId GROUP BY restaurants.`id`;
SELECT r.id, r.image 
        FROM users AS u
        JOIN comments As c ON u.id = c.UserId 
        JOIN restaurants As r ON r.id = c.RestaurantId 
        WHERE u.id = "${req.params.id}"
        GROUP BY r.id