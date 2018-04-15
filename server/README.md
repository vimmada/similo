# API Description

## Authentication
When __Auth required__, a server issued JSON web token (JWT) needs to be in the request header. A token can be acquired by creating a user (`POST /users/`) or logging in an existing user (`POST /login/`).

#### Authorization Header format (key, value)
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.82V-Dxj8mlQw2LqpWCuJoBIBN1rEhoUx3OcyOknHJo4
```

## Search
Upload an image and get product recommendations

**URL** : `/search/`

**Method** : `POST`

**Auth required** : JSON Web Token


#### Request
```json
{
    "image": "base64 encode image"
}
```

#### Success Response

**Code** : `201 OK`

```json{
{
    "items": [
        {
            "image_url": "https://images-na.ssl-images-amazon.com/images/I/41PS6nLtWVL.jpg",
            "price": 1999,
            "product_url": "https://www.amazon.com/Wrangler-Authentics-Classic-Regular-Stonewash/dp/B00XKXO4OW?psc=1&SubscriptionId=AKIAIJQWJX5VNAVFF7DQ&tag=similo-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B00XKXO4OW",
            "title": "Wrangler Authentics Men's Classic Regular Fit Jean, Stonewash Mid, 38x32"
        },
        {
            "image_url": "https://images-na.ssl-images-amazon.com/images/I/414p7-yKYAL.jpg",
            "price": 1999,
            "product_url": "https://www.amazon.com/Wrangler-Authentics-Classic-Relaxed-Slate/dp/B074MGN4XG?psc=1&SubscriptionId=AKIAIJQWJX5VNAVFF7DQ&tag=similo-20&linkCode=xm2&camp=2025&creative=165953&creativeASIN=B074MGN4XG",
            "title": "Wrangler Authentics Men's Classic Relaxed Fit Jean, Slate Flex, 38X34"
        }
    ],
    "total_results": 4640,
    "total_returned": 30
}
```

## Saved Items
Add, Delete, and Get saved items

### Get Saved Items
**URL** : `/items/`

**Method** : `GET`

**Auth required** : JSON Web Token


#### Success Response

**Code** : `200 OK`

```json{
{
    "items": [
        {
            "description": "description",
            "image_url": "https://images-na.ssl-images-amazon.com/images/I/61ULEsKgTpL.jpg",
            "item_id": 3,
            "price": 2899,
            "product_url": "http://google.com",
            "title": "Women's Fashion Wedge Sneakers High Top Hidden Wedge Heel Platform Lace Up Shoes Ankle Bootie Blue Jean 7.5"
        }
    ]
}
```

### Add Saved Items
**URL** : `/items/`

**Method** : `PUT`

**Auth required** : JSON Web Token

#### Request
```JSON
{
  	"item": 
  	{
    	"description": "description",
    	"image_url": "https://images-na.ssl-images-amazon.com/images/I/61ULEsKgTpL.jpg",
    	"price": 2899,
        "product_url": "http://google.com",
        "title": "Women's Fashion Wedge Sneakers High Top Hidden Wedge Heel Platform Lace Up Shoes Ankle Bootie Blue Jean 7.5"
  	}
}
```


#### Success Response

**Code** : `201 OK`

```json{
{
    "item": {
        "description": "description",
        "image_url": "https://images-na.ssl-images-amazon.com/images/I/61ULEsKgTpL.jpg",
        "item_id": null,
        "price": 2899,
        "product_url": "http://google.com",
        "title": "Women's Fashion Wedge Sneakers High Top Hidden Wedge Heel Platform Lace Up Shoes Ankle Bootie Blue Jean 7.5"
    }
}
```

### Delete Saved Items
**URL** : `/items/`

**Method** : `DELETE`

**Auth required** : JSON Web Token

#### Request
```JSON
{
  	"item_id" : 5
}
```


#### Success Response

**Code** : `202 OK`

```json{
{
    "message": "Success"
}
```

## History
View past searches

**URL** : `/history/`

**Method** : `GET`

**Auth required** : JSON Web Token


#### Success Response

**Code** : `200 OK`

```json
{
    "history": [
        {
            "date_created": "2018-03-22T01:14:32.597129+00:00",
            "image": "/9j/4QA6RXhpZgAASUkqAAgAAAABA..."
        }
    ]
}
```

## User
Create user, login user

### Create User

**URL** : `/users/`

**Method** : `POST`

**Auth required** : None

#### Request
```json
{
  	"username": "testuser",
  	"email" : "test@testuser.com",
  	"password": "testuserpass",
  	"firstname": "test",
  	"lastname": "user"
}
```

#### Success Response

**Code** : `201 OK`

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.82V-Dxj8mlQw2LqpWCuJoBIBN1rEhoUx3OcyOknHJo4",
    "username": "testuser"
}
```

### Login User

**URL** : `/login/`

**Method** : `POST`

**Auth required** : None

#### Request
```json
{
  	"username": "testuser",
  	"password": "testuserpass",
}
```

#### Success Response

**Code** : `200 OK`

```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIn0.82V-Dxj8mlQw2LqpWCuJoBIBN1rEhoUx3OcyOknHJo4",
    "username": "testuser"
}
```
