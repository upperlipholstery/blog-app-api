#!/bin/bash

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "note": {
      "tomeId": "'"${TOMEID}"'",
      "body": "'"${BODY}"'"
    }
  }'

echo
