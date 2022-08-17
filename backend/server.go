package main

import (
	"bytes"
	"fmt"
	"log"

	"encoding/base64"
	"encoding/gob"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/golang-jwt/jwt/v4"
)

type Creds struct {
	Username string `json:"username" xml:"username" form:"username"`
	Pass     string `json:"pass" xml:"pass" form:"pass"`
}

type Response struct {
	Status string `json:"status"`
	Text   string `json:"text"`
}

type JsonComment struct {
	Array []Comment
}

// go binary encoder
func ToGOB64(m JsonComment) string {
	b := bytes.Buffer{}
	e := gob.NewEncoder(&b)
	err := e.Encode(m)
	if err != nil {
		fmt.Println(`failed gob Encode`, err)
	}
	return base64.StdEncoding.EncodeToString(b.Bytes())
}

// go binary decoder
func FromGOB64(str string) JsonComment {
	m := JsonComment{}
	by, err := base64.StdEncoding.DecodeString(str)
	if err != nil {
		fmt.Println(`failed base64 Decode`, err)
	}
	b := bytes.Buffer{}
	b.Write(by)
	d := gob.NewDecoder(&b)
	err = d.Decode(&m)
	if err != nil {
		fmt.Println(`failed gob Decode`, err)
	}
	return m
}

func malformedToken(c *fiber.Ctx, w error) error {
	res := Response{Status: "bad", Text: "Malformed token"}
	return c.JSON(res)
}

func main() {
	app := fiber.New()
	db := initDB()
	bad := Response{Status: "bad", Text: "Unauthorized"}
	errResponse := Response{Status: "bad", Text: "Woops something went wrong ¯\\_(ツ)_/¯"}
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3001",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))
	app.Post("/login", func(c *fiber.Ctx) error {
		p := new(Creds)
		if err := c.BodyParser(p); err != nil {
			return err
		}

		var res User
		if err := db.First(&res, "Username = ?", p.Username).Error; err != nil {
			return c.JSON(bad)
		}

		if !CheckPasswordHash(p.Pass, res.Password) {
			return c.JSON(bad)
		}

		token, _ := Sign(p.Username)
		response := Response{Status: "ok", Text: token}
		return c.JSON(response)
	})

	app.Post("/signup", func(c *fiber.Ctx) error {
		details := new(User)

		if err := c.BodyParser(details); err != nil {
			return err
		}

		if !validateUser(*details) {
			return c.JSON(errResponse)
		}
		details.Active = true

		var query User
		if err := db.First(&query, "Username = ?", details.Username).Error; err != nil && query.Username != "" {
			return c.JSON(errResponse)
		}

		hashedPass, err := HashPassword(details.Password)
		if err != nil {
			return c.JSON(errResponse)
		}

		details.Password = hashedPass

		db.Create(details)
		newUser := Response{Status: "ok", Text: "user created successfully"}
		return c.JSON(newUser)
	})

	app.Use(jwtware.New(jwtware.Config{
		SigningKey:   []byte("ShXYLRYfFOw+upPD"),
		ErrorHandler: malformedToken,
	}))

	app.Get("/posts", func(c *fiber.Ctx) error {
		var query []Post
		c.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSONCharsetUTF8)

		db.Find(&query)

		res, err := json.Marshal(query)

		if err != nil {
			return c.JSON(errResponse)
		}

		return c.SendString(string(res))
	})

	app.Get("/posts/:uid", func(c *fiber.Ctx) error {
		var post Post

		db.Select("content").Find(&post, "ID = ?", c.Params("uid"))
		res := Response{Status: "ok", Text: post.Content}
		return c.JSON(res)
	})

	app.Get("/profile/:uid", func(c *fiber.Ctx) error {
		var user APIUser
		if err := db.Model(&User{}).Find(&user, "Username = ?", c.Params("uid")).Error; err != nil {
			return c.JSON(errResponse)
		}
		return c.JSON(user)
	})

	app.Get("/profile", func(c *fiber.Ctx) error {
		var user APIUser
		token := c.Locals("user").(*jwt.Token)
		claims := token.Claims.(jwt.MapClaims)
		name := claims["username"].(string)

		if err := db.Model(&User{}).Find(&user, "Username = ?", name).Error; err != nil {
			return c.JSON(errResponse)
		}
		return c.JSON(user)
	})

	app.Post("/create", func(c *fiber.Ctx) error {
		info := new(Post)

		if err := c.BodyParser(info); err != nil {
			return c.JSON(errResponse)
		}

		user := c.Locals("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		name := claims["username"].(string)

		//figure out how to store user id's instead of usernames
		/*
			var query User
			if err := db.First(&query, "Username = ?", name).Error; err != nil && query.Username != "" {
				return c.JSON(errResponse)
			}
			info.Uuid = query.ID
		*/
		info.Username = name
		db.Create(info)
		newPost := Response{Status: "ok", Text: "post created successfully"}
		return c.JSON(newPost)
	})

	app.Post("/comment", func(c *fiber.Ctx) error {
		var comment Comment
		apiComment := new(APIComment)
		if err := c.BodyParser(apiComment); err != nil {
			return c.JSON(errResponse)
		}

		user := c.Locals("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)
		name := claims["username"].(string)

		comment.PostId = apiComment.PostId
		comment.Text = apiComment.Text
		comment.Commenter = name

		var post Post

		db.Select("comments").Find(&post, "ID = ?", comment.PostId)
		dbComments := FromGOB64(post.Comments)

		comments := JsonComment{Array: append([]Comment{comment}, dbComments.Array...)}
		store := ToGOB64(comments)
		db.Model(&Post{}).Where("ID = ?", comment.PostId).Update("comments", store)
		newComment := Response{Status: "ok", Text: "Comment created successfully"}
		return c.JSON(newComment)
	})

	app.Get("/comments/:uid", func(c *fiber.Ctx) error {
		var post Post

		db.Select("comments").Find(&post, "ID = ?", c.Params("uid"))
		comments := FromGOB64(post.Comments)
		return c.JSON(comments)
	})

	log.Fatal(app.Listen(":3000"))
}
