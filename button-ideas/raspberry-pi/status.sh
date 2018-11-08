#!/bin/bash

ip_address=$(hostname -I | awk '{print $1}')
button_no=$(hostname | cut -d "-" -f 2)
no_of_processes=$(ps -ef|grep "button-push"|grep -v grep|wc -l)

if (( $no_of_processes > 0 )); then
curl --request PUT \
  --url https://iot-hunt.herokuapp.com/status \
  --header 'Cache-Control: no-cache' \
  --header 'Content-Type: application/json' \
  --data '{"button": "'"$button_no"'", "ip":"'"$ip_address"'"}'
fi