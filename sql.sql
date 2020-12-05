create database forum;
create database forum_test;
create database forum_test_others;

use forum;
select * from users;
select * from restaurants where id = 501;
select * from categories;
select * from comments where RestaurantId = 501;
select UserId, count(distinct(RestaurantId)) from comments group by UserId;
select * from comments as c join restaurants as r on c.RestaurantId = r.id where c.UserId = 11 order by name;
select * from favorites;
select * from likes;
select * from followships;

SELECT users.image, users.`name`, users.email, users.`id`, Count(comments.id) as "commentsCount", restaurants.`id`, restaurants.image FROM users JOIN comments ON users.`id` = comments.UserId JOIN restaurants ON restaurants.`id` = comments.RestaurantId GROUP BY restaurants.`id`;
SELECT r.id, r.image 
        FROM users AS u
        JOIN comments As c ON u.id = c.UserId 
        JOIN restaurants As r ON r.id = c.RestaurantId 
        WHERE u.id = "${req.params.id}"
        GROUP BY r.id