# API Description

## Image Search
Upload an image and get product recommendations

**URL** : `/search/`

**Method** : `POST`

**Auth required** : JSON Web Token

**Permissions required** : None

## Request
```json
{
    "image": # base64 encoded string
}
```

## Success Response

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
    ]
}
```
