#!/bin/bash

API="http://localhost:4741"
URL_PATH="/likes"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}"

echo
