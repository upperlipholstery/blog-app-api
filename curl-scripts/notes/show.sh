#!/bin/sh

API="http://localhost:4741"
URL_PATH="/notes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \

echo
