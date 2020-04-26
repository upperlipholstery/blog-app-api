#!/bin/bash

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
  "note": {
    "tomeId": "'"${TOMEID}"'",
    "body": "'"${BODY}"'"
  }
}'
echo
