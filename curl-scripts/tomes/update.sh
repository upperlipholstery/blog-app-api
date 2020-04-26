#!/bin/bash

API="http://localhost:4741"
URL_PATH="/tomes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
  "tome": {
    "title": "'"${TITLE}"'",
    "body": "'"${BODY}"'"
  }
}'
echo
