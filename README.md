# Tome App Api

An API built for use with <blog-app-client> Blog Application utilizing the following technologies:
*Express.js
*Mongoose
*MongoDB

This API is built to be used as the back-end for a blog application. It allows tomes to be registered by users of the API and write their own tomes as well as leave notes for other users. Users can also archive or like tomes, archive adds to their archived tomes list while like records the number of likes on a tome. Personal bios allow users to leave a short description of themselves, see their own or other users' stats, and upload an avatar, which will appear on all their notes and tomes.

## URL's

[front-end repository](https://github.com/upperlipholstery/blog-app-client)
[deployed application](https://upperlipholstery.github.io/blog-app-client/)  

## API End Points

| Verb   | URI Pattern            |
|--------|------------------------|
| POST   | `/sign-up`             |
| POST   | `/sign-in`             |
| DELETE | `/sign-out`            |
| PATCH  | `/change-password`     |
| GET    | `/users/:id`           |
| PATCH  | `/user_bio`            |
| GET    | `/tomes`               |
| POST   | `/tomes`               |
| GET    | `/tomes/:id`           |
| PATCH  | `/tomes/:id`           |
| DELETE | `/tomes/:id`           |
| GET    | `/notes`               |
| POST   | `/notes`               |
| GET    | `/notes/:id`           |
| PATCH  | `/notes/:id`           |
| DELETE | `/notes/:id`           |
| GET    | `/favorites/:id`       |
| POST   | `/favorites`           |
| GET    | `/likes/:id`           |
| POST   | `/likes`               |
| GET    | `/uploads`             |
| POST   | `/uploads`             |
| PATCH  | `/uploads`             |
| DELETE | `/uploads`             |


## Goals for V3
*add the abitlity to start a discussion by replying to an individual note.


## Development
  The first thing to do was to create an ERD to plan out any relationships that we will need to utilize in our database.
  For our blog application we will need to create a model for our blog posts, which will be owned by a user, and a model for comments that will also be owned by a user as well as a blog post. We then need to create routes so that we can CRUD over blogs and comments.

## Entity Relationship Diagram

[ERD for Tome](./TOME_ERD.png)
