package main

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uint `gorm:"primaryKey"`
	Username string
	Password string
	Email    string
	Active   bool
}

type APIUser struct {
	ID       uint
	Username string
	Email    string
}

type Comment struct {
	UID       uint `gorm:"primaryKey"`
	PostId    uint
	Commenter string
	Text      string
}

type APIComment struct {
	PostId uint   `json:"post_id"`
	Text   string `json:"content"`
}

type Post struct {
	ID       uint `gorm:"primaryKey"`
	Content  string
	Username string
	Comments string
}

func initDB() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("users.db"), &gorm.Config{})

	if err != nil {
		panic("failed to open db")
	}

	db.AutoMigrate(&User{})
	db.AutoMigrate(&Post{})
	return db
}

func validateUser(u User) bool {
	if len(u.Username) < 3 {
		return false
	}
	if len(u.Password) < 3 {
		return false
	}

	return true
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
