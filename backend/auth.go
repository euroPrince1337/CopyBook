package main

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var jwtKey = []byte("ShXYLRYfFOw+upPD")

type Claim struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func Sign(username string) (string, error) {
	expirationTime := jwt.NewNumericDate(time.Now().Add(5 * time.Hour))

	claims := &Claim{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: expirationTime,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, err

}
