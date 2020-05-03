#!/bin/bash
API="http://localhost:4741"
URL_PATH="/uploads"
curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}" \
  -F "image=@assets/doubt.jpg"

echo
