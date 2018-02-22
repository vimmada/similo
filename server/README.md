# API Description

## Image Search
Upload an image and get product recommendations

**URL** : `/search/`

**Method** : `POST`

**Auth required** : Not yet

**Permissions required** : None

## Request
```json
{
    "image": TODO - not yet implemented- currently using a hard-coded image
    "email": "philosopher@similo.com"
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

## Notes

* For now, the server has "blue jeans" hard-coded in the search since we don't have a good way of filtering keywords from Google Cloud Vision API yet.
